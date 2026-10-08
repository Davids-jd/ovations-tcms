// ═══════════════════════════════════════════════════════════════════════
// Ovations TCMS — Authentication & Role Management
// ═══════════════════════════════════════════════════════════════════════

// ── User Accounts (demo credentials) ────────────────────────────────────
const USER_ACCOUNTS = [
  { email: 'nhlanhla@ovations.co.za',  password: 'Nhlanhla123!', role: 'employee',     userId: 1,   hint: 'Employee'               },
  { email: 'mncedisi@ovations.co.za',  password: 'Mncedisi123!', role: 'employee',     userId: 2,   hint: 'Employee'               },
  { email: 'renno@ovations.co.za',     password: 'Renno123!',    role: 'pcc',          userId: 101, hint: 'Career Counsellor (PCC)'},
  { email: 'charmaine@ovations.co.za', password: 'Charm123!',    role: 'ld_admin',     userId: 200, hint: 'Administration'         },
  { email: 'mark.m@ovations.co.za',    password: 'MarkM123!',    role: 'partner_lead', userId: 300, hint: 'Partner Lead'           },
  { email: 'deon@ovations.co.za',      password: 'Deon123!',     role: 'executive',    userId: 400, hint: 'Executive'              },
];

// ── Role metadata ────────────────────────────────────────────────────────
const ROLE_META = {
  employee:     { label: 'Employee',                avatar: 'NM', userId: 1   },
  pcc:          { label: 'Career Counsellor (PCC)', avatar: 'RM', userId: 101 },
  ld_admin:     { label: 'Administration',          avatar: 'CS', userId: 200 },
  partner_lead: { label: 'Partner Lead',            avatar: 'MM', userId: 300 },
  executive:    { label: 'Executive',               avatar: 'DV', userId: 400 },
};

// ── Sections each role may access ───────────────────────────────────────
const ROLE_NAV = {
  employee:     ['sec-employee', 'sec-notifications'],
  pcc:          ['sec-pcc', 'sec-employee', 'sec-notifications'],
  ld_admin:     ['sec-ld', 'sec-pcc', 'sec-leaderboard', 'sec-notifications', 'sec-admin'],
  partner_lead: ['sec-partner', 'sec-leaderboard', 'sec-ld', 'sec-notifications'],
  executive:    ['sec-executive', 'sec-leaderboard', 'sec-pcc', 'sec-ld', 'sec-partner', 'sec-notifications', 'sec-admin'],
};

// ── Active session state ─────────────────────────────────────────────────
let currentRole = null;
let currentUser = null;

// ── Login ────────────────────────────────────────────────────────────────
function doLogin() {
  const email    = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const account  = USER_ACCOUNTS.find(a => a.email === email && a.password === password);
  const errEl    = document.getElementById('login-error');

  if (!account) {
    errEl.style.display = 'block';
    document.getElementById('login-password').value = '';
    return;
  }
  errEl.style.display = 'none';

  // Establish session
  currentRole = account.role;
  currentUser = EMPLOYEES.find(e => e.id === account.userId);

  // Update topbar identity
  const av = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('user-avatar').textContent = av;
  document.getElementById('user-name').textContent   = currentUser.name;

  // Show app, hide login
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('topbar').style.display       = 'flex';
  document.getElementById('layout').style.display       = 'flex';

  buildNav();
  navigateTo(ROLE_NAV[currentRole][0]);
}

// ── Logout ───────────────────────────────────────────────────────────────
function doLogout() {
  currentRole = null;
  currentUser = null;
  document.getElementById('topbar').style.display       = 'none';
  document.getElementById('layout').style.display       = 'none';
  document.getElementById('notif-panel').classList.remove('open');
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-email').value          = '';
  document.getElementById('login-password').value       = '';
  document.getElementById('login-error').style.display  = 'none';
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
}
