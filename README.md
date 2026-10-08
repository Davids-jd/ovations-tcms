# Ovations TCMS — Training & Certificate Management System

A role-based web application for managing partner training, certifications, credentials and proficiency across Ovations Technologies.

---

## Project Structure

```
ovations-tcms/
├── index.html          ← Main entry point (open this in a browser)
├── css/
│   └── styles.css      ← All styles (Ovations brand colours)
├── js/
│   ├── data.js         ← All data: employees, credentials, partners, notifications
│   ├── auth.js         ← Login / logout / role-based access control
│   ├── render.js       ← All dashboard rendering functions
│   └── app.js          ← Navigation, routing and app initialisation
└── README.md           ← This file
```

---

## How to Run

Open `index.html` in any modern web browser.  
No server, no build tools, no installation required.

> **Note:** Chart.js is loaded from CDN (`cdn.jsdelivr.net`). An internet connection is required for charts to render. All other functionality works offline.

---

## Login Credentials

| Dashboard | Name | Email | Password |
|---|---|---|---|
| Employee | Nhlanhla Masondo | `nhlanhla@ovations.co.za` | `Nhlanhla123!` |
| Employee | Mncedisi Sibeko | `mncedisi@ovations.co.za` | `Mncedisi123!` |
| Career Counsellor (PCC) | Renno Minnie | `renno@ovations.co.za` | `Renno123!` |
| Administration (L&D) | Charmaine Sekwena | `charmaine@ovations.co.za` | `Charm123!` |
| Partner Lead | Mark Mallabo | `mark.m@ovations.co.za` | `MarkM123!` |
| Executive | Deon van Niekerk | `deon@ovations.co.za` | `Deon123!` |

Each login unlocks only the sections relevant to that role.

---

## Dashboards

| Dashboard | Role(s) |
|---|---|
| Executive Dashboard | Executive |
| Career Counsellor (PCC) Dashboard | PCC, L&D Admin, Executive |
| My Learning & Credential Portal | Employee, PCC, Executive |
| L&D Reporting | L&D Admin, Partner Lead, Executive |
| Partner & Vendor Risk | Partner Lead, Executive |
| Leaderboards & Reporting | L&D Admin, Partner Lead, Executive |
| Notifications & Alerts | All roles |
| Administration | L&D Admin, Executive |

---

## Data Model (js/data.js)

| Entity | Description |
|---|---|
| `PARTNERS` | 5 partner programmes (IBM, AWS, Atlassian, Camunda, Nintex) |
| `EMPLOYEES` | 12 employees + 6 system users (PCCs, admin, exec) |
| `CREDENTIALS` | 15 credential/badge definitions with category and proficiency flags |
| `EMP_CREDENTIALS` | 25 employee credential records with status, issue and expiry dates |
| `COURSES` | 8 training courses linked to credentials |
| `PLANNED_TRAINING` | Planned and in-progress training records |
| `COMMITMENTS` | Employee training commitments with target dates |
| `PARTNER_REQUIREMENTS` | Minimum credential headcounts per partner (editable at runtime) |
| `QUARTERLY_TARGETS` | Quarterly credential targets and achieved counts |
| `MONTHLY_TREND` | 7-month historical credential counts per partner |
| `NOTIFICATIONS` | 10 active alerts (expiry, gap, commitment, partner risk) |

---

## Roles & Permissions

| Role | Access |
|---|---|
| `employee` | My Learning Portal, Notifications |
| `pcc` | PCC Dashboard, My Learning Portal, Notifications |
| `ld_admin` | L&D Reporting, PCC Dashboard, Leaderboards, Notifications, Administration |
| `partner_lead` | Partner Risk, Leaderboards, L&D Reporting, Notifications |
| `executive` | All sections |

---

## Brand

- **Primary Red:** `#CE1934`
- **Dark Navy:** `#0D1B2A`
- **White:** `#FFFFFF`
- **Font:** `-apple-system, 'Segoe UI', system-ui, sans-serif`

Colours sourced directly from [ovationsgroup.com](https://ovationsgroup.com).

---

## Future Integration Points (Administration → Integration Readiness)

- IBM Learning / Partner Plus — OAuth2 / REST API
- AWS Partner Systems — REST API
- Atlassian — REST API *(planned)*
- Camunda — Webhook / API *(planned)*
- Nintex — REST API *(planned)*
- Credly (Open Badges) — Credly API v2 *(planned)*

---

## Notes

- All data is in-memory (demo). Wiring to a backend database requires replacing the arrays in `js/data.js` with API calls.
- Reference date is set to `2025-07-15` in `js/data.js` (`const TODAY`). Update this or replace with `new Date()` for live use.
- Credential status (`active`, `expiring`, `expired`) is pre-set in the demo data. In production this would be computed automatically against `TODAY`.
