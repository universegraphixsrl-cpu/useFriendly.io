import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../components/Toast';
import { ActionModal, type ActionField } from '../components/ActionModal';
import { useWorkspace } from './WorkspaceContext';
import { UNASSIGNED } from '../data/leads';
import { viewPath } from '../appRoutes';

type FormModal = {
  kind: 'form';
  title: string;
  description?: string;
  fields: ActionField[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
};

type ConfirmModal = {
  kind: 'confirm';
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
};

type MenuModal = {
  kind: 'menu';
  title: string;
  description?: string;
  actions: Array<{
    label: string;
    danger?: boolean;
    onClick: () => void;
  }>;
};

type Modal = FormModal | ConfirmModal | MenuModal;

interface UiActionsValue {
  notify: (message: string) => void;
  openForm: (modal: Omit<FormModal, 'kind'>) => void;
  openConfirm: (modal: Omit<ConfirmModal, 'kind'>) => void;
  openMenu: (modal: Omit<MenuModal, 'kind'>) => void;
  runLabel: (label: string, context?: string) => void;
}

const UiActionsContext = createContext<UiActionsValue | null>(null);

function reactHasOnClick(element: HTMLElement) {
  const key = Object.keys(element).find(
    (item) =>
    item.startsWith('__reactProps$') || item.startsWith('__reactEventHandlers$')
  );
  if (!key) return false;
  const props = (element as unknown as Record<string, {onClick?: unknown;}>)[
  key];
  return typeof props?.onClick === 'function';
}

export function UiActionsProvider({ children }: {children: React.ReactNode;}) {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const close = () => setModal(null);

  const openForm = useCallback((next: Omit<FormModal, 'kind'>) => {
    setModal({ kind: 'form', ...next });
  }, []);

  const openConfirm = useCallback((next: Omit<ConfirmModal, 'kind'>) => {
    setModal({ kind: 'confirm', ...next });
  }, []);

  const openMenu = useCallback((next: Omit<MenuModal, 'kind'>) => {
    setModal({ kind: 'menu', ...next });
  }, []);

  const runLabel = useCallback(
    (rawLabel: string, context?: string) => {
      const label = rawLabel.replace(/\s+/g, ' ').trim();
      const lower = label.toLowerCase();

      const submitForm = (
      title: string,
      fields: ActionField[],
      onSubmit: (values: Record<string, string>) => void,
      description?: string) =>
      {
        openForm({
          title,
          description,
          fields,
          submitLabel: 'Salvează',
          onSubmit: (values) => {
            onSubmit(values);
            close();
          }
        });
      };

      if (/proiect/.test(lower)) {
        submitForm(
          context ? `Editează ${context}` : 'Proiect nou',
          [
          { name: 'name', label: 'Nume proiect', placeholder: 'Ex. Lansare curs' },
          { name: 'client', label: 'Client', placeholder: 'Nume client' },
          { name: 'value', label: 'Valoare', placeholder: '12.000 €' }],

          (values) => {
            workspace.addProject({
              name: values.name || 'Proiect fără nume',
              client: values.client || 'Client nou',
              value: values.value || '0 €'
            });
            notify(context ? 'Proiectul a fost actualizat' : 'Proiectul a fost creat');
          },
          context
        );
        return;
      }

      if (/contact|lead|import/.test(lower)) {
        submitForm(
          /import/.test(lower) ? 'Importă leaduri' : 'Adaugă contact',
          [
          { name: 'firstName', label: 'Prenume' },
          { name: 'lastName', label: 'Nume' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Telefon' }],

          (values) => {
            workspace.addContact({
              firstName: values.firstName || 'Lead',
              lastName: values.lastName || 'Nou',
              email: values.email || '',
              phone: values.phone || ''
            });
            notify('Contactul a fost adăugat în Leads');
            navigate(viewPath.leads);
          }
        );
        return;
      }

      if (/automatiz|workflow|flux/.test(lower)) {
        navigate(viewPath.automations);
        notify('Deschide automatizările pentru a configura fluxul');
        return;
      }

      if (/reminder|trimite/.test(lower)) {
        submitForm(
          'Trimite reminder',
          [
          { name: 'to', label: 'Destinatar' },
          { name: 'channel', label: 'Canal (Email, SMS, WhatsApp)' },
          { name: 'message', label: 'Mesaj' }],

          (values) => {
            notify(`Reminder trimis către ${values.to || 'destinatar'} pe ${values.channel || 'Email'}`);
          }
        );
        return;
      }

      if (/ofert/.test(lower)) {
        submitForm(
          'Generează ofertă',
          [
          { name: 'client', label: 'Client' },
          { name: 'offer', label: 'Pachet / ofertă' },
          { name: 'value', label: 'Valoare' }],

          (values) => notify(`Oferta pentru ${values.client || 'client'} a fost pregătită`)
        );
        return;
      }

      if (/apel|programeaz|calendar/.test(lower)) {
        navigate(viewPath.calendar);
        notify('Deschide calendarul pentru a programa apelul');
        return;
      }

      if (/email|secven/.test(lower) || /marketing/.test(lower)) {
        navigate(viewPath.marketing);
        notify('Deschide marketingul pentru secvența de emailuri');
        return;
      }

      if (/factur|emite/.test(lower) || /billing|plată|plata/.test(lower)) {
        if (/link/.test(lower)) {
          navigate(viewPath.payments);
          return;
        }
        navigate(viewPath.billing);
        notify('Deschide facturarea');
        return;
      }

      if (/integr/.test(lower) || /catalog|conecteaz|configureaz/.test(lower)) {
        navigate(viewPath.integrations);
        return;
      }

      if (/delog|ieși din cont|logout/.test(lower)) {
        openConfirm({
          title: 'Deloghează-te',
          description: 'Sesiunea de preview rămâne locală. Confirmă ca să revii la panou.',
          confirmLabel: 'Deloghează-te',
          onConfirm: () => {
            close();
            workspace.setActiveUser(null);
            navigate(viewPath.dashboard);
            notify('Ai ieșit din sesiunea curentă');
          }
        });
        return;
      }

      if (/șterge|sterge|delete/.test(lower)) {
        openConfirm({
          title: context ? `Ștergi ${context}?` : 'Ștergi elementul?',
          description: 'Acțiunea rămâne în sesiunea locală, fără backend.',
          confirmLabel: 'Șterge',
          danger: true,
          onConfirm: () => {
            if (context) workspace.removeProjectByName(context);
            close();
            notify('Elementul a fost șters');
          }
        });
        return;
      }

      if (/editeaz|opțiuni|optiuni|filtre/.test(lower)) {
        openMenu({
          title: context ? context : label,
          description: 'Alege o acțiune pentru acest element.',
          actions: [
          {
            label: 'Editează',
            onClick: () => runLabel('Editează proiect', context)
          },
          {
            label: 'Duplică',
            onClick: () => {
              close();
              notify(`${context ?? 'Elementul'} a fost duplicat`);
            }
          },
          {
            label: 'Șterge',
            danger: true,
            onClick: () => runLabel('Șterge', context)
          }]

        });
        return;
      }

      submitForm(
        label || 'Acțiune',
        [
        { name: 'detail', label: 'Detalii', placeholder: 'Completează și salvează' }],

        (values) => notify(`„${label}” a fost înregistrat${values.detail ? `: ${values.detail}` : ''}`),
        context ? `Pentru ${context}` : 'Acțiunea se salvează doar în această sesiune.'
      );
    },
    [navigate, notify, openConfirm, openForm, openMenu, workspace]
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const button = target.closest('button');
      if (!button || button.disabled) return;
      if (button.closest('[data-ui-modal]')) return;
      if (reactHasOnClick(button)) return;
      event.preventDefault();
      event.stopPropagation();
      const context =
      button.getAttribute('aria-label')?.replace(/^Opțiuni pentru\s+/i, '') ??
      undefined;
      runLabel(button.innerText || button.getAttribute('aria-label') || 'Acțiune', context);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [runLabel]);

  const value = useMemo(
    () => ({ notify, openForm, openConfirm, openMenu, runLabel }),
    [notify, openForm, openConfirm, openMenu, runLabel]
  );

  return (
    <UiActionsContext.Provider value={value}>
      {children}
      {toast && <Toast message={toast} />}
      {modal &&
      <ActionModal
        modal={modal}
        onClose={close} />

      }
    </UiActionsContext.Provider>);

}

export function useUiActions() {
  const value = useContext(UiActionsContext);
  if (!value) {
    throw new Error('useUiActions trebuie folosit în UiActionsProvider');
  }
  return value;
}
