// ═══════════════════════════════════════════════════════════════════════
// Ovations TCMS — Data Model
// All reference data, employees, credentials and transactional records.
// ═══════════════════════════════════════════════════════════════════════

const TODAY = new Date('2025-07-15');

// ── Partners ────────────────────────────────────────────────────────────
const PARTNERS = [
  { id: 'IBM',       name: 'IBM',       color: '#006699', target: 85, requirement: 'Gold Partner'       },
  { id: 'AWS',       name: 'AWS',       color: '#FF9900', target: 80, requirement: 'Select Tier'        },
  { id: 'ATLASSIAN', name: 'Atlassian', color: '#0052CC', target: 75, requirement: 'Solution Partner'   },
  { id: 'CAMUNDA',   name: 'Camunda',   color: '#FC5D0D', target: 70, requirement: 'Certified Partner'  },
  { id: 'NINTEX',    name: 'Nintex',    color: '#00A2E8', target: 65, requirement: 'Expert Partner'     },
];

// ── Employees & System Users ─────────────────────────────────────────────
const EMPLOYEES = [
  { id: 1,   name: 'Nhlanhla Masondo',  role: 'employee',     pccId: 101, partner: 'IBM',       dept: 'Engineering'  },
  { id: 2,   name: 'Mncedisi Sibeko',   role: 'employee',     pccId: 101, partner: 'IBM',       dept: 'Engineering'  },
  { id: 3,   name: 'Cleo Nkosi',        role: 'employee',     pccId: 101, partner: 'AWS',       dept: 'Cloud'        },
  { id: 4,   name: 'David Sithole',     role: 'employee',     pccId: 102, partner: 'ATLASSIAN', dept: 'Delivery'     },
  { id: 5,   name: 'Erica van Wyk',     role: 'employee',     pccId: 102, partner: 'ATLASSIAN', dept: 'Delivery'     },
  { id: 6,   name: 'Faisal Ahmed',      role: 'employee',     pccId: 102, partner: 'CAMUNDA',   dept: 'BPM'          },
  { id: 7,   name: 'Grace Mthembu',     role: 'employee',     pccId: 103, partner: 'NINTEX',    dept: 'Automation'   },
  { id: 8,   name: 'Hein Botha',        role: 'employee',     pccId: 103, partner: 'IBM',       dept: 'Engineering'  },
  { id: 9,   name: 'Irene Khumalo',     role: 'employee',     pccId: 103, partner: 'AWS',       dept: 'Cloud'        },
  { id: 10,  name: 'James Pretorius',   role: 'employee',     pccId: 101, partner: 'IBM',       dept: 'Sales'        },
  { id: 11,  name: 'Karen Olivier',     role: 'employee',     pccId: 102, partner: 'AWS',       dept: 'Cloud'        },
  { id: 12,  name: 'Lungelo Zulu',      role: 'employee',     pccId: 103, partner: 'CAMUNDA',   dept: 'BPM'          },
  { id: 101, name: 'Renno Minnie',      role: 'pcc',          pccId: null, partner: null,       dept: 'L&D'          },
  { id: 102, name: 'Simon Jordaan',     role: 'pcc',          pccId: null, partner: null,       dept: 'L&D'          },
  { id: 103, name: 'Thandi Mbatha',     role: 'pcc',          pccId: null, partner: null,       dept: 'L&D'          },
  { id: 200, name: 'Charmaine Sekwena', role: 'ld_admin',     pccId: null, partner: null,       dept: 'L&D'          },
  { id: 300, name: 'Mark Mallabo',      role: 'partner_lead', pccId: null, partner: 'IBM',      dept: 'Partnerships' },
  { id: 400, name: 'Deon van Niekerk',  role: 'executive',    pccId: null, partner: null,       dept: 'Executive'    },
];

