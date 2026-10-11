import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseConfigured, type Role } from './supabase';

/**
 * Automatizările: citirea și scrierea regulilor.
 *
 * Execuția NU se întâmplă aici. Regulile sunt aplicate de baza de date
 * (vezi supabase/08_automatizari.sql), ca să ruleze și noaptea, când
 * nu e nimeni logat. Aplicația doar le scrie și arată ce s-a întâmplat.
 */

export type TriggerKind = 'lead_added_to_list' | 'lead_idle';

export type ActionKind = 'assign' | 'set_status' | 'move_list' | 'create_task';

export interface AutomationAction {
  kind: ActionKind;
  /** assign: pe responsabil sau pe caller */
  field?: 'owner' | 'caller';
  /** assign: o persoană anume, sau cel mai puțin încărcat din rol */
  mode?: 'person' | 'balanced';
  name?: string;
  role?: Role;
  /** set_status */
  status?: string;
  /** move_list */
  list_id?: string;
  /** create_task */
  title?: string;
  assignee?: string;
  due_days?: number;
}

export interface Automation {
  id: string;
  name: string;
  active: boolean;
  triggerKind: TriggerKind;
  /** gol = orice listă */
  triggerListId: string;
  triggerDays: number;
  /** gol = orice status */
  triggerStatus: string;
  actions: AutomationAction[];
}

export interface AutomationRun {
  id: number;
  automationId: string;
  leadId: string;
  summary: string;
  status: string;
  detail: string;
  ranAt: string;
}

export function blankAutomation(): Automation {
  return {
    id: `auto-${Date.now()}`,
    name: '',
    active: true,
    triggerKind: 'lead_added_to_list',
    triggerListId: '',
    triggerDays: 3,
    triggerStatus: '',
    actions: []
  };
}

function fromRow(row: any): Automation {
  return {
    id: row.id,
    name: row.name ?? '',
    active: Boolean(row.active),
    triggerKind: (row.trigger_kind ?? 'lead_added_to_list') as TriggerKind,
    triggerListId: row.trigger_list_id ?? '',
    triggerDays: Number(row.trigger_days) || 3,
    triggerStatus: row.trigger_status ?? '',
    actions: Array.isArray(row.actions) ? row.actions : []
  };
}

function toRow(item: Automation) {
  return {
    id: item.id,
    name: item.name,
    active: item.active,
    trigger_kind: item.triggerKind,
    trigger_list_id: item.triggerListId,
    trigger_days: item.triggerDays,
    trigger_status: item.triggerStatus,
    actions: item.actions
  };
}

/** Lipsește tabelul? Înseamnă că migrarea n-a fost rulată. */
const MISSING = 'Automatizările n-au încă unde să fie salvate — rulează supabase/08_automatizari.sql.';

export function useAutomations() {
  const [items, setItems] = useState<Automation[]>([]);
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const [rules, history] = await Promise.all([
    supabase.from('automations').select('*').order('created_at', { ascending: true }),
    supabase.
    from('automation_runs').
    select('*').
    order('ran_at', { ascending: false }).
    limit(40)]
    );

    if (rules.error) {
      setError(
        rules.error.message.includes('automations') ? MISSING : rules.error.message
      );
      setLoading(false);
      return;
    }

    setItems((rules.data ?? []).map(fromRow));
    setRuns(
      (history.data ?? []).map((row: any) => ({
        id: row.id,
        automationId: row.automation_id,
        leadId: row.lead_id ?? '',
        summary: row.summary ?? '',
        status: row.status ?? 'ok',
        detail: row.detail ?? '',
        ranAt: row.ran_at
      }))
    );
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (item: Automation): Promise<string | null> => {
    if (!supabaseConfigured) return 'Fără baza de date conectată nu se poate salva.';
    const { error: saveError } = await supabase.
    from('automations').
    upsert(toRow(item));
    if (saveError) {
      return saveError.message.includes('automations') ? MISSING : saveError.message;
    }
    await load();
    return null;
  };

  const remove = async (id: string): Promise<string | null> => {
    if (!supabaseConfigured) return 'Fără baza de date conectată nu se poate șterge.';
    const { error: deleteError } = await supabase.
    from('automations').
    delete().
    eq('id', id);
    if (deleteError) return deleteError.message;
    await load();
    return null;
  };

  return { items, runs, loading, error, save, remove, reload: load };
}

/**
 * Rulează o regulă pe un lead ales, imediat.
 *
 * Există pentru că o regulă de tip „stă de 3 zile" altfel nu s-ar putea
 * verifica decât așteptând 3 zile. Proba face exact ce ar face execuția
 * automată — inclusiv modificările pe lead — doar că ignoră vechimea.
 */
export async function testAutomation(
automationId: string,
leadId: string)
: Promise<string> {
  if (!supabaseConfigured) return 'Fără baza de date conectată, proba nu merge.';

  const { data, error } = await supabase.rpc('test_automation', {
    p_automation_id: automationId,
    p_lead_id: leadId
  });

  if (error) {
    return error.message.includes('test_automation') ?
    'Proba are nevoie de migrarea 08_automatizari.sql.' :
    error.message;
  }
  return (data as string) ?? 'Regula a rulat.';
}

/** Declanșatorul, scris pe înțelesul omului */
export function describeTrigger(
item: Automation,
listName: (id: string) => string)
: string {
  if (item.triggerKind === 'lead_added_to_list') {
    return item.triggerListId ?
    `Când intră un lead nou în „${listName(item.triggerListId)}"` :
    'Când intră un lead nou în orice listă';
  }
  const zile = item.triggerDays === 1 ? 'o zi' : `${item.triggerDays} zile`;
  return item.triggerStatus ?
  `Când un lead stă ${zile} în „${item.triggerStatus}" fără nicio mișcare` :
  `Când un lead stă ${zile} fără nicio mișcare`;
}

/** O acțiune, scrisă pe înțelesul omului */
export function describeAction(
action: AutomationAction,
listName: (id: string) => string)
: string {
  const roleLabel: Record<string, string> = {
    caller: 'callerul',
    closer: 'closerul',
    manager: 'managerul',
    marketer: 'marketerul',
    admin: 'administratorul'
  };

  if (action.kind === 'assign') {
    const camp = action.field === 'caller' ? 'Callerul' : 'Responsabilul';
    return action.mode === 'balanced' ?
    `${camp} devine ${roleLabel[action.role ?? 'caller'] ?? 'omul'} cu cele mai puține leaduri` :
    `${camp} devine ${action.name || '(nimeni ales)'}`;
  }
  if (action.kind === 'set_status') {
    return `Statusul devine „${action.status || '(neales)'}"`;
  }
  if (action.kind === 'move_list') {
    return `Leadul se mută în „${listName(action.list_id ?? '')}"`;
  }
  const cui =
  action.assignee === 'owner' ?
  'responsabilului' :
  action.assignee === 'caller' ?
  'callerului' :
  action.assignee || '(nimeni)';
  const termen =
  !action.due_days || action.due_days === 0 ?
  'cu termen azi' :
  action.due_days === 1 ?
  'cu termen mâine' :
  `cu termen peste ${action.due_days} zile`;
  return `Se creează task-ul „${action.title || 'fără titlu'}" pentru ${cui}, ${termen}`;
}
