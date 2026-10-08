// ═══════════════════════════════════════════════════════════════════════
// Ovations TCMS — Dashboard Render Functions
// ═══════════════════════════════════════════════════════════════════════

// ── Chart instance registry (prevents canvas reuse errors) ──────────────
const _charts = {};
function makeChart(id, type, data, options = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (_charts[id]) { _charts[id].destroy(); delete _charts[id]; }
  _charts[id] = new Chart(el.getContext('2d'), {
    type,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
      ...options,
    },
  });
}

// ── Shared helpers ───────────────────────────────────────────────────────
function daysUntil(dateStr) {
  return Math.round((new Date(dateStr) - TODAY) / 86400000);
}
function ini(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function empCreds(empId) {
  return EMP_CREDENTIALS.filter(ec => ec.empId === empId);
}
function statusPill(status) {
  const cls   = { active: 'pill-green', expiring: 'pill-amber', expired: 'pill-red', planned: 'pill-blue', in_progress: 'pill-purple', pending: 'pill-gray', overdue: 'pill-red', completed: 'pill-green' };
  const label = { active: 'Active', expiring: 'Expiring', expired: 'Expired', planned: 'Planned', in_progress: 'In Progress', pending: 'Pending', overdue: 'Overdue', completed: 'Completed' };
  return `<span class="pill ${cls[status] || 'pill-gray'}">${label[status] || status}</span>`;
}
function ragPill(rag) {
  const cls = { green: 'pill-green', amber: 'pill-amber', red: 'pill-red' };
  return `<span class="pill ${cls[rag]}">● ${rag.toUpperCase()}</span>`;
}
function plg(pid) {
  if (!pid) return '';
  const ab = pid === 'ATLASSIAN' ? 'ATLS' : pid;
  return `<span class="partner-logo p-${pid}">${ab}</span>`;
}
function progBar(pct, color) {
  const c = color || (pct >= 75 ? '#16a34a' : pct >= 50 ? '#d97706' : '#CE1934');
  return `<div class="prog-wrap"><div class="prog-bar" style="width:${pct}%;background:${c}"></div></div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${pct}%</div>`;
}
function getStats(emp) {
  const c        = empCreds(emp.id);
  const active   = c.filter(x => x.status === 'active').length;
  const expiring = c.filter(x => x.status === 'expiring').length;
  const expired  = c.filter(x => x.status === 'expired').length;
  const mandCreds = CREDENTIALS.filter(cr => cr.partner === emp.partner && cr.mandatory);
  const heldActive = c.filter(x => x.status === 'active' || x.status === 'expiring').map(x => x.credId);
  const gaps     = mandCreds.filter(cr => !heldActive.includes(cr.id)).length;
  const commits  = COMMITMENTS.filter(x => x.empId === emp.id);
  const overdue  = commits.filter(x => x.status === 'overdue').length;
  const total    = active + expiring + expired;
  const pct      = total > 0 ? Math.min(100, Math.round(((active + expiring) / (total + gaps)) * 100)) : 0;
  return { active, expiring, expired, gaps, commits: commits.length, overdue, pct };
}
function getRAG(pid) {
  const r   = PARTNER_REQUIREMENTS.filter(x => x.partner === pid);
  if (!r.length) return 'green';
  const met = r.filter(x => x.currentCount >= x.minCount).length;
  const pct = met / r.length;
  return pct === 1 ? 'green' : pct >= 0.5 ? 'amber' : 'red';
}

// ── EXECUTIVE DASHBOARD ──────────────────────────────────────────────────
function renderExecutive() {
  const allEmps   = EMPLOYEES.filter(e => e.role === 'employee');
  const active    = EMP_CREDENTIALS.filter(c => c.status === 'active').length;
  const expiring  = EMP_CREDENTIALS.filter(c => c.status === 'expiring').length;
  const expired   = EMP_CREDENTIALS.filter(c => c.status === 'expired').length;
  const prof      = EMP_CREDENTIALS.filter(ec => { const c = CREDENTIALS.find(c => c.id === ec.credId); return c && c.profReq && ec.status === 'active'; }).length;

  document.getElementById('exec-kpis').innerHTML = `
    <div class="kpi"><div class="k-label">Total Active Credentials</div><div class="k-value">${active}</div><div class="trend-up k-sub">↑ +3 vs last month</div></div>
    <div class="kpi"><div class="k-label">Proficiency Credentials</div><div class="k-value">${prof}</div><div class="k-sub">Meaningfully counted</div></div>
    <div class="kpi"><div class="k-label">Expiring ≤90 Days</div><div class="k-value" style="color:var(--amber)">${expiring}</div><div class="k-sub">Requires action</div></div>
    <div class="kpi"><div class="k-label">Expired Credentials</div><div class="k-value" style="color:var(--red)">${expired}</div><div class="trend-dn k-sub">Immediate renewal</div></div>
    <div class="kpi"><div class="k-label">Active Employees</div><div class="k-value">${allEmps.length}</div><div class="k-sub">Tracked</div></div>
    <div class="kpi"><div class="k-label">Partner Programmes</div><div class="k-value">${PARTNERS.length}</div><div class="k-sub">Under management</div></div>
  `;

  // Charts
  const pCts = PARTNERS.map(p => EMP_CREDENTIALS.filter(ec => { const c = CREDENTIALS.find(c => c.id === ec.credId); return c && c.partner === p.id && ec.status === 'active'; }).length);
  makeChart('chart-cred-by-partner', 'bar', {
    labels: PARTNERS.map(p => p.name),
    datasets: [{ label: 'Active Credentials', data: pCts, backgroundColor: PARTNERS.map(p => p.color + 'cc'), borderColor: PARTNERS.map(p => p.color), borderWidth: 1, borderRadius: 6 }],
  }, { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } });

  makeChart('chart-mom-trend', 'line', {
    labels: MONTHLY_TREND.map(m => m.month),
    datasets: PARTNERS.map(p => ({ label: p.name, data: MONTHLY_TREND.map(m => m[p.id]), borderColor: p.color, backgroundColor: p.color + '22', tension: .35, fill: false, borderWidth: 2, pointRadius: 3 })),
  }, { scales: { y: { beginAtZero: true } } });

  // RAG table
  const ragRows = PARTNERS.map(p => {
    const rag = getRAG(p.id); const reqs = PARTNER_REQUIREMENTS.filter(r => r.partner === p.id); const met = reqs.filter(r => r.currentCount >= r.minCount).length;
    const pct = reqs.length ? Math.round((met / reqs.length) * 100) : 100;
    return `<tr><td>${plg(p.id)} <strong>${p.name}</strong></td><td>${p.requirement}</td><td>${met}/${reqs.length} met</td><td style="min-width:110px">${progBar(pct)}</td><td>${ragPill(rag)}</td></tr>`;
  }).join('');
  document.getElementById('exec-rag-table').innerHTML = `<div class="table-wrap"><table><thead><tr><th>Partner</th><th>Programme</th><th>Requirements</th><th>Progress</th><th>RAG</th></tr></thead><tbody>${ragRows}</tbody></table></div>`;

  // Readiness bars
  document.getElementById('exec-readiness-bars').innerHTML = PARTNERS.map(p => {
    const reqs = PARTNER_REQUIREMENTS.filter(r => r.partner === p.id); const met = reqs.filter(r => r.currentCount >= r.minCount).length;
    const pct = reqs.length ? Math.round((met / reqs.length) * 100) : 100; const rag = getRAG(p.id);
    const col = rag === 'green' ? '#16a34a' : rag === 'amber' ? '#d97706' : '#CE1934';
    return `<div style="margin-bottom:16px">
      <div class="row between mb-4"><div class="row gap-2">${plg(p.id)}<strong>${p.name}</strong><span style="font-size:11px;color:var(--muted)">${p.requirement}</span></div><div class="row gap-2">${ragPill(rag)}<span style="font-size:11px;color:var(--muted)">${met}/${reqs.length} requirements</span></div></div>
      <div class="prog-wrap" style="height:11px"><div class="prog-bar" style="width:${pct}%;height:11px;background:${col}"></div></div>
    </div>`;
  }).join('');

  // Top / Bottom 5
  const scored = allEmps.map(emp => { const s = getStats(emp); return { emp, score: s.active + s.expiring }; }).sort((a, b) => b.score - a.score);
  const rankCard = (x, i, n) => `<div class="lb-item">
    <div class="lb-rank lb-rank-${['1','2','3','n','n'][i]}">${n}</div>
    <div class="emp-avatar" style="width:30px;height:30px;font-size:10px">${ini(x.emp.name)}</div>
    <div class="f1"><div style="font-weight:600;font-size:13px">${x.emp.name}</div><div style="font-size:11px;color:var(--muted)">${x.emp.dept} · ${plg(x.emp.partner)}</div></div>
    <div style="font-size:15px;font-weight:700">${x.score}</div>
  </div>`;
  document.getElementById('exec-top5').innerHTML    = scored.slice(0, 5).map((x, i) => rankCard(x, i, i + 1)).join('');
  document.getElementById('exec-bottom5').innerHTML = [...scored].reverse().slice(0, 5).map((x, i) => rankCard(x, Math.min(i + 3, 4), scored.length - i)).join('');

  // Latest activity
  const latest = [...EMP_CREDENTIALS].sort((a, b) => new Date(b.issued) - new Date(a.issued)).slice(0, 6);
  document.getElementById('exec-latest-activity').innerHTML = latest.map(ec => {
    const emp = EMPLOYEES.find(e => e.id === ec.empId); const cred = CREDENTIALS.find(c => c.id === ec.credId);
    return `<div class="lb-item"><div class="emp-avatar" style="width:28px;height:28px;font-size:10px">${ini(emp.name)}</div><div class="f1"><div style="font-size:13px;font-weight:600">${cred.name}</div><div style="font-size:11px;color:var(--muted)">${emp.name} · ${ec.issued}</div></div>${statusPill(ec.status)}</div>`;
  }).join('');
}