// ── Credential / Badge Definitions ───────────────────────────────────────
const CREDENTIALS = [
  { id: 'C001', name: 'IBM AI Fundamentals',            partner: 'IBM',       category: 'Technical',    profReq: false, mandatory: false },
  { id: 'C002', name: 'IBM Cloud Technical Advocate',   partner: 'IBM',       category: 'Technical',    profReq: true,  mandatory: true  },
  { id: 'C003', name: 'IBM Watson Sales Foundation',    partner: 'IBM',       category: 'Sales',        profReq: true,  mandatory: true  },
  { id: 'C004', name: 'IBM Consulting Practitioner',    partner: 'IBM',       category: 'Practitioner', profReq: true,  mandatory: false },
  { id: 'C005', name: 'IBM Partner Plus Gold Tech',     partner: 'IBM',       category: 'Technical',    profReq: true,  mandatory: true  },
  { id: 'C010', name: 'AWS Cloud Practitioner',         partner: 'AWS',       category: 'Technical',    profReq: false, mandatory: false },
  { id: 'C011', name: 'AWS Solutions Architect Assoc',  partner: 'AWS',       category: 'Technical',    profReq: true,  mandatory: true  },
  { id: 'C012', name: 'AWS Cloud Sales',                partner: 'AWS',       category: 'Sales',        profReq: true,  mandatory: true  },
  { id: 'C020', name: 'Jira Administrator',             partner: 'ATLASSIAN', category: 'Technical',    profReq: true,  mandatory: true  },
  { id: 'C021', name: 'Confluence Deployment',          partner: 'ATLASSIAN', category: 'Technical',    profReq: true,  mandatory: false },
  { id: 'C022', name: 'Atlassian Sales Badge',          partner: 'ATLASSIAN', category: 'Sales',        profReq: false, mandatory: false },
  { id: 'C030', name: 'Camunda Developer Certified',    partner: 'CAMUNDA',   category: 'Technical',    profReq: true,  mandatory: true  },
  { id: 'C031', name: 'Camunda Business Analyst',       partner: 'CAMUNDA',   category: 'Practitioner', profReq: true,  mandatory: false },
  { id: 'C040', name: 'Nintex Automation Expert',       partner: 'NINTEX',    category: 'Technical',    profReq: true,  mandatory: true  },
  { id: 'C041', name: 'Nintex Process Practitioner',    partner: 'NINTEX',    category: 'Practitioner', profReq: false, mandatory: false },
];

