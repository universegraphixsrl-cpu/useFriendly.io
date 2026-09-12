export const kpiSummary = {
  /** Sumă încasată efectiv, în euro */
  collected: { current: 186450, previous: 169800 },
  /** Clienți noi (primul contract semnat) */
  newClients: { current: 64, previous: 57 },
  /** Total facturat în luna respectivă, pentru procentul de colectare */
  invoiced: { current: 243900, previous: 232400 },
  /** Oportunități intrate în etapa de ofertă și câte s-au închis */
  closing: {
    closed: 97,
    opportunities: 312,
    previousClosed: 88,
    previousOpportunities: 305
  }
};

export const formatEur = (value: number) => `${value.toLocaleString('ro-RO')} €`;

export const formatPercent = (value: number) =>
`${value.toFixed(1).replace('.', ',')}%`;

export const percentChange = (current: number, previous: number) =>
(current - previous) / previous * 100;