// ── PCC DASHBOARD ────────────────────────────────────────────────────────
function renderPCC() {
  document.getElementById('pcc-alerts').innerHTML = NOTIFICATIONS.filter(n => n.severity === 'red').slice(0, 3)
    .map(n => `<div class="alert alert-red"><span class="alert-icon">🔴</span><div>${n.message}</div></div>`).join('');
  renderPCCTable();
  renderPCCCharts();
}
function renderPCCTable() {
  const s  = (document.getElementById('pcc-search')        || {}).value || '';
  const fp = (document.getElementById('pcc-filter-partner') || {}).value || '';
  const fs = (document.getElementById('pcc-filter-status')  || {}).value || '';
  let emps = EMPLOYEES.filter(e => e.role === 'employee');
  if (currentRole === 'pcc') emps = emps.filter(e => e.pccId === currentUser.id);
  if (s)  emps = emps.filter(e => e.name.toLowerCase().includes(s.toLowerCase()));
  if (fp) emps = emps.filter(e => e.partner === fp);
  document.getElementById('pcc-tbody').innerHTML = emps.map(emp => {
    const st = getStats(emp);
    if (fs === 'expiring' && st.expiring === 0) return '';
    if (fs === 'expired'  && st.expired  === 0) return '';
    if (fs === 'missing'  && st.gaps     === 0) return '';
    return `<tr>
      <td><div class="row gap-2"><div class="emp-avatar" style="width:28px;height:28px;font-size:10px">${ini(emp.name)}</div><div><div style="font-weight:600">${emp.name}</div><div style="font-size:10px;color:var(--muted)">${emp.dept}</div></div></div></td>
      <td>${plg(emp.partner)}</td>
      <td>${emp.dept}</td>
      <td><strong style="color:var(--green)">${st.active}</strong></td>
      <td><strong style="color:var(--amber)">${st.expiring}</strong></td>
      <td><strong style="color:var(--red)">${st.expired}</strong></td>
      <td><strong style="color:var(--red)">${st.gaps}</strong></td>
      <td>${st.commits} <small>(${st.overdue} OD)</small></td>
      <td style="min-width:110px">${progBar(st.pct)}</td>
      <td><button class="btn btn-outline btn-sm" onclick="openEmployeeDetail(${emp.id})">View</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="10" style="text-align:center;color:var(--muted)">No records found</td></tr>';
}
function renderPCCCharts() {
  const a = EMP_CREDENTIALS.filter(c => c.status === 'active').length;
  const e = EMP_CREDENTIALS.filter(c => c.status === 'expiring').length;
  const x = EMP_CREDENTIALS.filter(c => c.status === 'expired').length;
  makeChart('chart-pcc-cred', 'doughnut', { labels: ['Active','Expiring','Expired'], datasets: [{ data: [a, e, x], backgroundColor: ['#16a34a','#d97706','#CE1934'], borderWidth: 0 }] });
  const pen = COMMITMENTS.filter(c => c.status === 'pending').length;
  const inp = COMMITMENTS.filter(c => c.status === 'in_progress').length;
  const ov  = COMMITMENTS.filter(c => c.status === 'overdue').length;
  const dn  = COMMITMENTS.filter(c => c.status === 'completed').length;
  makeChart('chart-pcc-commit', 'doughnut', { labels: ['Pending','In Progress','Overdue','Completed'], datasets: [{ data: [pen, inp, ov, dn], backgroundColor: ['#6b7280','#7c3aed','#CE1934','#16a34a'], borderWidth: 0 }] });
}

// ── EMPLOYEE PORTAL ──────────────────────────────────────────────────────
function renderEmployee() {
  const emp = (currentUser && currentUser.role === 'employee') ? currentUser : EMPLOYEES.find(e => e.id === 1);
  const c   = empCreds(emp.id);
  const s   = getStats(emp);

  document.getElementById('emp-kpis').innerHTML = `
    <div class="kpi"><div class="k-label">Active Credentials</div><div class="k-value" style="color:var(--green)">${s.active}</div></div>
    <div class="kpi"><div class="k-label">Expiring Soon</div><div class="k-value" style="color:var(--amber)">${s.expiring}</div></div>
    <div class="kpi"><div class="k-label">Expired</div><div class="k-value" style="color:var(--red)">${s.expired}</div></div>
    <div class="kpi"><div class="k-label">Mandatory Gaps</div><div class="k-value" style="color:var(--red)">${s.gaps}</div></div>
  `;
  document.getElementById('emp-alerts').innerHTML = NOTIFICATIONS.filter(n => n.empId === emp.id)
    .map(n => `<div class="alert alert-${n.severity === 'red' ? 'red' : 'amber'}"><span class="alert-icon">${n.severity === 'red' ? '🔴' : '🟡'}</span><div>${n.message}</div></div>`).join('');

  // Active creds
  document.getElementById('emp-active-creds').innerHTML = c.filter(ec => ec.status !== 'expired').map(ec => {
    const cr = CREDENTIALS.find(c => c.id === ec.credId); const d = daysUntil(ec.expiry);
    return `<div style="padding:9px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
      <div class="row between"><strong>${cr.name}</strong>${statusPill(ec.status)}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:3px">${plg(cr.partner)} ${cr.category} · Expires ${ec.expiry} (${d > 0 ? d + 'd' : 'EXPIRED'})
        ${cr.profReq ? '<span class="pill pill-purple" style="font-size:9px">Proficiency</span>' : ''}
        ${cr.mandatory ? '<span class="pill pill-blue" style="font-size:9px">Mandatory</span>' : ''}
      </div>
    </div>`;
  }).join('') || '<div style="color:var(--muted)">No active credentials.</div>';

  // Gaps
  const mandC = CREDENTIALS.filter(cr => cr.partner === emp.partner && (cr.mandatory || cr.profReq));
  const held  = c.filter(ec => ec.status === 'active' || ec.status === 'expiring').map(ec => ec.credId);
  const gaps2 = mandC.filter(cr => !held.includes(cr.id));
  document.getElementById('emp-gaps').innerHTML = gaps2.length === 0
    ? '<div class="alert alert-green"><span class="alert-icon">✅</span><div>No gaps — you meet all proficiency requirements!</div></div>'
    : gaps2.map(cr => `<div style="padding:9px;border:1px solid #fce8ec;border-radius:8px;margin-bottom:8px;background:#fff8f9"><strong>${cr.name}</strong><div style="font-size:11px;color:var(--muted);margin-top:2px">${plg(cr.partner)} ${cr.category} ${cr.mandatory ? '<span class="pill pill-red" style="font-size:9px">Mandatory</span>' : ''}</div></div>`).join('');

  // Training
  const myT = PLANNED_TRAINING.filter(t => t.empId === emp.id);
  document.getElementById('emp-training').innerHTML = myT.length === 0
    ? '<div style="color:var(--muted)">No planned training.</div>'
    : myT.map(t => { const co = COURSES.find(c => c.id === t.courseId); return `<div style="padding:9px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px"><div class="row between"><strong>${co.name}</strong>${statusPill(t.status)}</div><div style="font-size:11px;color:var(--muted);margin-top:2px">${plg(co.partner)} ${co.duration} · ${co.type} · ${t.plannedDate}</div>${t.notes ? `<div style="font-size:10px;color:var(--muted)">📝 ${t.notes}</div>` : ''}</div>`; }).join('');

  // Commitments
  const myCo = COMMITMENTS.filter(x => x.empId === emp.id);
  document.getElementById('emp-commitments').innerHTML = myCo.length === 0
    ? '<div style="color:var(--muted)">No commitments.</div>'
    : myCo.map(co => { const cr = CREDENTIALS.find(c => c.id === co.credId); return `<div style="padding:9px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px"><div class="row between"><strong>${cr ? cr.name : co.credId}</strong>${statusPill(co.status)}</div><div style="font-size:11px;color:var(--muted);margin-top:2px">Target: ${co.targetDate} · ${co.notes}</div></div>`; }).join('');

  // Progress chart
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul'];
  const base   = 2 + (EMPLOYEES.filter(e => e.role === 'employee').indexOf(emp) % 4);
  makeChart('chart-emp-progress', 'line', {
    labels: months,
    datasets: [{ label: 'Credentials Held', data: months.map((_, i) => base + i), borderColor: '#CE1934', backgroundColor: '#CE193422', fill: true, tension: .35, borderWidth: 2, pointRadius: 3 }],
  }, { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } });

  // Available courses
  document.getElementById('emp-courses').innerHTML = COURSES.filter(co => co.partner === emp.partner).map(co => `
    <div style="padding:9px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
      <div class="row between"><strong>${co.name}</strong><span class="pill pill-blue">${co.type}</span></div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${plg(co.partner)} ${co.duration}</div>
      <button class="btn btn-outline btn-sm mt-4" onclick="alert('Added to training plan (demo)')">+ Add to My Plan</button>
    </div>`).join('');
}

// ── L&D REPORTING ────────────────────────────────────────────────────────
function renderLD() {
  const qf = (document.getElementById('ld-filter-quarter') || {}).value || '';
  const pf = (document.getElementById('ld-filter-partner') || {}).value || '';
  const tf = (document.getElementById('ld-filter-type')    || {}).value || '';
  let tgts = [...QUARTERLY_TARGETS];
  if (qf) tgts = tgts.filter(t => t.quarter === qf);
  if (pf) tgts = tgts.filter(t => t.partner === pf);
  if (tf) tgts = tgts.filter(t => t.type === tf);

  const totT = tgts.reduce((s, t) => s + t.target,   0);
  const totA = tgts.reduce((s, t) => s + t.achieved, 0);
  const gap  = totT - totA;
  const pct  = totT ? Math.round((totA / totT) * 100) : 100;

  document.getElementById('ld-kpis').innerHTML = `
    <div class="kpi"><div class="k-label">Target</div><div class="k-value">${totT}</div></div>
    <div class="kpi"><div class="k-label">Achieved</div><div class="k-value" style="color:var(--green)">${totA}</div></div>
    <div class="kpi"><div class="k-label">Gap</div><div class="k-value" style="color:var(--red)">${gap}</div></div>
    <div class="kpi"><div class="k-label">Achievement Rate</div><div class="k-value" style="color:${pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'}">${pct}%</div></div>
  `;

  const byP = PARTNERS.map(p => ({ p, t: tgts.filter(x => x.partner === p.id).reduce((s, x) => s + x.target, 0), a: tgts.filter(x => x.partner === p.id).reduce((s, x) => s + x.achieved, 0) })).filter(x => x.t > 0);
  makeChart('chart-ld-quarterly', 'bar', {
    labels: byP.map(x => x.p.name),
    datasets: [{ label: 'Target', data: byP.map(x => x.t), backgroundColor: '#94a3b8', borderRadius: 4 }, { label: 'Achieved', data: byP.map(x => x.a), backgroundColor: '#CE1934', borderRadius: 4 }],
  }, { scales: { y: { beginAtZero: true } } });

  const tech  = EMP_CREDENTIALS.filter(ec => { const c = CREDENTIALS.find(c => c.id === ec.credId); return c && c.category === 'Technical'    && ec.status === 'active'; }).length;
  const sales = EMP_CREDENTIALS.filter(ec => { const c = CREDENTIALS.find(c => c.id === ec.credId); return c && c.category === 'Sales'         && ec.status === 'active'; }).length;
  const prac  = EMP_CREDENTIALS.filter(ec => { const c = CREDENTIALS.find(c => c.id === ec.credId); return c && c.category === 'Practitioner'  && ec.status === 'active'; }).length;
  const fnd   = EMP_CREDENTIALS.filter(ec => { const c = CREDENTIALS.find(c => c.id === ec.credId); return c && !c.profReq && ec.status === 'active'; }).length;
  makeChart('chart-ld-types', 'doughnut', { labels: ['Technical','Sales','Practitioner','Foundational'], datasets: [{ data: [tech, sales, prac, fnd], backgroundColor: ['#CE1934','#16a34a','#7c3aed','#d97706'], borderWidth: 0 }] });

  document.getElementById('ld-tbody').innerHTML = tgts.map(t => {
    const g = t.target - t.achieved; const rag = g <= 0 ? 'green' : g <= 1 ? 'amber' : 'red';
    return `<tr><td>${t.quarter}</td><td>${plg(t.partner)} ${t.partner}</td><td>${t.type}</td><td>${t.target}</td><td>${t.achieved}</td><td><strong style="color:${g > 0 ? 'var(--red)' : 'var(--green)'}">${g}</strong></td><td>${ragPill(rag)}</td></tr>`;
  }).join('');

  let empData = [...EMP_CREDENTIALS];
  if (pf) empData = empData.filter(ec => { const c = CREDENTIALS.find(c => c.id === ec.credId); return c && c.partner === pf; });
  if (tf) empData = empData.filter(ec => { const c = CREDENTIALS.find(c => c.id === ec.credId); return c && c.category === tf; });
  document.getElementById('ld-emp-tbody').innerHTML = empData.map(ec => {
    const emp = EMPLOYEES.find(e => e.id === ec.empId); const cr = CREDENTIALS.find(c => c.id === ec.credId); if (!emp || !cr) return '';
    return `<tr><td>${emp.name}</td><td>${plg(cr.partner)}</td><td>${cr.name}</td><td>${cr.category}</td><td>${cr.profReq ? '<span class="pill pill-purple">Proficiency</span>' : '<span class="pill pill-gray">Additional</span>'}</td><td>${cr.mandatory ? '<span class="pill pill-blue">Mandatory</span>' : '-'}</td><td>${statusPill(ec.status)}</td><td>${ec.expiry}</td></tr>`;
  }).join('');
}
function exportLDReport() {
  const rows = [['Quarter','Partner','Type','Target','Achieved','Gap'], ...QUARTERLY_TARGETS.map(t => [t.quarter, t.partner, t.type, t.target, t.achieved, t.target - t.achieved])];
  _downloadCSV(rows, 'ovations-ld-report.csv');
}

// ── PARTNER RISK ─────────────────────────────────────────────────────────
function renderPartnerRisk() {
  const pf = (document.getElementById('pvr-filter-partner') || {}).value || '';
  const rf = (document.getElementById('pvr-filter-risk')    || {}).value || '';

  const totExp     = EMP_CREDENTIALS.filter(c => c.status === 'expired').length;
  const totExp2    = EMP_CREDENTIALS.filter(c => c.status === 'expiring').length;
  const totGaps    = PARTNER_REQUIREMENTS.filter(r => r.currentCount < r.minCount).length;
  const redPartners = PARTNERS.filter(p => getRAG(p.id) === 'red').length;

  document.getElementById('pvr-kpis').innerHTML = `
    <div class="kpi"><div class="k-label">Expired Credentials</div><div class="k-value" style="color:var(--red)">${totExp}</div><div class="k-sub">Immediate action</div></div>
    <div class="kpi"><div class="k-label">Expiring ≤90 Days</div><div class="k-value" style="color:var(--amber)">${totExp2}</div></div>
    <div class="kpi"><div class="k-label">Requirement Gaps</div><div class="k-value" style="color:var(--red)">${totGaps}</div></div>
    <div class="kpi"><div class="k-label">Red Risk Partners</div><div class="k-value" style="color:var(--red)">${redPartners}</div></div>
  `;

  let reqs = [...PARTNER_REQUIREMENTS];
  if (pf) reqs = reqs.filter(r => r.partner === pf);
  document.getElementById('pvr-req-tbody').innerHTML = reqs.map(r => {
    const cr = CREDENTIALS.find(c => c.id === r.credId); const g = r.minCount - r.currentCount; const rag = g <= 0 ? 'green' : g <= 1 ? 'amber' : 'red';
    if (rf && rag !== rf) return '';
    return `<tr><td>${plg(r.partner)} <strong>${r.partner}</strong></td><td>${cr ? cr.name : r.credId}</td><td><strong>${r.minCount}</strong></td><td><strong>${r.currentCount}</strong></td><td><strong style="color:${g > 0 ? 'var(--red)' : 'var(--green)'}">${g > 0 ? g : 0}</strong></td><td>${ragPill(rag)}</td><td style="font-size:11px;color:var(--muted)">${r.notes}</td></tr>`;
  }).join('');

  document.getElementById('pvr-expired').innerHTML = EMP_CREDENTIALS.filter(ec => ec.status === 'expired').map(ec => {
    const emp = EMPLOYEES.find(e => e.id === ec.empId); const cr = CREDENTIALS.find(c => c.id === ec.credId);
    return `<div style="padding:9px;border:1px solid #fce8ec;border-radius:8px;margin-bottom:6px;background:#fff8f9"><div class="row between"><strong>${cr.name}</strong><span class="pill pill-red">Expired</span></div><div style="font-size:11px;color:var(--muted);margin-top:2px">${emp.name} · ${ec.expiry}</div></div>`;
  }).join('') || '<div style="color:var(--muted)">None.</div>';

  document.getElementById('pvr-expiring').innerHTML = EMP_CREDENTIALS.filter(ec => ec.status === 'expiring').map(ec => {
    const emp = EMPLOYEES.find(e => e.id === ec.empId); const cr = CREDENTIALS.find(c => c.id === ec.credId); const d = daysUntil(ec.expiry);
    return `<div style="padding:9px;border:1px solid #fef3c7;border-radius:8px;margin-bottom:6px;background:#fffbeb"><div class="row between"><strong>${cr.name}</strong><span class="pill pill-amber">${d}d left</span></div><div style="font-size:11px;color:var(--muted);margin-top:2px">${emp.name} · Expires: ${ec.expiry}</div></div>`;
  }).join('') || '<div style="color:var(--muted)">None.</div>';

  document.getElementById('pvr-config-table').innerHTML = `<div class="table-wrap"><table><thead><tr><th>Partner</th><th>Credential</th><th>Min Count</th><th>Current</th><th>RAG</th><th></th></tr></thead><tbody>${PARTNER_REQUIREMENTS.map(r => {
    const cr = CREDENTIALS.find(c => c.id === r.credId); const rag = r.currentCount >= r.minCount ? 'green' : r.currentCount >= r.minCount * 0.5 ? 'amber' : 'red';
    return `<tr><td>${plg(r.partner)}</td><td>${cr ? cr.name : r.credId}</td><td><input type="number" value="${r.minCount}" min="1" max="20" style="width:50px;padding:2px 6px;border:1px solid var(--border);border-radius:4px" onchange="updateReqMin('${r.id}',this.value)"/></td><td>${r.currentCount}</td><td>${ragPill(rag)}</td><td><button class="btn btn-outline btn-sm">Edit</button></td></tr>`;
  }).join('')}</tbody></table></div>`;
}
function updateReqMin(reqId, val) {
  const r = PARTNER_REQUIREMENTS.find(r => r.id === reqId); if (r) r.minCount = parseInt(val) || r.minCount; renderPartnerRisk();
}
function exportPartnerReport() {
  const rows = [['Partner','Credential','Required','Current','Gap','RAG'], ...PARTNER_REQUIREMENTS.map(r => {
    const cr = CREDENTIALS.find(c => c.id === r.credId); const g = r.minCount - r.currentCount;
    return [r.partner, cr ? cr.name : r.credId, r.minCount, r.currentCount, g > 0 ? g : 0, g <= 0 ? 'GREEN' : g <= 1 ? 'AMBER' : 'RED'];
  })];
  _downloadCSV(rows, 'ovations-partner-risk.csv');
}

// ── LEADERBOARD ──────────────────────────────────────────────────────────
function renderLeaderboard() {
  const pf = (document.getElementById('lb-filter-partner') || {}).value || '';
  const tf = (document.getElementById('lb-filter-type')    || {}).value || '';
  let emps = EMPLOYEES.filter(e => e.role === 'employee');
  if (pf) emps = emps.filter(e => e.partner === pf);

  const ranked = emps.map(emp => {
    const c    = empCreds(emp.id).filter(ec => ec.status === 'active' || ec.status === 'expiring');
    const tech = c.filter(ec => { const cr = CREDENTIALS.find(c => c.id === ec.credId); return cr && cr.category === 'Technical'; }).length;
    const sales = c.filter(ec => { const cr = CREDENTIALS.find(c => c.id === ec.credId); return cr && cr.category === 'Sales'; }).length;
    const prac  = c.filter(ec => { const cr = CREDENTIALS.find(c => c.id === ec.credId); return cr && cr.category === 'Practitioner'; }).length;
    const total = tf === 'Technical' ? tech : tf === 'Sales' ? sales : tf === 'Practitioner' ? prac : tech + sales + prac;
    const exp   = empCreds(emp.id).filter(ec => ec.status === 'expiring').length;
    const xp    = empCreds(emp.id).filter(ec => ec.status === 'expired').length;
    const mandOK = CREDENTIALS.filter(cr => cr.partner === emp.partner && cr.mandatory).every(cr => empCreds(emp.id).some(ec => ec.credId === cr.id && (ec.status === 'active' || ec.status === 'expiring')));
    const rag = xp > 0 || !mandOK ? 'red' : exp > 0 ? 'amber' : 'green';
    return { emp, tech, sales, prac, total, exp, xp, rag };
  }).sort((a, b) => b.total - a.total);

  const lbCard = (x, rank, colorVar) => `<div class="lb-item">
    <div class="lb-rank lb-rank-${['1','2','3','n','n'][Math.min(rank - 1, 4)]}">${rank}</div>
    <div class="emp-avatar" style="width:30px;height:30px;font-size:10px">${ini(x.emp.name)}</div>
    <div class="f1"><div style="font-weight:600;font-size:13px">${x.emp.name}</div><div style="font-size:11px;color:var(--muted)">${x.emp.dept} · ${plg(x.emp.partner)}</div></div>
    <div style="text-align:right"><div style="font-size:15px;font-weight:700;color:${colorVar}">${x.total}</div><div style="font-size:10px;color:var(--muted)">credentials</div></div>
  </div>`;

  document.getElementById('lb-top5').innerHTML    = ranked.slice(0, 5).map((x, i) => lbCard(x, i + 1, '#16a34a')).join('');
  document.getElementById('lb-bottom5').innerHTML = [...ranked].reverse().slice(0, 5).map((x, i) => lbCard(x, ranked.length - i, '#d97706')).join('');

  makeChart('chart-lb-types', 'bar', {
    labels: ranked.map(x => x.emp.name.split(' ')[0]),
    datasets: [
      { label: 'Technical',    data: ranked.map(x => x.tech),  backgroundColor: '#CE1934cc', borderRadius: 4 },
      { label: 'Sales',        data: ranked.map(x => x.sales), backgroundColor: '#16a34acc', borderRadius: 4 },
      { label: 'Practitioner', data: ranked.map(x => x.prac),  backgroundColor: '#7c3aedcc', borderRadius: 4 },
    ],
  }, { scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } });

  makeChart('chart-lb-trend', 'line', {
    labels: MONTHLY_TREND.map(m => m.month),
    datasets: PARTNERS.filter(p => !pf || p.id === pf).map(p => ({ label: p.name, data: MONTHLY_TREND.map(m => m[p.id]), borderColor: p.color, backgroundColor: p.color + '22', fill: false, tension: .35, borderWidth: 2, pointRadius: 3 })),
  }, { scales: { y: { beginAtZero: true } } });

  document.getElementById('lb-tbody').innerHTML = ranked.map((x, i) => `<tr>
    <td><strong>${i + 1}</strong></td>
    <td><div class="row gap-2"><div class="emp-avatar" style="width:26px;height:26px;font-size:9px">${ini(x.emp.name)}</div><div><div style="font-weight:600">${x.emp.name}</div><div style="font-size:10px;color:var(--muted)">${x.emp.dept}</div></div></div></td>
    <td>${plg(x.emp.partner)}</td>
    <td><strong style="color:#CE1934">${x.tech}</strong></td>
    <td><strong style="color:#16a34a">${x.sales}</strong></td>
    <td><strong style="color:#7c3aed">${x.prac}</strong></td>
    <td><strong>${x.total}</strong></td>
    <td><span style="color:var(--amber)">${x.exp}</span></td>
    <td><span style="color:var(--red)">${x.xp}</span></td>
    <td>${ragPill(x.rag)}</td>
  </tr>`).join('');
}

// ── NOTIFICATIONS ────────────────────────────────────────────────────────
function renderNotifications() {
  const reds   = NOTIFICATIONS.filter(n => n.severity === 'red').length;
  const ambers = NOTIFICATIONS.filter(n => n.severity === 'amber').length;
  document.getElementById('notif-summary').innerHTML = `
    <div class="grid g2 gap-2 mb-4">
      <div class="kpi card-sm"><div class="k-label">Critical Alerts</div><div class="k-value" style="color:var(--red)">${reds}</div></div>
      <div class="kpi card-sm"><div class="k-label">Warnings</div><div class="k-value" style="color:var(--amber)">${ambers}</div></div>
    </div>
    <div class="alert alert-red"><span class="alert-icon">🔴</span><div>${reds} credentials require immediate attention</div></div>
    <div class="alert alert-amber"><span class="alert-icon">🟡</span><div>${ambers} items approaching risk threshold</div></div>
  `;
  document.getElementById('all-notifs').innerHTML = NOTIFICATIONS.map(n => `
    <div class="alert alert-${n.severity === 'red' ? 'red' : 'amber'}">
      <span class="alert-icon">${n.type === 'expiring' ? '⏰' : n.type === 'expired' ? '🔴' : n.type === 'gap' ? '⚠️' : '📌'}</span>
      <div><div style="font-weight:600">${n.message}</div><div style="font-size:10px;opacity:.75;margin-top:1px">${n.type.replace('_',' ').toUpperCase()} · ${n.date}</div></div>
    </div>`).join('');
}

// ── ADMIN ────────────────────────────────────────────────────────────────
function renderAdmin() {
  document.getElementById('admin-emp-count').textContent = EMPLOYEES.filter(e => e.role === 'employee').length;
  const pccs = EMPLOYEES.filter(e => e.role === 'pcc');
  document.getElementById('admin-pcc-tbody').innerHTML = pccs.map(pcc => {
    const counselees = EMPLOYEES.filter(e => e.pccId === pcc.id);
    const partners   = [...new Set(counselees.map(e => e.partner).filter(Boolean))];
    return `<tr>
      <td><div class="row gap-2"><div class="emp-avatar" style="width:28px;height:28px;font-size:10px">${ini(pcc.name)}</div><div><div style="font-weight:600">${pcc.name}</div><div style="font-size:10px;color:var(--muted)">${pcc.dept}</div></div></div></td>
      <td>${counselees.map(c => `<span style="font-size:12px">${c.name}</span>`).join(', ')}</td>
      <td>${partners.map(p => plg(p)).join(' ')}</td>
      <td><button class="btn btn-outline btn-sm">Manage</button></td>
    </tr>`;
  }).join('');
}

// ── EMPLOYEE DETAIL MODAL ────────────────────────────────────────────────
function openEmployeeDetail(empId) {
  const emp     = EMPLOYEES.find(e => e.id === empId);
  const c       = empCreds(empId);
  const s       = getStats(emp);
  const commits = COMMITMENTS.filter(x => x.empId === empId);
  const tr      = PLANNED_TRAINING.filter(x => x.empId === empId);

  document.getElementById('modal-body').innerHTML = `
    <h2><div class="row gap-3"><div class="emp-avatar">${ini(emp.name)}</div><div><div>${emp.name}</div><div style="font-size:12px;font-weight:400;color:var(--muted)">${emp.dept} · ${plg(emp.partner)}</div></div></div></h2>
    <div class="grid g4 mb-4">
      <div class="kpi card-sm"><div class="k-label">Active</div><div class="k-value" style="color:var(--green)">${s.active}</div></div>
      <div class="kpi card-sm"><div class="k-label">Expiring</div><div class="k-value" style="color:var(--amber)">${s.expiring}</div></div>
      <div class="kpi card-sm"><div class="k-label">Expired</div><div class="k-value" style="color:var(--red)">${s.expired}</div></div>
      <div class="kpi card-sm"><div class="k-label">Gaps</div><div class="k-value" style="color:var(--red)">${s.gaps}</div></div>
    </div>
    <div style="font-weight:600;margin-bottom:8px">Credentials</div>
    <div class="table-wrap mb-4"><table><thead><tr><th>Credential</th><th>Category</th><th>Status</th><th>Expiry</th></tr></thead><tbody>${c.map(ec => { const cr = CREDENTIALS.find(c => c.id === ec.credId); return `<tr><td>${cr ? cr.name : ec.credId}</td><td>${cr ? cr.category : ''}</td><td>${statusPill(ec.status)}</td><td>${ec.expiry}</td></tr>`; }).join('')}</tbody></table></div>
    <div style="font-weight:600;margin-bottom:8px">Commitments</div>
    ${commits.length === 0 ? '<div style="color:var(--muted);font-size:12px">No commitments.</div>' : commits.map(co => { const cr = CREDENTIALS.find(c => c.id === co.credId); return `<div style="padding:8px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px"><div class="row between"><span>${cr ? cr.name : co.credId}</span>${statusPill(co.status)}</div><div style="font-size:11px;color:var(--muted)">Target: ${co.targetDate}</div></div>`; }).join('')}
    <div style="font-weight:600;margin:12px 0 8px">Planned Training</div>
    ${tr.length === 0 ? '<div style="color:var(--muted);font-size:12px">No planned training.</div>' : tr.map(t => { const co = COURSES.find(c => c.id === t.courseId); return `<div style="padding:8px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px"><div class="row between"><span>${co ? co.name : t.courseId}</span>${statusPill(t.status)}</div><div style="font-size:11px;color:var(--muted)">Planned: ${t.plannedDate}</div></div>`; }).join('')}
    <button class="btn btn-primary mt-4" onclick="alert('Add commitment (demo)')">+ Add Commitment</button>
  `;
  document.getElementById('modal-overlay').classList.add('open');
}

// ── ADD REQUIREMENT MODAL ────────────────────────────────────────────────
function openAddRequirementModal() {
  document.getElementById('modal-body').innerHTML = `
    <h2>Add Partner Requirement</h2>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Partner</label><select id="new-req-partner" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px">${PARTNERS.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Credential</label><select id="new-req-cred" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px">${CREDENTIALS.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Minimum Count</label><input id="new-req-min" type="number" value="1" min="1" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px"/></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Notes</label><input id="new-req-notes" type="text" placeholder="e.g. Required for Gold tier" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px"/></div>
      <button class="btn btn-primary" onclick="saveNewRequirement()">Save Requirement</button>
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('open');
}
function saveNewRequirement() {
  PARTNER_REQUIREMENTS.push({ id: 'PR' + Date.now(), partner: document.getElementById('new-req-partner').value, credId: document.getElementById('new-req-cred').value, minCount: parseInt(document.getElementById('new-req-min').value) || 1, currentCount: 0, notes: document.getElementById('new-req-notes').value });
  document.getElementById('modal-overlay').classList.remove('open');
  renderPartnerRisk();
}

// ── NOTIFICATION PANEL ───────────────────────────────────────────────────
function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    document.getElementById('notif-list').innerHTML = NOTIFICATIONS.slice(0, 7).map(n => `<div class="alert alert-${n.severity === 'red' ? 'red' : 'amber'}" style="font-size:12px"><span class="alert-icon">${n.severity === 'red' ? '🔴' : '🟡'}</span><div>${n.message}</div></div>`).join('');
  }
}

// ── MODAL CLOSE ──────────────────────────────────────────────────────────
function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) document.getElementById('modal-overlay').classList.remove('open');
}

// ── CSV EXPORT HELPER ────────────────────────────────────────────────────
function _downloadCSV(rows, filename) {
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.map(r => r.join(',')).join('\n'));
  a.download = filename;
  a.click();
}
