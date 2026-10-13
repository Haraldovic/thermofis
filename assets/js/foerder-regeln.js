(function (root, factory) {
  const rules = factory();
  if (typeof module === 'object' && module.exports) module.exports = rules;
  else root.ThermofisFundingRules = rules;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  return Object.freeze({
    schemaVersion: 1,
    version: '2026-10-13',
    checkedAt: '2026-10-13',
    reviewDue: '2026-11-12',
    validFrom: '2026-07-21',
    validUntil: '2027-01-31',
    heatPumpReviewFrom: '2027-01-01',
    vatRate: 0.19,
    heatPump: Object.freeze({baseRate: 0.30, climateRate: 0.16, eligibleCostCap: 28000, generalRateCap: 0.70, lowIncomeRateCap: 0.80, incomeThresholds: Object.freeze([30000, 40000, 50000]), incomeRates: Object.freeze([0.40, 0.30, 0.10]), childThresholdAllowance: 10000, incomeTaxYears: Object.freeze([2023, 2024])}),
    floorHeating: Object.freeze({baseRate: 0.15, eligibleCostCap: 30000, minHeatAgeExclusive: 2, maxFossilHeatAgeInclusive: 20, maxFlowTemperature: 35, minInvestment: 300}),
    sources: Object.freeze([
      {label: 'KfW 458 · Heizungsförderung', url: 'https://www.kfw.de/458'},
      {label: 'KfW-Merkblatt · Stand 09/2026', url: 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-%28Inlandsf%C3%B6rderung%29/PDF-Dokumente/6000005131_M_458.pdf'},
      {label: 'BAFA · Heizungsoptimierung', url: 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Sanierung_Wohngebaeude/Heizungsoptimierung/heizungsoptimierung_node.html'},
      {label: 'BEG-Richtlinie · 17.08.2026', url: 'https://www.bundesanzeiger.de/pub/publication/jLXvW09kHTQoDINAdoC/content/jLXvW09kHTQoDINAdoC/BAnz%20AT%2027.08.2026%20B1.pdf?inline='},
      {label: 'Förderfähige Maßnahmen · 09/2026', url: 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-%28Inlandsf%C3%B6rderung%29/PDF-Dokumente/6000004863_Infoblatt_BEG_F%C3%B6rderf%C3%A4hige_Ma%C3%9Fnahmen.pdf'},
      {label: '§ 35c EStG · energetische Maßnahmen', url: 'https://www.gesetze-im-internet.de/estg/__35c.html'},
      {label: '§ 35a EStG · Handwerkerleistungen', url: 'https://www.gesetze-im-internet.de/estg/__35a.html'},
      {label: '§ 12 UStG · Umsatzsteuersatz', url: 'https://www.gesetze-im-internet.de/ustg_1980/__12.html'}
    ])
  });
});
