/** Tipurile de declanșatori și acțiuni disponibile în regulile unui funnel */

export type TriggerKind = 'form' | 'page';

export interface TriggerOption {
  kind: TriggerKind;
  label: string;
  description: string;
}

export const triggerOptions: TriggerOption[] = [
{
  kind: 'form',
  label: 'Formular din pas completat',
  description:
  'Se declanșează când un contact tocmai s-a înscris printr-un formular'
},
{
  kind: 'page',
  label: 'Pagină vizitată',
  description: 'Se declanșează când o persoană vizitează pagina selectată'
}];


/** Ce configurare suplimentară cere fiecare acțiune */
export type ActionConfig =
'campaign' |
'tag' |
'course' |
'bundle' |
'community' |
'pipeline' |
'email' |
'emailAddress' |
'sms' |
'webhook' |
'none';

export interface ActionOption {
  id: string;
  label: string;
  description: string;
  config: ActionConfig;
}

export const actionOptions: ActionOption[] = [
{
  id: 'subscribe-campaign',
  label: 'Abonează la o campanie',
  description: 'Abonează contactul la o campanie de marketing',
  config: 'campaign'
},
{
  id: 'unsubscribe-campaign',
  label: 'Dezabonează de la o campanie',
  description: 'Scoate contactul dintr-o campanie de marketing',
  config: 'campaign'
},
{
  id: 'add-tag',
  label: 'Atribuie tag',
  description: 'Atribuie un tag contactului',
  config: 'tag'
},
{
  id: 'remove-tag',
  label: 'Elimină tag',
  description: 'Elimină un tag de pe contact',
  config: 'tag'
},
{
  id: 'send-email',
  label: 'Trimite email',
  description: 'Trimite un email către contact',
  config: 'email'
},
{
  id: 'send-email-address',
  label: 'Trimite email către o adresă anume',
  description: 'Trimite un email către o adresă specificată de tine',
  config: 'emailAddress'
},
{
  id: 'enroll-course',
  label: 'Înscrie în curs',
  description: 'Oferă contactului acces la un curs',
  config: 'course'
},
{
  id: 'revoke-course',
  label: 'Revocă accesul la curs',
  description: 'Scoate contactul dintr-un curs',
  config: 'course'
},
{
  id: 'send-webhook',
  label: 'Trimite webhook',
  description:
  'Trimite o cerere HTTP către un URL atunci când evenimentul se produce',
  config: 'webhook'
},
{
  id: 'grant-community',
  label: 'Oferă acces la comunitate',
  description: 'Permite contactului să intre într-o comunitate',
  config: 'community'
},
{
  id: 'revoke-community',
  label: 'Revocă accesul la comunitate',
  description: 'Retrage accesul contactului la comunitate',
  config: 'community'
},
{
  id: 'enroll-bundle',
  label: 'Înscrie într-un pachet de cursuri',
  description: 'Oferă contactului acces la un pachet de cursuri',
  config: 'bundle'
},
{
  id: 'revoke-bundle',
  label: 'Revocă accesul la pachetul de cursuri',
  description: 'Retrage accesul contactului la pachetul de cursuri',
  config: 'bundle'
},
{
  id: 'pipeline-stage',
  label: 'Adaugă într-o etapă de pipeline',
  description: 'Adaugă sau mută contactul într-o etapă de pipeline',
  config: 'pipeline'
},
{
  id: 'send-sms',
  label: 'Trimite SMS',
  description: 'Trimite un SMS către contact',
  config: 'sms'
}];


export const communityOptions = [
'Comunitatea Friendly',
'Grup closeri',
'Mastermind clienți'];


export const bundleOptions = [
'Pachet onboarding complet',
'Pachet proceduri vânzări'];


export const pipelineStages = [
'Înscriși webinar',
'Programați book-a-call',
'Apeluri ținute',
'Clienți plătitori'];