// ── Employee Credential Records ───────────────────────────────────────────
const EMP_CREDENTIALS = [
  { id: 'EC001', empId: 1,  credId: 'C001', status: 'active',   issued: '2024-03-01', expiry: '2026-03-01', source: 'IBM Learning'      },
  { id: 'EC002', empId: 1,  credId: 'C002', status: 'active',   issued: '2024-06-15', expiry: '2025-08-15', source: 'IBM Partner Plus'  },
  { id: 'EC003', empId: 1,  credId: 'C003', status: 'expired',  issued: '2023-01-10', expiry: '2025-01-10', source: 'IBM Learning'      },
  { id: 'EC004', empId: 1,  credId: 'C005', status: 'active',   issued: '2025-01-20', expiry: '2027-01-20', source: 'IBM Partner Plus'  },
  { id: 'EC005', empId: 2,  credId: 'C001', status: 'active',   issued: '2024-09-01', expiry: '2026-09-01', source: 'IBM Learning'      },
  { id: 'EC006', empId: 2,  credId: 'C004', status: 'active',   issued: '2025-02-01', expiry: '2027-02-01', source: 'IBM Learning'      },
  { id: 'EC007', empId: 3,  credId: 'C010', status: 'active',   issued: '2024-04-01', expiry: '2027-04-01', source: 'AWS'               },
  { id: 'EC008', empId: 3,  credId: 'C011', status: 'expiring', issued: '2023-09-01', expiry: '2025-09-15', source: 'AWS'               },
  { id: 'EC009', empId: 3,  credId: 'C012', status: 'active',   issued: '2025-01-01', expiry: '2028-01-01', source: 'AWS'               },
  { id: 'EC010', empId: 4,  credId: 'C020', status: 'active',   issued: '2024-07-01', expiry: '2026-07-01', source: 'Atlassian'         },
  { id: 'EC011', empId: 4,  credId: 'C021', status: 'active',   issued: '2024-11-01', expiry: '2026-11-01', source: 'Atlassian'         },
  { id: 'EC012', empId: 5,  credId: 'C020', status: 'expiring', issued: '2023-08-01', expiry: '2025-08-30', source: 'Atlassian'         },
  { id: 'EC013', empId: 5,  credId: 'C022', status: 'active',   issued: '2024-12-01', expiry: '2027-12-01', source: 'Atlassian'         },
  { id: 'EC014', empId: 6,  credId: 'C030', status: 'active',   issued: '2025-03-01', expiry: '2027-03-01', source: 'Camunda'           },
  { id: 'EC015', empId: 7,  credId: 'C040', status: 'active',   issued: '2025-04-01', expiry: '2027-04-01', source: 'Nintex'            },
  { id: 'EC016', empId: 7,  credId: 'C041', status: 'active',   issued: '2024-10-01', expiry: '2026-10-01', source: 'Nintex'            },
  { id: 'EC017', empId: 8,  credId: 'C002', status: 'expired',  issued: '2023-02-01', expiry: '2025-02-01', source: 'IBM Partner Plus'  },
  { id: 'EC018', empId: 8,  credId: 'C003', status: 'active',   issued: '2025-01-01', expiry: '2027-01-01', source: 'IBM Learning'      },
  { id: 'EC019', empId: 9,  credId: 'C010', status: 'active',   issued: '2025-02-01', expiry: '2028-02-01', source: 'AWS'               },
  { id: 'EC020', empId: 9,  credId: 'C011', status: 'active',   issued: '2025-05-01', expiry: '2028-05-01', source: 'AWS'               },
  { id: 'EC021', empId: 10, credId: 'C003', status: 'active',   issued: '2025-03-01', expiry: '2027-03-01', source: 'IBM Learning'      },
  { id: 'EC022', empId: 10, credId: 'C005', status: 'expiring', issued: '2023-07-01', expiry: '2025-08-01', source: 'IBM Partner Plus'  },
  { id: 'EC023', empId: 11, credId: 'C010', status: 'active',   issued: '2024-06-01', expiry: '2027-06-01', source: 'AWS'               },
  { id: 'EC024', empId: 12, credId: 'C030', status: 'active',   issued: '2025-06-01', expiry: '2027-06-01', source: 'Camunda'           },
  { id: 'EC025', empId: 12, credId: 'C031', status: 'active',   issued: '2025-06-15', expiry: '2027-06-15', source: 'Camunda'           },
];

// ── Courses / Training ────────────────────────────────────────────────────
const COURSES = [
  { id: 'TR001', name: 'IBM AI Essentials',              partner: 'IBM',       credId: 'C001', duration: '8h',  type: 'eLearning'  },
  { id: 'TR002', name: 'IBM Cloud Technical Bootcamp',   partner: 'IBM',       credId: 'C002', duration: '16h', type: 'Instructor' },
  { id: 'TR003', name: 'Watson Sales Enablement',        partner: 'IBM',       credId: 'C003', duration: '4h',  type: 'eLearning'  },
  { id: 'TR004', name: 'AWS CCP Prep',                   partner: 'AWS',       credId: 'C010', duration: '12h', type: 'eLearning'  },
  { id: 'TR005', name: 'AWS SAA-C03 Deep Dive',          partner: 'AWS',       credId: 'C011', duration: '40h', type: 'Instructor' },
  { id: 'TR006', name: 'Jira Admin Fundamentals',        partner: 'ATLASSIAN', credId: 'C020', duration: '6h',  type: 'eLearning'  },
  { id: 'TR007', name: 'Camunda Dev Certification Prep', partner: 'CAMUNDA',   credId: 'C030', duration: '20h', type: 'Instructor' },
  { id: 'TR008', name: 'Nintex Automation Masterclass',  partner: 'NINTEX',    credId: 'C040', duration: '14h', type: 'eLearning'  },
];

