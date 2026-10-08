// ═══════════════════════════════════════════════════════════════════════
// Ovations TCMS — Application Bootstrap
// Navigation, routing and initialisation.
// ═══════════════════════════════════════════════════════════════════════

// ── Section metadata ─────────────────────────────────────────────────────
const NAV_ITEMS = {
  'sec-executive':     { icon: '📊', label: 'Executive Dashboard' },
  'sec-pcc':           { icon: '👥', label: 'Career Counsellor'    },
  'sec-employee':      { icon: '🎓', label: 'My Learning Portal'   },
  'sec-ld':            { icon: '📋', label: 'L&D Reporting'        },
  'sec-partner':       { icon: '🤝', label: 'Partner Risk'         },
  'sec-leaderboard':   { icon: '🏆', label: 'Leaderboards'         },
  'sec-notifications': { icon: '🔔', label: 'Notifications'        },
  'sec-admin':         { icon: '⚙️', label: 'Administration'       },
};

// ── Build sidebar navigation for the current role ────────────────────────
function buildNav() {
  const allowed = ROLE_NAV[currentRole];
  const menu    = document.getElementById('nav-menu');
  menu.innerHTML = '';

  const grp = document.createElement('div');
  const lbl = document.createElement('div');
  lbl.className   = 'nav-label';
  lbl.textContent = ROLE_META[currentRole].label;
  grp.appendChild(lbl);

  allowed.forEach(secId => {
    const item = NAV_ITEMS[secId];
    if (!item) return;
    const el = document.createElement('div');
    el.className = 'nav-item';
    el.id        = 'nav-' + secId;
    el.innerHTML = `<i class="icon">${item.icon}</i> ${item.label}`;
    el.onclick   = () => navigateTo(secId);
    grp.appendChild(el);
  });

  menu.appendChild(grp);
}

// ── Navigate to a section ────────────────────────────────────────────────
function navigateTo(secId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById(secId);
  const nav = document.getElementById('nav-' + secId);
  if (sec) sec.classList.add('active');
  if (nav) nav.classList.add('active');
  document.getElementById('notif-panel').classList.remove('open');
  renderSection(secId);
}

// ── Section dispatcher ───────────────────────────────────────────────────
function renderSection(id) {
  switch (id) {
    case 'sec-executive':     renderExecutive();     break;
    case 'sec-pcc':           renderPCC();           break;
    case 'sec-employee':      renderEmployee();      break;
    case 'sec-ld':            renderLD();            break;
    case 'sec-partner':       renderPartnerRisk();   break;
    case 'sec-leaderboard':   renderLeaderboard();   break;
    case 'sec-notifications': renderNotifications(); break;
    case 'sec-admin':         renderAdmin();         break;
  }
}

// ── Initialise on DOM ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Populate demo account hint cards on the login screen
  const grid = document.getElementById('hint-grid');
  USER_ACCOUNTS.forEach(a => {
    const emp  = EMPLOYEES.find(e => e.id === a.userId);
    const card = document.createElement('div');
    card.className = 'login-cred';
    card.innerHTML = `
      <div class="lc-role">${a.hint}</div>
      <div class="lc-name">${emp ? emp.name : a.email}</div>
      <div class="lc-user">${a.email}</div>`;
    card.onclick = () => {
      document.getElementById('login-email').value    = a.email;
      document.getElementById('login-password').value = a.password;
      document.getElementById('login-error').style.display = 'none';
    };
    grid.appendChild(card);
  });

  // Focus email on load
  document.getElementById('login-email').focus();

  // Close notification panel on outside click
  document.addEventListener('click', e => {
    const panel = document.getElementById('notif-panel');
    const btn   = document.querySelector('.notif-btn');
    if (panel && panel.classList.contains('open') && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
});
