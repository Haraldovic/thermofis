(function (root, factory) {
  const rules = typeof module === 'object' && module.exports ? require('./foerder-regeln.js') : root.ThermofisFundingRules;
  const api = factory(rules);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {root.ThermofisCalculator = api; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', api.mount); else api.mount();}
})(typeof globalThis !== 'undefined' ? globalThis : this, function (rules) {
  'use strict';
  const money = new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR', maximumFractionDigits: 0});
  function parseNumber(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
    let text = String(value == null ? '' : value).trim().replace(/[\s\u00a0€]/g, '');
    if (!text || !/^-?\d[\d.,]*$/.test(text)) return NaN;
    if (text.includes(',')) text = text.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(text)) text = text.replace(/\./g, '');
    return Number(text);
  }
  function dateKey(date) {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    return new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'}).format(date instanceof Date ? date : new Date());
  }
  function isDateKey(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const parsed = new Date(value + 'T12:00:00Z');
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }
  function rulesStatus(now, monitor) {
    const today = dateKey(now);
    const hardExpired = today > rules.validUntil || today < rules.validFrom;
    const invalidMonitorDate = monitor && monitor.status === 'checked' && (!isDateKey(monitor.checkedAt) || monitor.checkedAt > today);
    const monitorBlocked = monitor && (['loading', 'needs-review', 'unavailable'].includes(monitor.status) || invalidMonitorDate);
    const checkedAt = monitor && monitor.status === 'checked' && !invalidMonitorDate ? monitor.checkedAt : rules.checkedAt;
    const age = (Date.parse(today + 'T12:00:00Z') - Date.parse(checkedAt + 'T12:00:00Z')) / 86400000;
    const stale = age > 30;
    return {today, hardExpired, monitorBlocked: Boolean(monitorBlocked), stale, checkedAt, allowed: !hardExpired && !monitorBlocked && !stale, heatPumpYearReview: today >= rules.heatPumpReviewFrom};
  }
  function calculate(input, now, monitor) {
    const project = input.project === 'floor' ? 'floor' : 'pump';
    const status = rulesStatus(now, monitor);
    const cost = project === 'floor' ? parseNumber(input.area) * parseNumber(input.unitCost) : parseNumber(input.cost);
    const reasons = [];
    if (!Number.isFinite(cost) || cost <= 0 || (project === 'pump' && (cost < 5000 || cost > 150000)) || (project === 'floor' && (!Number.isFinite(parseNumber(input.area)) || parseNumber(input.area) < 10 || parseNumber(input.area) > 500 || parseNumber(input.unitCost) < 10 || parseNumber(input.unitCost) > 500))) return {project, status, validCost: false, grant: null, reasons: ['Bitte geben Sie Werte innerhalb der angegebenen Grenzen ein.']};
    if (input.building !== 'single') reasons.push('Die Förderberechnung ist für ein privates Einfamilienhaus mit genau einer Wohneinheit ausgelegt. Für Neubau, Mehrfamilienhaus oder WEG ist eine individuelle Prüfung nötig.');
    if (input.ownership !== 'private') reasons.push('Privates Eigentum und fehlender Vorsteuerabzug müssen für diese Berechnung bestätigt sein.');
    if (input.existing !== 'yes') reasons.push('Der Bauantrag bzw. die Bauanzeige muss mindestens fünf Jahre zurückliegen.');
    if (input.stage !== 'planning') reasons.push('Der Förderantrag muss vor Beginn der Arbeiten gestellt werden; ein vorheriger Vertrag braucht die vorgeschriebene Förderbedingung.');
    if (input.technical !== 'yes') reasons.push('Förderfähige Technik, Kostenumfang und technische Mindestanforderungen müssen durch den Fachbetrieb geprüft sein.');
    if (input.previousFunding !== 'none') reasons.push('Bereits beanspruchte Förderhöchstbeträge oder andere öffentliche Förderung müssen individuell geprüft werden.');
    const heatAgeInput = String(input.heatAge == null ? '' : input.heatAge).trim();
    if (heatAgeInput && (!Number.isFinite(parseNumber(input.heatAge)) || parseNumber(input.heatAge) < 0 || parseNumber(input.heatAge) > 150)) reasons.push('Bitte ein gültiges Anlagenalter von 0 bis 150 Jahren eingeben.');
    if (status.hardExpired || (project === 'pump' && status.heatPumpYearReview)) reasons.push('Der gespeicherte Regelstand ist für diesen Zeitpunkt nicht freigegeben. Bitte lassen Sie die aktuellen Konditionen prüfen.');
    if (status.stale) reasons.push('Die letzte Quellenprüfung liegt mehr als 30 Tage zurück. Förderzahlen bleiben bis zur erneuten Prüfung ausgeblendet.');
    if (status.monitorBlocked) reasons.push(monitor.status === 'loading' ? 'Der Förderstatus wird gerade geprüft.' : 'Der Quellenabgleich erfordert eine erneute fachliche Prüfung. Förderzahlen sind vorübergehend ausgeblendet.');
    const details = [];
    let rate = project === 'floor' ? rules.floorHeating.baseRate : rules.heatPump.baseRate;
    let cap = project === 'floor' ? rules.floorHeating.eligibleCostCap : rules.heatPump.eligibleCostCap;
    if (project === 'floor') {
      const age = parseNumber(input.heatAge);
      if (!Number.isFinite(age) || age <= rules.floorHeating.minHeatAgeExclusive) reasons.push('Die bestehende Heizungsanlage muss älter als zwei Jahre sein.');
      if (!input.heatType || input.heatType === 'unknown') reasons.push('Die Art der bestehenden Heizung muss bekannt sein.');
      const fossil = ['oil', 'gas', 'gas-floor', 'coal'].includes(input.heatType);
      if (fossil && age > rules.floorHeating.maxFossilHeatAgeInclusive) reasons.push('Bei fossiler Heizung darf die bestehende Anlage für diesen Förderweg nicht älter als 20 Jahre sein.');
      if (input.hydraulic !== 'yes') reasons.push('Ein hydraulisch abgeglichenes Heizsystem ist erforderlich; falls nötig, ist Verfahren B durchzuführen.');
      if (input.lowTemperature !== 'yes') reasons.push('Für diesen Förderweg muss der erstmalige Einbau der Flächenheizung mit System-Vorlauftemperatur höchstens 35 °C bestätigt sein.');
      details.push({label: 'BAFA-Grundförderung', rate});
      details.push({label: 'iSFP-Bonus', note: 'Nicht eingerechnet. Seit 21.07.2026 gelten zusätzliche Mindestinvestitionen und eine gesonderte Berechnungsbasis; individuell prüfen lassen.'});
    } else {
      details.push({label: 'KfW-Grundförderung', rate: rules.heatPump.baseRate});
      const selfUse = input.selfUse === 'yes';
      const climateType = ['oil', 'coal', 'gas-floor', 'night-storage'].includes(input.heatType) || (['gas', 'biomass'].includes(input.heatType) && parseNumber(input.heatAge) >= 20);
      const climate = selfUse && input.functional === 'yes' && input.disposal === 'yes' && input.fossilRetained === 'no' && climateType;
      if (climate) {rate += rules.heatPump.climateRate; details.push({label: 'Klimageschwindigkeitsbonus', rate: rules.heatPump.climateRate});}
      const income = parseNumber(input.income);
      if (String(input.income == null ? '' : input.income).trim() && (!Number.isFinite(income) || income < 0)) reasons.push('Bitte ein gültiges, nicht negatives zu versteuerndes Haushaltseinkommen eingeben oder die freiwillige Angabe leer lassen.');
      let incomeRate = 0;
      const adjustedIncome = income - (input.minorChild === true ? rules.heatPump.childThresholdAllowance : 0);
      if (selfUse && Number.isFinite(income) && income >= 0) {
        const band = rules.heatPump.incomeThresholds.findIndex(limit => adjustedIncome <= limit);
        if (band >= 0) incomeRate = rules.heatPump.incomeRates[band];
        if (incomeRate) {rate += incomeRate; details.push({label: 'Einkommensbonus', rate: incomeRate});}
      }
      const rateCap = selfUse && Number.isFinite(income) && income >= 0 && adjustedIncome <= 30000 ? rules.heatPump.lowIncomeRateCap : rules.heatPump.generalRateCap;
      rate = Math.round(Math.min(rate, rateCap) * 10000) / 10000;
      if (!climate) details.push({label: 'Klimageschwindigkeitsbonus', note: 'Nicht angesetzt: nur bei bestätigter Selbstnutzung, passender funktionsfähiger Altanlage und vollständigem förderkonformen Austausch.'});
      if (!incomeRate) details.push({label: 'Einkommensbonus', note: !Number.isFinite(income) ? 'Nicht angesetzt: freiwillige Einkommensangabe fehlt.' : 'Nach diesen Angaben nicht angesetzt.'});
      details.push({label: 'Obergrenze des Fördersatzes', note: Math.round(rateCap * 100) + ' %'});
    }
    const eligibleInput = parseNumber(input.eligibleCosts);
    if (String(input.eligibleCosts == null ? '' : input.eligibleCosts).trim() && (!Number.isFinite(eligibleInput) || eligibleInput < 0)) reasons.push('Bitte gültige, nicht negative förderfähige Ausgaben eingeben oder die Angabe leer lassen.');
    const eligibleCosts = Math.max(0, Math.min(cost, Number.isFinite(eligibleInput) ? eligibleInput : cost));
    if (eligibleCosts < 300) reasons.push('Die angenommenen förderfähigen Ausgaben müssen mindestens 300 € brutto betragen.');
    const basis = Math.min(eligibleCosts, cap);
    const grant = reasons.length ? null : Math.round(basis * rate * 100) / 100;
    return {project, status, validCost: true, cost, netCost: cost / (1 + rules.vatRate), vat: cost - cost / (1 + rules.vatRate), eligibleCosts, basis, cap, rate, grant, contribution: grant == null ? null : cost - grant, details, reasons};
  }
  function mount() {
    const section = document.querySelector('#kostenrechner');
    if (!section || section.dataset.calcMounted) return;
    section.dataset.calcMounted = 'true';
    const form = section.querySelector('form');
    const output = section.querySelector('[data-calc-output]');
    let monitor = {status: (location.protocol === 'file:' || globalThis.ThermofisStandalonePreview) ? 'not-configured' : 'loading'};
    let lastResult;
    const qs = selector => section.querySelector(selector);
    const val = name => form.elements.namedItem(name).value;
    function read() {return {project: val('project'), cost: val('cost'), area: val('area'), unitCost: val('unitCost'), building: val('building'), ownership: val('ownership'), existing: val('existing'), stage: val('stage'), technical: val('technical'), previousFunding: val('previousFunding'), selfUse: val('selfUse'), heatType: val('heatType'), heatAge: val('heatAge'), functional: val('functional'), disposal: val('disposal'), fossilRetained: val('fossilRetained'), income: val('income'), minorChild: form.elements.namedItem('minorChild').checked, hydraulic: val('hydraulic'), lowTemperature: val('lowTemperature'), eligibleCosts: val('eligibleCosts')};}
    function make(tag, className, text) {const node = document.createElement(tag); if (className) node.className = className; if (text != null) node.textContent = text; return node;}
    function metric(label, amount, className) {const node = make('div', 'calc-metric ' + (className || '')); node.append(make('span', 'calc-metric-label', label), make('strong', 'calc-metric-value', amount)); return node;}
    function render() {
      const input = read();
      section.querySelectorAll('[data-calc-project]').forEach(node => {node.hidden = node.dataset.calcProject !== input.project;});
      section.querySelectorAll('[data-calc-tab]').forEach(node => {const active = node.dataset.calcTab === input.project; node.classList.toggle('is-active', active); node.setAttribute('aria-pressed', String(active));});
      const result = calculate(input, new Date(), monitor); lastResult = result;
      output.replaceChildren();
      if (!result.validCost) {output.append(make('p', 'calc-warning', result.reasons[0])); return;}
      output.append(make('p', 'calc-eyebrow', 'Unverbindliche Budgetplanung'), make('p', 'calc-no-offer', 'Kein Angebot · keine Preiszusage'), metric(input.project === 'floor' ? 'Investition aus Ihren Preisannahmen' : 'Ihr selbst angesetztes Projektbudget', money.format(result.cost)));
      output.append(make('p', 'calc-vat', 'Enthält 19 % USt.: ' + money.format(result.vat) + ' · Netto ' + money.format(result.netCost)));
      if (result.grant == null) {
        output.append(metric('Mögliche Förderung', 'Individuell prüfen', 'calc-metric-muted'));
        const untouched = ['building', 'ownership', 'existing', 'stage', 'technical', 'previousFunding'].every(key => input[key] === 'unknown');
        if (untouched && result.status.allowed && !(input.project === 'pump' && result.status.heatPumpYearReview)) output.append(make('p', 'calc-help', 'Für ein Förderszenario ergänzen Sie die optionalen Angaben zu Ihrem Gebäude und Vorhaben. Ohne diese Angaben bleibt die Förderprüfung offen.'));
        else {
          const list = make('ul', 'calc-reasons'); result.reasons.slice(0, 3).forEach(reason => list.append(make('li', '', reason))); output.append(list);
          if (result.reasons.length > 3) {const more = make('details', 'calc-more-reasons'); more.append(make('summary', '', 'Weitere Voraussetzungen ansehen')); const extra = make('ul', 'calc-reasons'); result.reasons.slice(3).forEach(reason => extra.append(make('li', '', reason))); more.append(extra); output.append(more);}
        }
      } else {
        output.append(metric('Rechnerisches Förderszenario (' + Math.round(result.rate * 100) + ' %)', '− ' + money.format(result.grant), 'calc-metric-grant'), metric('Eigenanteil in diesem Szenario', money.format(result.contribution), 'calc-metric-total'));
        output.append(make('p', 'calc-basis', 'Angesetzte Förderbasis: ' + money.format(result.basis) + ' · Kostenobergrenze: ' + money.format(result.cap) + '.'));
        const breakdown = make('div', 'calc-breakdown'); result.details.forEach(detail => breakdown.append(make('p', '', detail.label + ': ' + (detail.rate != null ? Math.round(detail.rate * 100) + ' %' : detail.note)))); output.append(breakdown);
      }
      output.append(make('p', 'calc-disclaimer', 'Eine Modellrechnung, kein Angebot und keine Förderzusage. Nur die Bewilligungsstelle entscheidet. Der endgültige Preis und förderfähige Kostenumfang werden nach Besichtigung und Fachplanung festgelegt. Keine Betriebskosten- oder Amortisationsprognose.'));
      const statusNode = qs('[data-calc-status]');
      statusNode.textContent = result.status.hardExpired || result.status.heatPumpYearReview && input.project === 'pump' ? 'Regelstand abgelaufen · Aktualisierung erforderlich' : result.status.stale ? 'Regelprüfung überfällig · Förderzahlen ausgeblendet' : monitor.status === 'needs-review' || monitor.status === 'unavailable' ? 'Quellenprüfung offen · Förderzahlen ausgeblendet' : 'Regelstand geprüft: ' + result.status.checkedAt.split('-').reverse().join('.') + (monitor.status === 'checked' ? ' · Quellenabgleich ohne Änderungsmeldung' : ' · gespeicherter Regelstand');
      statusNode.classList.toggle('calc-status-warning', result.grant == null && (!result.status.allowed || result.status.heatPumpYearReview && input.project === 'pump'));
      qs('[data-calc-monitor-note]').textContent = monitor.status === 'not-configured' ? 'Diese Orientierung verwendet den angegebenen Regelstand. Vor Beauftragung prüfen wir die aktuellen Förderbedingungen individuell.' : monitor.status === 'checked' ? 'Die amtlichen Quellen wurden zuletzt auf Änderungen geprüft. Maßgeblich sind die aktuellen Förderbedingungen.' : monitor.status === 'loading' ? 'Die Förderinformationen werden geprüft.' : 'Förderzahlen sind bis zur erneuten Quellenprüfung gesperrt.';
    }
    section.querySelectorAll('[data-calc-tab]').forEach(button => button.addEventListener('click', () => {form.elements.namedItem('project').value = button.dataset.calcTab; form.elements.namedItem('eligibleCosts').value = ''; render();}));
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('input', render); form.addEventListener('change', render);
    form.querySelectorAll('[data-calc-number]').forEach(input => input.addEventListener('blur', () => {const parsed = parseNumber(input.value); if (Number.isFinite(parsed)) input.value = new Intl.NumberFormat('de-DE', {maximumFractionDigits: 2}).format(parsed); render();}));
    qs('[data-calc-print]').addEventListener('click', () => window.print());
    qs('[data-calc-email]').addEventListener('click', () => {
      if (!lastResult || !lastResult.validCost) return;
      const label = lastResult.project === 'floor' ? 'Fußbodenheizung' : 'Wärmepumpe';
      const text = 'Guten Tag THERMOFIS,\n\nich interessiere mich für ' + label + ' und wünsche eine unverbindliche Beratung.\nMein frei angesetztes Projektbudget: ' + money.format(lastResult.cost) + ' brutto.\nDies ist meine persönliche Budgetplanung, kein Angebot von THERMOFIS und keine Preis- oder Förderzusage.\n\nBitte prüfen Sie Preis, technische Auslegung und mögliche Förderungen für mein Gebäude.\n\nAdresse / Kontaktdaten:\n';
      window.location.href = 'mailto:info@thermofis.de?subject=' + encodeURIComponent('Beratungsanfrage: ' + label) + '&body=' + encodeURIComponent(text);
    });
    const sources = qs('[data-calc-sources]');
    rules.sources.forEach(source => {const li = make('li'); const link = make('a', '', source.label); link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; li.append(link); sources.append(li);});
    render();
    if ((location.protocol !== 'file:' && !globalThis.ThermofisStandalonePreview)) {
      const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 4000);
      fetch('/assets/data/foerder-status.json', {cache: 'no-store', signal: controller.signal}).then(response => {if (response.status === 404) return {status: 'not-configured'}; if (!response.ok) throw new Error('status'); return response.json();}).then(data => {const accepted = ['checked', 'needs-review', 'unavailable', 'not-configured']; const validCheckedDate = data && isDateKey(data.checkedAt) && data.checkedAt <= dateKey(new Date()); monitor = data && accepted.includes(data.status) && (data.status === 'not-configured' || data.schemaVersion === 1) && (data.status !== 'checked' || validCheckedDate) ? data : {status: 'unavailable'};}).catch(() => {monitor = {status: 'unavailable'};}).finally(() => {clearTimeout(timeout); render();});
    }
  }
  return {calculate, rulesStatus, parseNumber, formatMoney: value => money.format(value), mount};
});