// ── Planned Training ──────────────────────────────────────────────────────
const PLANNED_TRAINING = [
  { id: 'PT001', empId: 2,  courseId: 'TR002', plannedDate: '2025-08-01', status: 'planned',     notes: 'Registered for August cohort'  },
  { id: 'PT002', empId: 2,  courseId: 'TR003', plannedDate: '2025-09-15', status: 'planned',     notes: ''                              },
  { id: 'PT003', empId: 8,  courseId: 'TR002', plannedDate: '2025-07-25', status: 'in_progress', notes: 'Renewal — expired cert'        },
  { id: 'PT004', empId: 11, courseId: 'TR005', plannedDate: '2025-08-10', status: 'planned',     notes: ''                              },
  { id: 'PT005', empId: 5,  courseId: 'TR006', plannedDate: '2025-07-20', status: 'in_progress', notes: 'Renewal before expiry'         },
  { id: 'PT006', empId: 10, courseId: 'TR002', plannedDate: '2025-09-01', status: 'planned',     notes: 'Upgrade to technical track'    },
];

// ── Employee Commitments ──────────────────────────────────────────────────
const COMMITMENTS = [
  { id: 'CM001', empId: 1,  credId: 'C003', targetDate: '2025-09-30', status: 'pending',     notes: 'Sales certification renewal' },
  { id: 'CM002', empId: 2,  credId: 'C002', targetDate: '2025-08-31', status: 'in_progress', notes: 'Technical advocate cert'     },
  { id: 'CM003', empId: 8,  credId: 'C002', targetDate: '2025-08-15', status: 'overdue',     notes: 'Renewal from expired'        },
  { id: 'CM004', empId: 11, credId: 'C011', targetDate: '2025-10-31', status: 'pending',     notes: 'SAA certification'           },
  { id: 'CM005', empId: 3,  credId: 'C011', targetDate: '2025-08-30', status: 'pending',     notes: 'Renewal before expiry'       },
];

// ── Partner Programme Requirements (mutable) ─────────────────────────────
let PARTNER_REQUIREMENTS = [
  { id: 'PR001', partner: 'IBM',       credId: 'C002', minCount: 3, currentCount: 2, notes: 'Cloud Technical Advocates required for Gold' },
  { id: 'PR002', partner: 'IBM',       credId: 'C003', minCount: 4, currentCount: 3, notes: 'Watson Sales required for Gold'               },
  { id: 'PR003', partner: 'IBM',       credId: 'C005', minCount: 2, currentCount: 2, notes: 'Partner Plus Gold Tech'                       },
  { id: 'PR004', partner: 'AWS',       credId: 'C011', minCount: 3, currentCount: 2, notes: 'SAA required for Select Tier'                 },
  { id: 'PR005', partner: 'AWS',       credId: 'C012', minCount: 2, currentCount: 1, notes: 'Cloud Sales badge'                            },
  { id: 'PR006', partner: 'ATLASSIAN', credId: 'C020', minCount: 2, currentCount: 2, notes: 'Jira Admin required'                          },
  { id: 'PR007', partner: 'CAMUNDA',   credId: 'C030', minCount: 2, currentCount: 2, notes: 'Developer Certified'                          },
  { id: 'PR008', partner: 'NINTEX',    credId: 'C040', minCount: 1, currentCount: 1, notes: 'Automation Expert'                            },
];

