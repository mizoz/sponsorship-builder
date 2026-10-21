(() => {
  'use strict';

  const KEY = 'sb:state:v1';
  const SAVES = 'sb:saves:v1';
  const OPTS = 'sb:opts:v1';

  const CHANNELS = {
    signage: 'Signage CPM',
    stage: 'Stage CPM',
    social: 'Social CPM',
    email: 'Newsletter CPM',
    web: 'Website CPM',
    fixed: 'Fixed $ value'
  };
  const UNIT = { signage: 'placement', stage: 'mention', social: 'post', email: 'send', web: 'month', fixed: 'unit' };

  let uid = 0;
  const id = (p) => p + Date.now().toString(36) + (uid++).toString(36);

  // ---------- examples ----------
  function baseAssumptions() {
    return {
      cpm: { signage: 5, stage: 20, social: 8, email: 32, web: 3 },
      signViews: 3, roomShare: 60, socialReach: 8, openRate: 35, exclPremium: 25, mult: 1
    };
  }

  function baseItems(ticket) {
    return [
      { id: 'logo', name: 'Logo on event signage', ch: 'signage', value: 0, cost: 120, excl: false },
      { id: 'web', name: 'Logo and link on website', ch: 'web', value: 0, cost: 0, excl: false },
      { id: 'social', name: 'Social media post', ch: 'social', value: 0, cost: 0, excl: false },
      { id: 'news', name: 'Newsletter feature', ch: 'email', value: 0, cost: 0, excl: false },
      { id: 'stage', name: 'Stage / MC mention', ch: 'stage', value: 0, cost: 0, excl: false },
      { id: 'tix', name: 'Event tickets', ch: 'fixed', value: ticket, cost: Math.round(ticket * 0.3), excl: false },
      { id: 'booth', name: 'Booth / activation space', ch: 'fixed', value: 1500, cost: 350, excl: false },
      { id: 'sample', name: 'Product sampling rights', ch: 'fixed', value: 1000, cost: 0, excl: false },
      { id: 'speak', name: 'Speaking slot', ch: 'fixed', value: 2500, cost: 0, excl: false },
      { id: 'naming', name: 'Naming rights ("presented by")', ch: 'fixed', value: 5000, cost: 500, excl: true }
    ];
  }

  const EXAMPLES = {
    festival: () => ({
      v: 1, currency: 'CAD', round: 100,
      event: {
        name: 'Riverside Summer Festival', date: 'July 17 to 18, 2027', location: 'Calgary, AB',
        attendance: 6000, days: 2, email: 12000, social: 25000, visits: 15000, ticket: 65,
        audience: 'Families and young adults from across the city. Two days of live music, food trucks and a makers market.',
        contact: '', deadline: 'Commit by April 30 to make the printed signage.', notes: ''
      },
      a: baseAssumptions(),
      items: baseItems(65).map((it) => {
        if (it.id === 'speak') return Object.assign(it, { name: 'Stage takeover (5 minutes)', value: 1500 });
        if (it.id === 'naming') return Object.assign(it, { value: 3000 });
        return it;
      }),
      tiers: [
        { id: 'bronze', name: 'Bronze', spots: 10, mult: 1, excl: false, fixedCost: 0, q: { logo: 1, web: 6, social: 1, tix: 2 } },
        { id: 'silver', name: 'Silver', spots: 6, mult: 1, excl: false, fixedCost: 0, q: { logo: 2, web: 6, social: 2, news: 1, stage: 2, tix: 4 } },
        { id: 'gold', name: 'Gold', spots: 3, mult: 1, excl: false, fixedCost: 0, q: { logo: 4, web: 6, social: 4, news: 2, stage: 6, tix: 10, booth: 1 } },
        { id: 'title', name: 'Title', spots: 1, mult: 1, excl: true, fixedCost: 500, q: { logo: 8, web: 12, social: 8, news: 4, stage: 12, tix: 20, booth: 1, sample: 1, speak: 1, naming: 1 } }
      ]
    }),
    conference: () => ({
      v: 1, currency: 'CAD', round: 250,
      event: {
        name: 'Prairie Ops Summit', date: 'March 9 to 10, 2027', location: 'Edmonton, AB',
        attendance: 450, days: 2, email: 8000, social: 6000, visits: 9000, ticket: 699,
        audience: 'Operations and IT leads from mid-size companies in Western Canada. Mostly director level and up.',
        contact: '', deadline: '', notes: 'Happy to build a custom package around a workshop or dinner.'
      },
      a: Object.assign(baseAssumptions(), { cpm: { signage: 8, stage: 40, social: 12, email: 90, web: 6 }, signViews: 4, roomShare: 80, socialReach: 6, openRate: 40, mult: 1.5 }),
      items: baseItems(699).map((it) => {
        if (it.id === 'booth') return Object.assign(it, { name: 'Exhibitor table', value: 3500, cost: 600 });
        if (it.id === 'sample') return Object.assign(it, { name: 'Lanyard or badge branding', value: 4000, cost: 1200, excl: true });
        if (it.id === 'naming') return Object.assign(it, { name: 'Naming rights on a stage', value: 6000, cost: 0 });
        if (it.id === 'speak') return Object.assign(it, { name: 'Speaking slot (20 minutes)', value: 5000 });
        return it;
      }),
      tiers: [
        { id: 'supporter', name: 'Supporter', spots: 8, mult: 1.5, excl: false, fixedCost: 0, q: { logo: 1, web: 3, social: 1, tix: 2 } },
        { id: 'partner', name: 'Partner', spots: 5, mult: 1.5, excl: false, fixedCost: 0, q: { logo: 2, web: 3, social: 2, news: 1, stage: 1, tix: 3, booth: 1 } },
        { id: 'premier', name: 'Premier', spots: 2, mult: 1.5, excl: false, fixedCost: 0, q: { logo: 3, web: 6, social: 3, news: 2, stage: 2, tix: 4, booth: 1, speak: 1 } },
        { id: 'headline', name: 'Headline', spots: 1, mult: 1.5, excl: true, fixedCost: 1000, q: { logo: 6, web: 6, social: 6, news: 3, stage: 4, tix: 6, booth: 1, speak: 1, naming: 1, sample: 1 } }
      ]
    }),
    creator: () => ({
      v: 1, currency: 'CAD', round: 50,
      event: {
        name: 'Creator Meetup YYC', date: 'Saturday, May 15, 2027', location: 'Calgary, AB',
        attendance: 200, days: 1, email: 3000, social: 120000, visits: 2500, ticket: 40,
        audience: 'Local creators, small agency folks and brand marketers. Most attendees post from the event.',
        contact: '', deadline: '', notes: 'Attendee social reach is not counted in the estimate.'
      },
      a: Object.assign(baseAssumptions(), { socialReach: 5, openRate: 45, mult: 1.2 }),
      items: [
        { id: 'logo', name: 'Logo on photo wall and signs', ch: 'signage', value: 0, cost: 60, excl: false },
        { id: 'social', name: 'Instagram / TikTok post from host', ch: 'social', value: 0, cost: 0, excl: false },
        { id: 'story', name: 'Story set (3 frames)', ch: 'social', value: 0, cost: 0, excl: false },
        { id: 'news', name: 'Newsletter feature', ch: 'email', value: 0, cost: 0, excl: false },
        { id: 'stage', name: 'Shout-out from the host', ch: 'stage', value: 0, cost: 0, excl: false },
        { id: 'tix', name: 'Tickets', ch: 'fixed', value: 40, cost: 15, excl: false },
        { id: 'table', name: 'Product table', ch: 'fixed', value: 400, cost: 50, excl: false },
        { id: 'bag', name: 'Item in gift bag', ch: 'fixed', value: 200, cost: 0, excl: false },
        { id: 'naming', name: '"Presented by" naming', ch: 'fixed', value: 1500, cost: 0, excl: true }
      ],
      tiers: [
        { id: 'friend', name: 'Friend', spots: 6, mult: 1.2, excl: false, fixedCost: 0, q: { logo: 1, story: 1, tix: 1, bag: 1 } },
        { id: 'partner', name: 'Partner', spots: 3, mult: 1.2, excl: false, fixedCost: 0, q: { logo: 1, social: 1, story: 1, news: 1, stage: 1, tix: 2, table: 1, bag: 1 } },
        { id: 'presenting', name: 'Presenting', spots: 1, mult: 1.2, excl: true, fixedCost: 150, q: { logo: 2, social: 2, story: 2, news: 2, stage: 3, tix: 4, table: 1, bag: 1, naming: 1 } }
      ]
    }),
    blank: () => ({
      v: 1, currency: 'CAD', round: 100,
      event: { name: '', date: '', location: '', attendance: 0, days: 1, email: 0, social: 0, visits: 0, ticket: 0, audience: '', contact: '', deadline: '', notes: '' },
      a: baseAssumptions(),
      items: baseItems(0),
      tiers: ['Bronze', 'Silver', 'Gold', 'Title'].map((n, i) => ({ id: n.toLowerCase(), name: n, spots: i === 3 ? 1 : 6 - i * 2, mult: 1, excl: i === 3, fixedCost: 0, q: {} }))
    })
  };

  // ---------- state ----------
  const num = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };
  const str = (v, max = 400) => (typeof v === 'string' ? v : v == null ? '' : String(v)).slice(0, max);

  function clean(s) {
    const ex = EXAMPLES.festival();
    if (!s || typeof s !== 'object') return ex;
    const e = s.event || {};
    const a = s.a || {};
    const cpm = a.cpm || {};
    const out = {
      v: 1,
      currency: ['CAD', 'USD', 'EUR', 'GBP', 'AUD'].includes(s.currency) ? s.currency : 'CAD',
      round: [1, 50, 100, 250, 500].includes(num(s.round)) ? num(s.round) : 100,
      event: {
        name: str(e.name, 120), date: str(e.date, 80), location: str(e.location, 120),
        attendance: Math.max(0, num(e.attendance)), days: Math.max(1, num(e.days, 1)),
        email: Math.max(0, num(e.email)), social: Math.max(0, num(e.social)), visits: Math.max(0, num(e.visits)),
        ticket: Math.max(0, num(e.ticket)),
        audience: str(e.audience, 600), contact: str(e.contact, 200), deadline: str(e.deadline, 200), notes: str(e.notes, 800)
      },
      a: {
        cpm: {
          signage: Math.max(0, num(cpm.signage, 5)), stage: Math.max(0, num(cpm.stage, 20)), social: Math.max(0, num(cpm.social, 8)),
          email: Math.max(0, num(cpm.email, 32)), web: Math.max(0, num(cpm.web, 3))
        },
        signViews: Math.max(0, num(a.signViews, 3)), roomShare: Math.min(100, Math.max(0, num(a.roomShare, 60))),
        socialReach: Math.min(100, Math.max(0, num(a.socialReach, 8))), openRate: Math.min(100, Math.max(0, num(a.openRate, 35))),
        exclPremium: Math.max(0, num(a.exclPremium, 25)), mult: Math.max(0, num(a.mult, 1))
      },
      items: (Array.isArray(s.items) ? s.items : []).slice(0, 40).map((it) => ({
        id: str(it.id, 40) || id('i'), name: str(it.name, 120), ch: CHANNELS[it.ch] ? it.ch : 'fixed',
        value: Math.max(0, num(it.value)), cost: Math.max(0, num(it.cost)), excl: !!it.excl
      })),
      tiers: (Array.isArray(s.tiers) ? s.tiers : []).slice(0, 8).map((t) => {
        const q = {};
        if (t.q && typeof t.q === 'object') for (const k of Object.keys(t.q)) { const n = Math.max(0, num(t.q[k])); if (n) q[str(k, 40)] = n; }
        return { id: str(t.id, 40) || id('t'), name: str(t.name, 40), spots: Math.max(1, Math.round(num(t.spots, 1))), mult: Math.max(0, num(t.mult, 1)), excl: !!t.excl, fixedCost: Math.max(0, num(t.fixedCost)), q };
      })
    };
    if (!out.tiers.length) out.tiers = ex.tiers;
    return out;
  }

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  };

  function fromHash() {
    const m = location.hash.match(/^#s=([A-Za-z0-9_-]+)/);
    if (!m) return null;
    try {
      const b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
      const bin = atob(b64);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) { return null; }
  }
  function toHash(s) {
    const bytes = new TextEncoder().encode(JSON.stringify(s));
    let bin = '';
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  let S;
  const hashed = fromHash();
  if (hashed) {
    S = clean(hashed);
    history.replaceState(null, '', location.pathname + location.search);
  } else {
    let saved = null;
    try { saved = JSON.parse(store.get(KEY)); } catch (e) { saved = null; }
    S = saved ? clean(saved) : EXAMPLES.festival();
  }
  let opts = { showValue: false, showQty: true };
  try { opts = Object.assign(opts, JSON.parse(store.get(OPTS)) || {}); } catch (e) { /* default */ }

  // ---------- math ----------
  function impressions(it) {
    const e = S.event, a = S.a;
    switch (it.ch) {
      case 'signage': return e.attendance * e.days * a.signViews;
      case 'stage': return e.attendance * a.roomShare / 100;
      case 'social': return e.social * a.socialReach / 100;
      case 'email': return e.email * a.openRate / 100;
      case 'web': return e.visits;
      default: return 0;
    }
  }
  function unitValue(it) {
    if (it.ch === 'fixed') return it.value;
    return impressions(it) * S.a.cpm[it.ch] / 1000;
  }
  const roundTo = (v, step) => step > 1 ? Math.round(v / step) * step : Math.round(v);

  function calcTier(t) {
    const lines = [];
    let impr = 0, base = 0, cost = t.fixedCost;
    for (const it of S.items) {
      const qty = t.q[it.id] || 0;
      if (!qty) continue;
      const ui = impressions(it), uv = unitValue(it);
      const line = { it, qty, impr: ui * qty, value: uv * qty, cost: it.cost * qty, ui, uv };
      lines.push(line);
      impr += line.impr; base += line.value; cost += line.cost;
    }
    const premium = t.excl ? base * S.a.exclPremium / 100 : 0;
    const value = base + premium;
    const raw = value * t.mult;
    const price = roundTo(raw, S.round);
    const margin = price - cost;
    return { t, lines, impr, base, premium, value, raw, price, cost, margin, marginPct: price > 0 ? margin / price * 100 : 0, revenue: price * t.spots };
  }

  // ---------- formatting ----------
  const money = (v, dec = 0) => {
    try { return new Intl.NumberFormat('en-CA', { style: 'currency', currency: S.currency, maximumFractionDigits: dec, minimumFractionDigits: dec }).format(v); }
    catch (e) { return S.currency + ' ' + v.toFixed(dec); }
  };
  const n0 = (v) => new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 }).format(v);
  const n2 = (v) => new Intl.NumberFormat('en-CA', { maximumFractionDigits: 2 }).format(v);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function itemLabel(it, qty) {
    if (!opts.showQty || qty <= 1) {
      if (it.ch === 'web' && opts.showQty) return `${it.name} (${qty} month${qty === 1 ? '' : 's'})`;
      return it.name;
    }
    if (it.ch === 'web') return `${it.name} (${qty} months)`;
    return `${it.name} × ${n2(qty)}`;
  }

  // ---------- render inputs ----------
  function fillInputs() {
    $$('[data-ev]').forEach((el) => { el.value = S.event[el.dataset.ev] ?? ''; });
    $$('[data-cpm]').forEach((el) => { el.value = S.a.cpm[el.dataset.cpm]; });
    $$('[data-a]').forEach((el) => { el.value = S.a[el.dataset.a]; });
    $('#cur').value = S.currency;
    $('#round').value = String(S.round);
    $('#opt-value').checked = !!opts.showValue;
    $('#opt-qty').checked = !!opts.showQty;
  }

  function renderItems() {
    const tb = $('#items tbody');
    tb.innerHTML = S.items.map((it, i) => {
      const fixed = it.ch === 'fixed';
      return `<tr data-i="${i}">
        <td><label class="sr-only" for="in-${i}">Deliverable name</label><input id="in-${i}" type="text" data-f="name" value="${esc(it.name)}"></td>
        <td><label class="sr-only" for="ic-${i}">Valued by</label><select id="ic-${i}" data-f="ch">${Object.entries(CHANNELS).map(([k, v]) => `<option value="${k}"${k === it.ch ? ' selected' : ''}>${v}</option>`).join('')}</select></td>
        <td class="num" data-out="impr">${fixed ? '<span class="unit">n/a</span>' : n0(impressions(it)) + ` <span class="unit">/ ${UNIT[it.ch]}</span>`}</td>
        <td class="num">${fixed
          ? `<label class="sr-only" for="iv-${i}">Value per unit</label><input id="iv-${i}" type="number" min="0" step="1" data-f="value" value="${it.value}">`
          : `<span data-out="uv">${money(unitValue(it), 2)}</span>`}</td>
        <td class="num"><label class="sr-only" for="ik-${i}">Cost per unit</label><input id="ik-${i}" type="number" min="0" step="1" data-f="cost" value="${it.cost}"></td>
        <td><label class="check"><input type="checkbox" data-f="excl"${it.excl ? ' checked' : ''}><span class="sr-only">Exclusive: only one sponsor can have ${esc(it.name)}</span></label></td>
        <td><button type="button" class="link danger" data-del="${i}" aria-label="Remove ${esc(it.name)}">Remove</button></td>
      </tr>`;
    }).join('');
  }

  function updateItemOutputs() {
    $$('#items tbody tr').forEach((tr) => {
      const it = S.items[+tr.dataset.i];
      if (!it || it.ch === 'fixed') return;
      const ic = $('[data-out="impr"]', tr), uv = $('[data-out="uv"]', tr);
      if (ic) ic.innerHTML = n0(impressions(it)) + ` <span class="unit">/ ${UNIT[it.ch]}</span>`;
      if (uv) uv.textContent = money(unitValue(it), 2);
    });
  }

  function renderMatrix() {
    const head = $('#matrix thead'), body = $('#matrix tbody');
    head.innerHTML = '<tr><th scope="col" class="item">Deliverable</th>' + S.tiers.map((t, j) => `<th scope="col"><div class="tierhead" data-j="${j}">
      <label for="tn-${j}">Tier ${j + 1} name</label><input id="tn-${j}" type="text" data-t="name" value="${esc(t.name)}">
      <div class="mini">
        <div><label for="ts-${j}">Spots</label><input id="ts-${j}" type="number" min="1" step="1" data-t="spots" value="${t.spots}"></div>
        <div><label for="tm-${j}">Multiplier</label><input id="tm-${j}" type="number" min="0" step="0.05" data-t="mult" value="${t.mult}"></div>
      </div>
      <div><label for="tf-${j}">Fixed cost</label><input id="tf-${j}" type="number" min="0" step="10" data-t="fixedCost" value="${t.fixedCost}"></div>
      <label class="check" style="color:var(--ink);font-size:.82rem"><input type="checkbox" data-t="excl"${t.excl ? ' checked' : ''}> Category exclusive</label>
    </div></th>`).join('') + '</tr>';
    body.innerHTML = S.items.map((it) => `<tr><th scope="row" class="item">${esc(it.name || 'Untitled')}${it.excl ? '<span class="tag">exclusive</span>' : ''}<br><span class="unit">${it.ch === 'fixed' ? money(it.value) + ' / unit' : money(unitValue(it), 2) + ' / ' + UNIT[it.ch]}</span></th>` +
      S.tiers.map((t, j) => {
        const q = t.q[it.id] || 0;
        const name = esc(`${it.name} in ${t.name}`);
        return `<td class="cell"><div class="cell-in" data-j="${j}" data-item="${esc(it.id)}">
          <input type="checkbox" aria-label="Include ${name}"${q ? ' checked' : ''}>
          <input type="number" min="0" step="1" aria-label="Quantity of ${name}" value="${q || ''}" placeholder="0"${q ? '' : ' disabled'}>
        </div></td>`;
      }).join('') + '</tr>').join('');
  }

  // ---------- results ----------
  function formulaText() {
    const e = S.event, a = S.a, c = a.cpm;
    return [
      'value per unit, CPM items = impressions per unit × CPM ÷ 1,000',
      `  signage:    ${n0(e.attendance)} attendees × ${n0(e.days)} days × ${n2(a.signViews)} views = ${n0(e.attendance * e.days * a.signViews)} × ${money(c.signage, 2)} CPM`,
      `  stage:      ${n0(e.attendance)} × ${n2(a.roomShare)}% in room = ${n0(e.attendance * a.roomShare / 100)} × ${money(c.stage, 2)} CPM`,
      `  social:     ${n0(e.social)} followers × ${n2(a.socialReach)}% reach = ${n0(e.social * a.socialReach / 100)} × ${money(c.social, 2)} CPM`,
      `  newsletter: ${n0(e.email)} subscribers × ${n2(a.openRate)}% opens = ${n0(e.email * a.openRate / 100)} × ${money(c.email, 2)} CPM`,
      `  website:    ${n0(e.visits)} visits per month × ${money(c.web, 2)} CPM`,
      'tier value = Σ (unit value × quantity) + fixed items',
      `exclusive tiers: value × (1 + ${n2(a.exclPremium)}%)`,
      `suggested price = value × tier multiplier, rounded to nearest ${S.round > 1 ? n0(S.round) : 1}`,
      'margin = price − (cost per unit × quantity + tier fixed cost)'
    ].join('\n');
  }

  function renderResults() {
    const R = S.tiers.map(calcTier);
    $('#formula').textContent = formulaText();
    $('#cards').innerHTML = R.map((r) => `<div class="card">
      <h3>${esc(r.t.name || 'Untitled')}${r.t.excl ? '<span class="tag">exclusive</span>' : ''}</h3>
      <div class="price">${money(r.price)}</div>
      <div class="unit">suggested price · ${r.t.spots} spot${r.t.spots === 1 ? '' : 's'}</div>
      <div class="kv"><span>Impressions</span><span>${n0(r.impr)}</span></div>
      <div class="kv"><span>Base value</span><span>${money(r.base)}</span></div>
      ${r.t.excl ? `<div class="kv"><span>Exclusivity +${n2(S.a.exclPremium)}%</span><span>${money(r.premium)}</span></div>` : ''}
      <div class="kv"><span>Estimated value</span><span>${money(r.value)}</span></div>
      <div class="kv"><span>× multiplier ${n2(r.t.mult)}</span><span>${money(r.raw)}</span></div>
      <div class="kv"><span>Cost to deliver</span><span>${money(r.cost)}</span></div>
      <div class="kv total"><span>Margin</span><span class="${r.margin < 0 ? 'neg' : 'pos'}">${money(r.margin)} (${n0(r.marginPct)}%)</span></div>
      <div class="kv"><span>If all spots sell</span><span>${money(r.revenue)}</span></div>
      <details class="break"><summary>Show the math</summary><ul>${r.lines.length ? r.lines.map((l) => `<li>${esc(l.it.name)}: ${l.it.ch === 'fixed'
        ? `${n2(l.qty)} × ${money(l.uv)} = ${money(l.value)}`
        : `${n2(l.qty)} × ${n0(l.ui)} impr × ${money(S.a.cpm[l.it.ch], 2)} ÷ 1,000 = ${money(l.value, 2)}`}</li>`).join('') : '<li>Nothing ticked yet.</li>'}</ul></details>
    </div>`).join('');

    const total = R.reduce((s, r) => s + r.revenue, 0);
    const totalCost = R.reduce((s, r) => s + r.cost * r.t.spots, 0);
    const spots = R.reduce((s, r) => s + r.t.spots, 0);
    $('#totals').innerHTML = `<span>Total if everything sells: <b>${money(total)}</b></span><span>Cost to deliver: <b>${money(totalCost)}</b></span><span>Net: <b class="${total - totalCost < 0 ? 'neg' : 'pos'}">${money(total - totalCost)}</b></span><span>Sponsor spots: <b>${spots}</b></span>`;
    renderChecks(R);
    return R;
  }

  function renderChecks(R) {
    const out = [];
    const add = (lvl, msg) => out.push({ lvl, msg });
    R.forEach((r) => { if (!r.lines.length) add('bad', `${r.t.name || 'A tier'} has no deliverables ticked.`); });
    for (let j = 1; j < R.length; j++) {
      const lo = R[j - 1], hi = R[j];
      if (!lo.price || !hi.price) continue;
      if (hi.price <= lo.price) add('bad', `${hi.t.name} (${money(hi.price)}) is not priced above ${lo.t.name} (${money(lo.price)}). List tiers lowest to highest, and make each one cost more.`);
      else {
        const ratio = hi.price / lo.price;
        if (ratio < 1.3) add('warn', `${hi.t.name} is only ${n2(ratio)}× ${lo.t.name}. With a gap that small most sponsors stay at the cheaper tier. Aim for roughly 1.5× to 3×.`);
        if (ratio > 4) add('warn', `${hi.t.name} is ${n2(ratio)}× ${lo.t.name}. A jump that big leaves a hole in the middle. Consider a tier in between or moving a deliverable down.`);
      }
      if (hi.t.spots > lo.t.spots) add('warn', `${hi.t.name} has more spots (${hi.t.spots}) than ${lo.t.name} (${lo.t.spots}). Higher tiers usually feel more special with fewer spots.`);
      const missing = S.items.filter((it) => (lo.t.q[it.id] || 0) > (hi.t.q[it.id] || 0));
      if (missing.length) add('warn', `${hi.t.name} gets less of ${missing.map((it) => it.name).join(', ')} than ${lo.t.name}. Upgrading should never mean losing something.`);
    }
    R.forEach((r) => {
      if (!r.price) return;
      if (r.margin < 0) add('bad', `${r.t.name} loses ${money(-r.margin)} per sponsor. Raise the price or cut a costly deliverable.`);
      else if (r.marginPct < 30) add('warn', `${r.t.name} margin is ${n0(r.marginPct)}%. Leave room for surprises and for discounts in negotiation.`);
      if (r.t.excl && r.t.spots > 1) add('warn', `${r.t.name} is marked category exclusive but has ${r.t.spots} spots. Exclusive tiers normally have one sponsor per category.`);
    });
    S.items.filter((it) => it.excl).forEach((it) => {
      const where = S.tiers.filter((t) => t.q[it.id]);
      const sold = where.reduce((s, t) => s + t.spots, 0);
      if (sold > 1) add('bad', `"${it.name}" is exclusive but could be sold ${sold} times (${where.map((t) => `${t.name} × ${t.spots}`).join(', ')}). Keep it in one tier with one spot.`);
    });
    if (!out.length) add('ok', 'No problems found. Tiers step up in price, each one includes what the tier below has, and every tier covers its costs.');
    const label = { ok: 'Looks good:', warn: 'Check:', bad: 'Fix:' };
    $('#checks').innerHTML = out.map((c) => `<li class="${c.lvl}"><b>${label[c.lvl]}</b>${esc(c.msg)}</li>`).join('');
  }

  // ---------- sheet + text ----------
  function stats() {
    const e = S.event, s = [];
    if (e.attendance) s.push([n0(e.attendance), e.days > 1 ? 'attendees a day' : 'attendees']);
    if (e.days > 1) s.push([n0(e.days), 'days']);
    if (e.email) s.push([n0(e.email), 'email subscribers']);
    if (e.social) s.push([n0(e.social), 'social followers']);
    if (e.visits) s.push([n0(e.visits), 'site visits / month']);
    return s;
  }

  function renderSheet(R) {
    const e = S.event;
    const meta = [e.date, e.location].filter(Boolean).join(' · ');
    $('#sheet').innerHTML = `
      <h2 class="sh-title">${esc(e.name || 'Your event')} sponsorship</h2>
      ${meta ? `<p class="sh-meta">${esc(meta)}</p>` : ''}
      ${e.audience ? `<p class="sh-aud">${esc(e.audience)}</p>` : ''}
      ${stats().length ? `<div class="sh-stats">${stats().map(([v, l]) => `<div><b>${v}</b>${l}</div>`).join('')}</div>` : ''}
      <div class="sh-tiers">${[...R].reverse().map((r) => `<div class="sh-tier">
        <h3>${esc(r.t.name)}</h3>
        <div class="sh-price">${money(r.price)}</div>
        <div class="sh-spots">${r.t.spots === 1 ? '1 spot' : r.t.spots + ' spots'}${r.t.excl ? ' · category exclusive' : ''}${opts.showValue ? ` · est. value ${money(r.value)}` : ''}</div>
        <ul>${r.lines.map((l) => `<li>${esc(itemLabel(l.it, l.qty))}</li>`).join('')}</ul>
      </div>`).join('')}</div>
      ${e.deadline ? `<p class="sh-notes"><strong>${esc(e.deadline)}</strong></p>` : ''}
      ${e.notes ? `<p class="sh-notes">${esc(e.notes)}</p>` : ''}
      ${e.contact ? `<p class="sh-contact">Contact: ${esc(e.contact)}</p>` : ''}
      <p class="sh-foot">Prices in ${S.currency}${opts.showValue ? '. Estimated values are planning estimates based on reach and standard CPMs, not guaranteed results' : ''}.</p>`;
  }

  function packageText(R, md) {
    const e = S.event, L = [];
    const title = `${e.name || 'Your event'} sponsorship`;
    L.push(md ? `# ${title}` : title.toUpperCase());
    const meta = [e.date, e.location].filter(Boolean).join(' · ');
    if (meta) L.push(md ? `*${meta}*` : meta);
    L.push('');
    if (e.audience) { L.push(e.audience); L.push(''); }
    const st = stats();
    if (st.length) { st.forEach(([v, l]) => L.push(`${md ? '- ' : ''}${v} ${l}`)); L.push(''); }
    [...R].reverse().forEach((r) => {
      const head = `${r.t.name}: ${money(r.price)} (${r.t.spots === 1 ? '1 spot' : r.t.spots + ' spots'}${r.t.excl ? ', category exclusive' : ''})`;
      L.push(md ? `## ${head}` : head);
      if (opts.showValue) L.push(`Estimated value ${money(r.value)}`);
      r.lines.forEach((l) => L.push(`- ${itemLabel(l.it, l.qty)}`));
      L.push('');
    });
    if (e.deadline) L.push(md ? `**${e.deadline}**` : e.deadline);
    if (e.notes) L.push(e.notes);
    if (e.contact) L.push(`Contact: ${e.contact}`);
    L.push(`Prices in ${S.currency}.`);
    return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }

  function csv(R) {
    const q = (v) => { const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const rows = [['tier', 'deliverable', 'valued_by', 'quantity', 'impressions', 'value', 'cost', 'exclusive']];
    R.forEach((r) => {
      r.lines.forEach((l) => rows.push([r.t.name, l.it.name, CHANNELS[l.it.ch], l.qty, Math.round(l.impr), l.value.toFixed(2), l.cost.toFixed(2), l.it.excl ? 'yes' : '']));
      if (r.t.fixedCost) rows.push([r.t.name, 'Tier fixed cost', '', '', '', '', r.t.fixedCost.toFixed(2), '']);
      if (r.premium) rows.push([r.t.name, `Exclusivity premium ${S.a.exclPremium}%`, '', '', '', r.premium.toFixed(2), '', 'yes']);
    });
    rows.push([]);
    rows.push(['tier', 'spots', 'multiplier', 'estimated_value', 'suggested_price', 'cost_to_deliver', 'margin', 'margin_pct', 'revenue_all_spots', 'currency']);
    R.forEach((r) => rows.push([r.t.name, r.t.spots, r.t.mult, r.value.toFixed(2), r.price, r.cost.toFixed(2), r.margin.toFixed(2), r.marginPct.toFixed(1), r.revenue, S.currency]));
    return rows.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n';
  }

  // ---------- main loop ----------
  let lastR = [];
  let saveTimer;
  function update(full) {
    if (full) { renderItems(); renderMatrix(); } else { updateItemOutputs(); refreshMatrixLabels(); }
    lastR = renderResults();
    renderSheet(lastR);
    $('#out').value = packageText(lastR, true);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.set(KEY, JSON.stringify(S)), 250);
  }

  function refreshMatrixLabels() {
    const rows = $$('#matrix tbody tr');
    rows.forEach((tr, i) => {
      const it = S.items[i];
      const th = tr.querySelector('th');
      if (it && th) th.innerHTML = `${esc(it.name || 'Untitled')}${it.excl ? '<span class="tag">exclusive</span>' : ''}<br><span class="unit">${it.ch === 'fixed' ? money(it.value) + ' / unit' : money(unitValue(it), 2) + ' / ' + UNIT[it.ch]}</span>`;
    });
  }

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('show'), 1800);
  }

  async function copy(text, what) {
    try { await navigator.clipboard.writeText(text); toast(`${what} copied`); }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(`${what} copied`); } catch (err) { toast('Copy failed, select the text and copy it'); }
      ta.remove();
    }
  }

  function download(name, text, type) {
    const blob = new Blob([text], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const slug = () => (S.event.name || 'sponsorship').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sponsorship';

  // ---------- events ----------
  document.addEventListener('input', (ev) => {
    const el = ev.target;
    if (el.dataset.ev) {
      const k = el.dataset.ev;
      S.event[k] = el.type === 'number' ? Math.max(k === 'days' ? 1 : 0, num(el.value, k === 'days' ? 1 : 0)) : str(el.value, 800);
      update(false);
    } else if (el.dataset.cpm) {
      S.a.cpm[el.dataset.cpm] = Math.max(0, num(el.value)); update(false);
    } else if (el.dataset.a) {
      S.a[el.dataset.a] = Math.max(0, num(el.value)); update(false);
    } else if (el.dataset.f && el.closest('#items')) {
      const it = S.items[+el.closest('tr').dataset.i];
      const f = el.dataset.f;
      if (f === 'name') it.name = str(el.value, 120);
      else if (f === 'value' || f === 'cost') it[f] = Math.max(0, num(el.value));
      else return;
      update(false);
    } else if (el.dataset.t && el.type !== 'checkbox') {
      const t = S.tiers[+el.closest('.tierhead').dataset.j];
      const f = el.dataset.t;
      if (f === 'name') t.name = str(el.value, 40);
      else if (f === 'spots') t.spots = Math.max(1, Math.round(num(el.value, 1)));
      else t[f] = Math.max(0, num(el.value));
      update(false);
    } else if (el.closest('.cell-in') && el.type === 'number') {
      const c = el.closest('.cell-in');
      const t = S.tiers[+c.dataset.j];
      const v = Math.max(0, num(el.value));
      if (v) t.q[c.dataset.item] = v; else delete t.q[c.dataset.item];
      $('input[type=checkbox]', c).checked = !!v;
      update(false);
    }
  });

  document.addEventListener('change', (ev) => {
    const el = ev.target;
    if (el.id === 'cur') { S.currency = el.value; update(true); }
    else if (el.id === 'round') { S.round = num(el.value, 100); update(false); }
    else if (el.id === 'example' && el.value) {
      if (EXAMPLES[el.value]) { S = EXAMPLES[el.value](); fillInputs(); update(true); toast('Example loaded'); }
      el.value = '';
    } else if (el.id === 'opt-value' || el.id === 'opt-qty') {
      opts = { showValue: $('#opt-value').checked, showQty: $('#opt-qty').checked };
      store.set(OPTS, JSON.stringify(opts));
      update(false);
    } else if (el.dataset.f === 'ch') {
      S.items[+el.closest('tr').dataset.i].ch = el.value; update(true);
    } else if (el.dataset.f === 'excl') {
      S.items[+el.closest('tr').dataset.i].excl = el.checked; update(false);
    } else if (el.dataset.t === 'excl') {
      S.tiers[+el.closest('.tierhead').dataset.j].excl = el.checked; update(false);
    } else if (el.closest('.cell-in') && el.type === 'checkbox') {
      const c = el.closest('.cell-in');
      const t = S.tiers[+c.dataset.j];
      const qty = $('input[type=number]', c);
      if (el.checked) { t.q[c.dataset.item] = Math.max(1, num(qty.value, 1)); qty.value = t.q[c.dataset.item]; qty.disabled = false; }
      else { delete t.q[c.dataset.item]; qty.value = ''; qty.disabled = true; }
      update(false);
    } else if (el.id === 'import' && el.files && el.files[0]) {
      const f = el.files[0];
      if (f.size > 500000) { toast('That file is too big'); el.value = ''; return; }
      f.text().then((txt) => {
        try { S = clean(JSON.parse(txt)); fillInputs(); update(true); toast('Imported'); }
        catch (e) { toast('Could not read that JSON file'); }
        el.value = '';
      });
    }
  });

  // re-render item list after editing a name so matrix labels update without stealing focus
  document.addEventListener('focusout', (ev) => {
    if (ev.target.dataset && ev.target.dataset.f === 'name') refreshMatrixLabels();
  });

  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('button');
    if (!el) return;
    if (el.dataset.del != null) {
      const it = S.items[+el.dataset.del];
      if (!confirm(`Remove "${it.name || 'this deliverable'}" from the list and every tier?`)) return;
      S.items.splice(+el.dataset.del, 1);
      S.tiers.forEach((t) => delete t.q[it.id]);
      update(true);
      return;
    }
    switch (el.id) {
      case 'add-item': {
        if (S.items.length >= 40) return toast('That is plenty of deliverables');
        S.items.push({ id: id('i'), name: 'New deliverable', ch: 'fixed', value: 500, cost: 0, excl: false });
        update(true);
        const last = $$('#items tbody input[data-f="name"]').pop();
        if (last) { last.focus(); last.select(); }
        break;
      }
      case 'add-tier': {
        if (S.tiers.length >= 8) return toast('Eight tiers is the max');
        const prev = S.tiers[S.tiers.length - 1];
        S.tiers.push({ id: id('t'), name: `Tier ${S.tiers.length + 1}`, spots: 1, mult: prev ? prev.mult : S.a.mult, excl: false, fixedCost: 0, q: prev ? Object.assign({}, prev.q) : {} });
        update(true);
        break;
      }
      case 'del-tier':
        if (S.tiers.length <= 1) return toast('Keep at least one tier');
        if (!confirm(`Remove the ${S.tiers[S.tiers.length - 1].name || 'last'} tier?`)) return;
        S.tiers.pop(); update(true);
        break;
      case 'print': window.print(); break;
      case 'import-btn': $('#import').click(); break;
      case 'copy-md': copy(packageText(lastR, true), 'Markdown'); break;
      case 'copy-txt': copy(packageText(lastR, false), 'Text'); break;
      case 'dl-csv': download(`${slug()}-sponsorship.csv`, csv(lastR), 'text/csv'); break;
      case 'dl-json': download(`${slug()}-sponsorship.json`, JSON.stringify(S, null, 2), 'application/json'); break;
      case 'share': {
        const url = location.origin + location.pathname + '#s=' + toHash(S);
        copy(url, 'Share link');
        break;
      }
      case 'reset':
        if (!confirm('Replace your current package with the festival example?')) return;
        S = EXAMPLES.festival(); fillInputs(); update(true);
        break;
      case 'save': {
        const name = str($('#save-name').value.trim(), 60) || S.event.name || 'Untitled';
        const all = readSaves();
        all[name] = { at: new Date().toISOString(), s: S };
        if (store.set(SAVES, JSON.stringify(all))) { renderSaves(name); toast(`Saved "${name}"`); }
        else toast('Could not save, storage is blocked');
        break;
      }
      case 'load': {
        const all = readSaves(), k = $('#saves').value;
        if (!all[k]) return toast('Nothing saved yet');
        S = clean(all[k].s); fillInputs(); update(true); toast(`Loaded "${k}"`);
        break;
      }
      case 'del-save': {
        const all = readSaves(), k = $('#saves').value;
        if (!all[k] || !confirm(`Delete saved version "${k}"?`)) return;
        delete all[k]; store.set(SAVES, JSON.stringify(all)); renderSaves();
        break;
      }
    }
  });

  function readSaves() { try { return JSON.parse(store.get(SAVES)) || {}; } catch (e) { return {}; } }
  function renderSaves(sel) {
    const all = readSaves();
    const keys = Object.keys(all).sort((a, b) => (all[b].at || '').localeCompare(all[a].at || ''));
    $('#saves').innerHTML = keys.length ? keys.map((k) => `<option${k === sel ? ' selected' : ''}>${esc(k)}</option>`).join('') : '<option value="">No saved versions</option>';
  }

  fillInputs();
  renderSaves();
  update(true);
})();