// ── Monthly Trend (Jan–Jul 2025) ──────────────────────────────────────────
const MONTHLY_TREND = [
  { month: 'Jan', IBM: 18, AWS: 12, ATLASSIAN: 8,  CAMUNDA: 5, NINTEX: 4 },
  { month: 'Feb', IBM: 19, AWS: 12, ATLASSIAN: 9,  CAMUNDA: 5, NINTEX: 4 },
  { month: 'Mar', IBM: 20, AWS: 13, ATLASSIAN: 9,  CAMUNDA: 6, NINTEX: 4 },
  { month: 'Apr', IBM: 21, AWS: 14, ATLASSIAN: 10, CAMUNDA: 6, NINTEX: 5 },
  { month: 'May', IBM: 22, AWS: 14, ATLASSIAN: 10, CAMUNDA: 7, NINTEX: 5 },
  { month: 'Jun', IBM: 23, AWS: 15, ATLASSIAN: 11, CAMUNDA: 8, NINTEX: 5 },
  { month: 'Jul', IBM: 24, AWS: 16, ATLASSIAN: 11, CAMUNDA: 9, NINTEX: 6 },
];

// ── Quarterly Targets ─────────────────────────────────────────────────────
const QUARTERLY_TARGETS = [
  { quarter: 'Q1 2025', partner: 'IBM',       target: 6, achieved: 6, type: 'Technical' },
  { quarter: 'Q1 2025', partner: 'AWS',       target: 4, achieved: 3, type: 'Technical' },
  { quarter: 'Q2 2025', partner: 'IBM',       target: 5, achieved: 4, type: 'Technical' },
  { quarter: 'Q2 2025', partner: 'AWS',       target: 4, achieved: 4, type: 'Technical' },
  { quarter: 'Q2 2025', partner: 'ATLASSIAN', target: 3, achieved: 2, type: 'Technical' },
  { quarter: 'Q3 2025', partner: 'IBM',       target: 5, achieved: 1, type: 'Technical' },
  { quarter: 'Q3 2025', partner: 'AWS',       target: 3, achieved: 0, type: 'Technical' },
  { quarter: 'Q3 2025', partner: 'CAMUNDA',   target: 2, achieved: 2, type: 'Technical' },
];

// ── Notifications ─────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 'N001', type: 'expiring',  empId: 3,  credId: 'C011', message: "Cleo Nkosi's AWS SAA expires in 62 days",                   severity: 'amber', date: '2025-07-15' },
  { id: 'N002', type: 'expiring',  empId: 5,  credId: 'C020', message: "Erica van Wyk's Jira Admin cert expires in 46 days",         severity: 'amber', date: '2025-07-15' },
  { id: 'N003', type: 'expiring',  empId: 10, credId: 'C005', message: "James Pretorius' IBM PP Gold Tech expires in 17 days",        severity: 'red',   date: '2025-07-15' },
  { id: 'N004', type: 'expiring',  empId: 1,  credId: 'C002', message: "Nhlanhla Masondo's IBM Cloud Advocate expires in 31 days",    severity: 'amber', date: '2025-07-15' },
  { id: 'N005', type: 'expired',   empId: 8,  credId: 'C002', message: "Hein Botha's IBM Cloud Tech Advocate has EXPIRED",            severity: 'red',   date: '2025-07-15' },
  { id: 'N006', type: 'expired',   empId: 1,  credId: 'C003', message: "Nhlanhla Masondo's Watson Sales Foundation has EXPIRED",      severity: 'red',   date: '2025-07-15' },
  { id: 'N007', type: 'gap',       empId: 11, credId: 'C011', message: "Karen Olivier is missing mandatory AWS SAA credential",       severity: 'red',   date: '2025-07-15' },
  { id: 'N008', type: 'commitment',empId: 8,  credId: 'C002', message: "Hein Botha — commitment CM003 is overdue",                    severity: 'red',   date: '2025-07-15' },
  { id: 'N009', type: 'gap',       partner: 'IBM', message: "IBM: Cloud Technical Advocate count (2/3) below requirement",           severity: 'amber', date: '2025-07-15' },
  { id: 'N010', type: 'gap',       partner: 'AWS', message: "AWS: Solutions Architect count (2/3) below requirement",                severity: 'amber', date: '2025-07-15' },
];
