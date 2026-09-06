export type LocaleCode = "en" | "es" | "fr" | "de" | "ja" | "zh" | "vi";

export const locales: { code: LocaleCode; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "ja", label: "日本語", short: "JA" },
  { code: "zh", label: "中文", short: "ZH" },
  { code: "vi", label: "Tiếng Việt", short: "VI" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";

interface Feature {
  title: string;
  desc: string;
}
interface Step {
  title: string;
  desc: string;
}
interface Plan {
  tagline: string;
  features: string[];
}
interface Trust {
  title: string;
  desc: string;
}
/** One row of the Excel/Airtable/Mochi table. The yes/no *icons* stay in
 *  MascotIntro (they are presentation); only the prose lives here. A cell left
 *  as "" falls back to the localized `compare.yes` / `compare.no` word. */
interface CompareRow {
  feature: string;
  excel: string;
  airtable: string;
  mochi: string;
}
export interface Messages {
  scripts: any;
  db: any;
  nav: {
    product: string;
    pricing: string;
    docs: string;
    changelog: string;
    community: string;
    howItWorks: string;
    features: string;
    templates: string;
    repo: string;
    repoHome: string;
    discussions: string;
    mcp: string;
    about: string;
    star: string;
    login: string;
    menu: string;
    openMenu: string;
  };
  hero: {
    headline: string;
    sub: string;
    badge: string;
    download: string;
    ctaPrimary: string;
    ctaSecondary: string;
    copyLabel: string;
    trust: Trust[];
  };
  /** The hero demo: Claude driving the workspace table. Three turns, looped. */
  heroDemo: {
    agent: string;
    placeholder: string;
    /** shown in the grid before the first turn seeds it */
    empty: string;
    turns: { ask: string; reply: string }[];
  };
  eyebrow: {
    flow: string;
    feat: string;
    views: string;
    tpl: string;
    char: string;
    compare: string;
    price: string;
    step: string;
    git: string;
    audit: string;
  };
  feat: { title: string; sub: string; items: Feature[]; demo: { ask: string; reply: string }[] };
  /** the control block: one headline plus the two captions under its canvas */
  audit: Feature & { points: [string, string] };
  git: { title: string; sub: string; items: Feature[]; agentLabel: string; syncedCaption: string };
  flow: { title: string; sub: string; steps: Step[] };
  views: { title: string; sub: string; shots: string[] };
  tpl: { title: string; sub: string; items: string[]; viewAll: string };
  char: { title: string; sub: string };
  compare: { yes: string; no: string; rows: CompareRow[] };
  price: {
    title: string;
    sub: string;
    free: string;
    perMonth: string;
    perYear: string;
    cta: string;
    soon: string;
    note: string;
    plans: Plan[];
  };
  cta: { title: string; sub: string; button: string };
  footer: {
    tagline: string;
    product: string;
    developer: string;
    company: string;
    copyright: string;
    status: string;
  };
  waitlist: {
    title: string;
    sub: string;
    emailLabel: string;
    placeholder: string;
    button: string;
    sending: string;
    success: string;
    error: string;
    invalid: string;
  };
  success: { title: string; sub: string; order: string; cta: string; back: string; note: string };
}

const en: Messages = {
  nav: {
    product: "Product",
    pricing: "Pricing",
    docs: "Docs",
    changelog: "Changelog",
    community: "Community",
    howItWorks: "How it works",
    features: "Features",
    templates: "Templates",
    repo: "GitHub repo",
    repoHome: "GitHub Home",
    discussions: "Discussions",
    mcp: "MCP integration",
    about: "About Mochi",
    star: "Star on GitHub",
    login: "Log in",
    menu: "Menu",
    openMenu: "Open menu",
  },
  eyebrow: {
    flow: "How it works",
    feat: "Working together",
    views: "Views",
    tpl: "Templates",
    char: "Why Mochi",
    compare: "Compared with Excel + Copilot and Airtable",
    price: "Pricing",
    step: "Step",
    git: "History",
    audit: "Control",
  },
  views: {
    title: "One set of data, every way your team likes to see it",
    sub: "Grid, board, calendar, gallery, chart. They all read the same rows, so switching never copies anything.",
    shots: ["Leads by status", "Orders by order date", "Products as cards", "Tasks by priority", "Leads by source"],
  },
  compare: {
    yes: "Yes",
    no: "No",
    rows: [
      { feature: "AI agents read & write your data natively", excel: "Suggests formulas only", airtable: "", mochi: "" },
      { feature: "Where your data lives", excel: "Local file, no sync", airtable: "Their cloud, always", mochi: "Your laptop or the cloud, your call" },
      { feature: "Runs without a server or account", excel: "Copilot needs a Microsoft account", airtable: "", mochi: "" },
      { feature: "Every write is versioned, traceable & reversible", excel: "Undo history only", airtable: "Paid tiers only", mochi: "" },
      { feature: "Real-time collab for teammates and agents", excel: "Needs Microsoft 365", airtable: "", mochi: "" },
      { feature: "Pricing", excel: "Per seat + Copilot add-on", airtable: "Per seat, monthly", mochi: "$19 once, forever" },
    ],
  },

    scripts: {
      "chat": [
            {
                  who: "you",
                  text: "add customer Mike, phone 0901234567, 435 Broadway NY to CRM. source twitter, bought shirt."
            },
            {
                  who: "mochi",
                  text: "created profile for Mike #M-105 ✓"
            },
            {
                  who: "you",
                  text: "list today's orders"
            },
            {
                  who: "mochi",
                  text: "2 new orders today 🍡:\n+-----+-------+---------+----------+\n| OID | CUST  | ITEM    | STATUS   |\n+-----+-------+---------+----------+\n| 105 | Mike  | Shirt   | New      |\n| 092 | Sarah | Dress   | Packing  |\n+-----+-------+---------+----------+"
            },
            {
                  who: "you",
                  text: "find Sarah's order"
            },
            {
                  who: "mochi",
                  text: "order #S-092 for Sarah: dress, COD, packing 📦"
            },
            {
                  who: "you",
                  text: "cancel order #S-092, customer changed mind"
            },
            {
                  who: "mochi",
                  text: "cancelled #S-092 and restored inventory ✓"
            }
      ],
      "template": [
            {
                  who: "you",
                  text: "create CRM database with customers and orders"
            },
            {
                  who: "mochi",
                  text: "Initialized 2 data tables:\n\n[CUSTOMERS]\n+----+-------+------------+\n| ID | NAME  | PHONE      |\n+----+-------+------------+\n| 01 | Mike  | 0901234567 |\n| 02 | Sarah | 0987654321 |\n+----+-------+------------+\n\n[ORDERS]\n+-----+-------+---------+----------+\n| OID | C_ID  | ITEM    | STATUS   |\n+-----+-------+---------+----------+\n| 101 | 01    | Shirt   | Shipped  |\n| 102 | 02    | Dress   | Packing  |\n+-----+-------+---------+----------+"
            },
            {
                  who: "you",
                  text: "add a new table PRODUCTS with id, name, and stock"
            },
            {
                  who: "mochi",
                  text: "Created table [PRODUCTS] ✓\n+----+------+-------+\n| ID | NAME | STOCK |\n+----+------+-------+"
            },
            {
                  who: "you",
                  text: "rename ITEM to PRODUCT in ORDERS table"
            },
            {
                  who: "mochi",
                  text: "Renamed column ITEM → PRODUCT in [ORDERS] ✓"
            },
            {
                  who: "you",
                  text: "delete the PRODUCTS table"
            },
            {
                  who: "mochi",
                  text: "Dropped table [PRODUCTS] 🗑️"
            },
            {
                  who: "you",
                  text: "now spin up an HRM template instead"
            },
            {
                  who: "mochi",
                  text: "Initialized HRM database:\n\n[EMPLOYEES]\n+----+-------+---------+\n| ID | NAME  | ROLE    |\n+----+-------+---------+\n| 01 | Alice | Dev     |\n| 02 | Bob   | HR      |\n+----+-------+---------+\n\n[DEPARTMENTS]\n+------+-----------+\n| D_ID | NAME      |\n+------+-----------+\n| D-01 | Eng       |\n| D-02 | People    |\n+------+-----------+"
            }
      ],
      "branchA": [
            {
                  who: "you",
                  text: "checkout branch feature/add-mike"
            },
            {
                  who: "mochi",
                  text: "✓ switched to feature/add-mike"
            },
            {
                  who: "you",
                  text: "add Mike, twitter 0912345678, NY, source twitter"
            },
            {
                  who: "mochi",
                  text: "created profile #M-201: Mike · 0912345678 · NY ✓"
            },
            {
                  who: "you",
                  text: "commit this change"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Mike\n  + id: \"M-201\"\n  + phone: \"0912345678\"\n  + source: \"twitter\"",
                  process: true,
                  id: "commit-A"
            },
            {
                  who: "you",
                  text: "push to remote"
            },
            {
                  who: "mochi",
                  text: "pushed feature/add-mike → origin 🚀",
                  id: "push-A"
            }
      ],
      "branchB": [
            {
                  who: "you",
                  text: "checkout branch feature/add-sarah"
            },
            {
                  who: "mochi",
                  text: "✓ switched to feature/add-sarah"
            },
            {
                  who: "you",
                  text: "add Sarah, fb 0978654321, SF, source facebook"
            },
            {
                  who: "mochi",
                  text: "created profile #S-088: Sarah · 0978654321 · SF ✓"
            },
            {
                  who: "you",
                  text: "commit this change"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Sarah\n  + id: \"S-088\"\n  + phone: \"0978654321\"\n  + source: \"facebook\"",
                  process: true,
                  id: "commit-B"
            },
            {
                  who: "you",
                  text: "revert previous commit"
            },
            {
                  who: "mochi",
                  text: "reverted commit and restored data 🔙",
                  id: "revert-B"
            }
      ]
},
    db: {
      "userA": "USER A · SALES",
      "userB": "USER B · MARKETING",
      "branchAName": "feature/add-mike",
      "branchBName": "feature/add-sarah",
      "title": "REALTIME DB",
      "live": "LIVE",
      "watching": "▸ customers · watching branches…",
      "statusStaged": "staged…",
      "statusPushed": "pushed↑",
      "statusReverted": "reverted",
      "statusMerged": "main ✓ ",
      "legendStaged": "staged…  → committed, not pushed",
      "legendPushed": "pushed↑  → synced to remote",
      "legendReverted": "reverted → changes undone",
      "eventsTitle": "▸ git events",
      "eventsEmpty": "waiting for commits...",
      "dataA": {
            "id": "M-201",
            "name": "Mike",
            "phone": "0912345678",
            "source": "twitter",
            "msgC": "commit: feat(crm): add Mike",
            "msgP": "push to origin"
      },
      "dataB": {
            "id": "S-088",
            "name": "Sarah",
            "phone": "0978654321",
            "source": "facebook",
            "msgC": "commit: feat(crm): add Sarah",
            "msgR": "revert previous commit"
      }
},
  hero: {
    headline: "One place for all your work. No servers, no monthly bill.",
    sub: "Build a customer list, a hiring tracker, anything your team needs. It all lives on your own computer.",
    badge: "Local-first · agent-native",
    download: "Download Mochi",
    ctaPrimary: "Get started",
    ctaSecondary: "See how it works",
    copyLabel: "Copy install command",
    trust: [
      { title: "Nothing to run", desc: "It sits on your computer like any other app." },
      { title: "Works offline", desc: "Your edits reach the team the moment you are back online." },
      { title: "Yours alone", desc: "Nothing leaves your machine unless you ask it to." },
    ],
  },
  heroDemo: {
    agent: "Claude",
    placeholder: "ask Claude to change the table…",
    empty: "Empty workspace",
    turns: [
      {
        ask: "seed a CRM database with customers, orders and products",
        reply: "Created 8 collections with sample data.",
      },
      {
        ask: "generate a cover image for every product",
        reply: "Added 12 product images.",
      },
      {
        ask: "which products are under 10 in stock?",
        reply: "5 of them, now filtered in this view.",
      },
    ],
  },
  feat: {
    title: "A workspace your team and your AI both work in",
    sub: "As easy as a spreadsheet, as capable as a database, and your AI can read and write every row.",
    items: [
      { title: "Just ask, in plain words", desc: "Claude, Codex and OpenCode can look things up and make changes for you. Every change is written down, so you can always undo it." },
      { title: "No formulas, no setup", desc: "Start from a workspace that already works, or describe what you need in one sentence and let Mochi build it." },
    ],
    demo: [
      { ask: "open the customers table", reply: "Opened Customers, 6 rows." },
      { ask: "show only the active ones", reply: "Filtered to 7 active." },
    ],
  },
  audit: { title: "You can see everything your AI did", desc: "Every edit is listed field by field, and you build a filter by clicking, not by explaining.", points: ["Every AI edit, written down", "Build a filter by clicking"] },
  git: {
    title: "Every change is kept, so nothing is ever lost",
    sub: "See who changed what and when. Put anything back the way it was, even a week later.",
    items: [
      { title: "Your work, always backed up", desc: "Every save updates the copy on your machine and the shared one together. There is no separate step to remember." },
      { title: "Two people, one table", desc: "Work at the same time without stepping on each other. Mochi keeps both sides in step." },
    ],
    agentLabel: "Mochi agent",
    syncedCaption: "synced automatically, zero config",
  },
  flow: {
    title: "Three steps to your team's workspace",
    sub: "Get started in minutes. No servers, no complex setup.",
    steps: [
      { title: "Install Mochi", desc: "One command. Free to start. Works on Mac, Linux, and Windows." },
      { title: "Pick a template", desc: "Start from CRM, HR, Inventory, Projects, or a blank canvas." },
      { title: "Start working with your data", desc: "Talk to your agent. Mochi reads, writes, and organizes it for you." },
    ],
  },
  tpl: {
    viewAll: "View all →",
    title: "Start from something that already works",
    sub: "Sales, hiring, stock or projects. Each one arrives with sample data, and you can change any of it in plain words.",
    items: [
      "Centralize customer interactions to close more deals",
      "Manage people, roles, and attendance in one workspace",
      "Track stock, warehouses, and in/out flow in real time",
      "Coordinate tasks and ship on time without pinging",
    ],
  },
  char: {
    title: "Meet Mochi",
    sub: "Mochi is a local-first, AI-native data assistant. It simplifies, secures, and tracks data operations between your team and AI agents, eliminating the hassle of tacked-on AI in spreadsheets or monthly cloud storage fees.",
  },
  price: {
    title: "Free while it is just you",
    sub: "Everything on this page works without paying. Pro is for when other people need to be in there with you.",
    free: "Free",
    perMonth: "per month",
    perYear: "per year",
    cta: "Get Pro",
    soon: "Coming soon",
    note: "Billed through Polar. Cancel whenever you like, and your data stays on your machine either way.",
    plans: [
      { tagline: "For one person", features: ["Everything runs on your own machine", "As many workspaces and tables as you like", "Full history, and undo that goes back", "Connect Claude, Codex or OpenCode"] },
      { tagline: "For a team", features: ["Everything in Free", "Seats for the rest of your team", "Shared workspaces that stay in step", "Email support"] },
    ],
  },
  cta: { title: "Ready to get your data in order?", sub: "Download Mochi and start in about a minute. Nothing to set up, nothing to sign up for.", button: "Get started →" },
  footer: {
    tagline: "One place for your team's data. It stays on your machines, and your AI can use it.",
    product: "Product",
    developer: "Developer",
    company: "Company",
    copyright: "Data workspace for teams and agents.",
    status: "All systems operational",
  },
  waitlist: {
    title: "Free plan, coming soon",
    sub: "We'll email you the day it opens. Nothing else.",
    emailLabel: "Email",
    placeholder: "you@company.com",
    button: "Notify me",
    sending: "Sending…",
    success: "You're on the list.",
    error: "Something went wrong. Please try again.",
    invalid: "Enter a valid email address.",
  },
  success: {
    title: "You're all set!",
    sub: "Your Pro license is on its way to your inbox. Install Mochi and start building your workspace.",
    order: "Order reference:",
    cta: "View on GitHub",
    back: "Back to home",
    note: "Didn't get the email? Check spam, or reach out on GitHub.",
  },
};

const es: Messages = {
  nav: {
    product: "Producto",
    pricing: "Precios",
    docs: "Documentación",
    changelog: "Novedades",
    community: "Comunidad",
    howItWorks: "Cómo funciona",
    features: "Funciones",
    templates: "Plantillas",
    repo: "Repositorio en GitHub",
    repoHome: "GitHub Home",
    discussions: "Debates",
    mcp: "Integración MCP",
    about: "Sobre Mochi",
    star: "Marcar en GitHub",
    login: "Iniciar sesión",
    menu: "Menú",
    openMenu: "Abrir menú",
  },
  eyebrow: {
    flow: "Cómo funciona",
    feat: "Trabajar juntos",
    views: "Vistas",
    tpl: "Plantillas",
    char: "Por qué Mochi",
    compare: "Frente a Excel + Copilot y Airtable",
    price: "Precios",
    step: "Paso",
    git: "Historial",
    audit: "Control",
  },
  views: {
    title: "Unos mismos datos, cada forma en que tu equipo quiere verlos",
    sub: "Cuadrícula, tablero, calendario, galería, gráfico. Todos leen las mismas filas, así que cambiar de vista no copia nada.",
    shots: ["Leads por estado", "Pedidos por fecha", "Productos en fichas", "Tareas por prioridad", "Leads por origen"],
  },
  compare: {
    yes: "Sí",
    no: "No",
    rows: [
      { feature: "Los agentes de IA leen y escriben tus datos de forma nativa", excel: "Solo sugiere fórmulas", airtable: "", mochi: "" },
      { feature: "Dónde viven tus datos", excel: "Archivo local, sin sincronizar", airtable: "Su nube, siempre", mochi: "Tu portátil o la nube: tú decides" },
      { feature: "Funciona sin servidor ni cuenta", excel: "Copilot exige una cuenta de Microsoft", airtable: "", mochi: "" },
      { feature: "Cada escritura queda versionada, trazable y reversible", excel: "Solo historial de deshacer", airtable: "Solo en planes de pago", mochi: "" },
      { feature: "Colaboración en tiempo real: equipo y agentes", excel: "Requiere Microsoft 365", airtable: "", mochi: "" },
      { feature: "Precio", excel: "Por usuario + complemento Copilot", airtable: "Por usuario, mensual", mochi: "19 $ una vez, para siempre" },
    ],
  },

    scripts: {
      "chat": [
            {
                  who: "you",
                  text: "agregar cliente Carlos, tel 0901234567, Madrid al CRM. origen WhatsApp, compró camisa."
            },
            {
                  who: "mochi",
                  text: "perfil creado para Carlos #C-105 ✓"
            },
            {
                  who: "you",
                  text: "listar los pedidos de hoy"
            },
            {
                  who: "mochi",
                  text: "2 nuevos pedidos hoy 🍡:\n+-----+--------+---------+----------+\n| OID | CLIENTE| ARTÍCULO| ESTADO   |\n+-----+--------+---------+----------+\n| 105 | Carlos | Camisa  | Nuevo    |\n| 092 | Sofia  | Vestido | Empacan. |\n+-----+--------+---------+----------+"
            },
            {
                  who: "you",
                  text: "buscar pedido de Sofia"
            },
            {
                  who: "mochi",
                  text: "pedido #S-092 para Sofia: vestido, pago contra entrega, empacando 📦"
            },
            {
                  who: "you",
                  text: "cancelar pedido #S-092, el cliente cambió de opinión"
            },
            {
                  who: "mochi",
                  text: "cancelado #S-092 e inventario restaurado ✓"
            }
      ],
      "template": [
            {
                  who: "you",
                  text: "crear base de datos CRM con clientes y pedidos"
            },
            {
                  who: "mochi",
                  text: "Inicializadas 2 tablas de datos:\n\n[CUSTOMERS]\n+----+--------+------------+\n| ID | NOMBRE | TELÉFONO   |\n+----+--------+------------+\n| 01 | Carlos | 0901234567 |\n| 02 | Sofia  | 0987654321 |\n+----+--------+------------+\n\n[ORDERS]\n+-----+--------+---------+----------+\n| OID | C_ID   | ARTÍCULO| ESTADO   |\n+-----+--------+---------+----------+\n| 101 | 01     | Camisa  | Enviado  |\n| 102 | 02     | Vestido | Empacan. |\n+-----+--------+---------+----------+"
            }
      ],
      "branchA": [
            {
                  who: "you",
                  text: "checkout branch feature/add-carlos"
            },
            {
                  who: "mochi",
                  text: "✓ cambiado a feature/add-carlos"
            },
            {
                  who: "you",
                  text: "agregar Carlos, WhatsApp 0912345678, Madrid, origen WhatsApp"
            },
            {
                  who: "mochi",
                  text: "perfil creado #C-201: Carlos · 0912345678 · Madrid ✓"
            },
            {
                  who: "you",
                  text: "commit de este cambio"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Carlos\n  + id: \"C-201\"\n  + phone: \"0912345678\"\n  + source: \"WhatsApp\"",
                  process: true,
                  id: "commit-A"
            },
            {
                  who: "you",
                  text: "push a remoto"
            },
            {
                  who: "mochi",
                  text: "pushed feature/add-carlos → origin 🚀",
                  id: "push-A"
            }
      ],
      "branchB": [
            {
                  who: "you",
                  text: "checkout branch feature/add-sofia"
            },
            {
                  who: "mochi",
                  text: "✓ cambiado a feature/add-sofia"
            },
            {
                  who: "you",
                  text: "agregar Sofia, fb 0978654321, Barcelona, origen facebook"
            },
            {
                  who: "mochi",
                  text: "perfil creado #S-088: Sofia · 0978654321 · Barcelona ✓"
            },
            {
                  who: "you",
                  text: "commit de este cambio"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Sofia\n  + id: \"S-088\"\n  + phone: \"0978654321\"\n  + source: \"facebook\"",
                  process: true,
                  id: "commit-B"
            },
            {
                  who: "you",
                  text: "revertir commit anterior"
            },
            {
                  who: "mochi",
                  text: "commit revertido y datos restaurados 🔙",
                  id: "revert-B"
            }
      ]
},
    db: {
      "userA": "USER A · VENTAS",
      "userB": "USER B · MARKETING",
      "branchAName": "feature/add-carlos",
      "branchBName": "feature/add-sofia",
      "title": "DB EN TIEMPO REAL",
      "live": "VIVO",
      "watching": "▸ clientes · observando ramas…",
      "statusStaged": "staged…",
      "statusPushed": "pushed↑",
      "statusReverted": "reverted",
      "statusMerged": "main ✓ ",
      "legendStaged": "staged…  → commit, no push",
      "legendPushed": "pushed↑  → sincronizado a remoto",
      "legendReverted": "reverted → cambios deshechos",
      "eventsTitle": "▸ eventos git",
      "eventsEmpty": "esperando commits...",
      "dataA": {
            "id": "C-201",
            "name": "Carlos",
            "phone": "0912345678",
            "source": "whatsapp",
            "msgC": "commit: feat(crm): add Carlos",
            "msgP": "push to origin"
      },
      "dataB": {
            "id": "S-088",
            "name": "Sofia",
            "phone": "0978654321",
            "source": "facebook",
            "msgC": "commit: feat(crm): add Sofia",
            "msgR": "revert previous commit"
      }
},
  hero: {
    headline: "Un solo lugar para todo tu trabajo. Sin servidores, sin cuota mensual.",
    sub: "Crea una lista de clientes, un seguimiento de contrataciones, lo que tu equipo necesite. Todo vive en tu propio ordenador.",
    badge: "Local-first · nativo para IA",
    download: "Descargar Mochi",
    ctaPrimary: "Empezar",
    ctaSecondary: "Ver cómo funciona",
    copyLabel: "Copiar comando de instalación",
    trust: [
      { title: "Nada que montar", desc: "Está en tu ordenador como cualquier otra aplicación." },
      { title: "Funciona sin conexión", desc: "Tus cambios llegan al equipo en cuanto vuelves a tener red." },
      { title: "Solo tuyo", desc: "Nada sale de tu máquina si tú no lo pides." },
    ],
  },
  heroDemo: {
    agent: "Claude",
    placeholder: "pide a Claude que cambie la tabla…",
    empty: "Espacio vacío",
    turns: [
      {
        ask: "crea una base de datos CRM con clientes, pedidos y productos",
        reply: "Creadas 8 colecciones con datos de ejemplo.",
      },
      {
        ask: "genera una imagen de portada para cada producto",
        reply: "Añadidas 12 imágenes de producto.",
      },
      {
        ask: "¿qué productos tienen menos de 10 en stock?",
        reply: "5, ya filtrados en esta vista.",
      },
    ],
  },
  feat: {
    title: "Un espacio en el que trabajáis tu equipo y tu IA",
    sub: "Tan fácil como una hoja de cálculo, tan capaz como una base de datos, y tu IA lee y escribe cada fila.",
    items: [
      { title: "Pídelo con palabras normales", desc: "Claude, Codex y OpenCode pueden consultar y cambiar cosas por ti. Todo queda anotado, así que siempre puedes deshacerlo." },
      { title: "Sin fórmulas, sin configuración", desc: "Empieza con un espacio que ya funciona, o describe en una frase lo que necesitas y deja que Mochi lo cree." },
    ],
    demo: [
      { ask: "abre la tabla de clientes", reply: "Customers abierta, 6 filas." },
      { ask: "muestra solo los activos", reply: "Filtrado a 7 activos." },
    ],
  },
  audit: { title: "Puedes ver todo lo que hizo tu IA", desc: "Cada edición aparece campo por campo, y los filtros se crean haciendo clic, no explicando.", points: ["Cada edición de la IA, anotada", "Crea un filtro haciendo clic"] },
  git: {
    title: "Cada cambio se guarda, así nunca se pierde nada",
    sub: "Mira quién cambió qué y cuándo. Deja cualquier cosa como estaba, incluso una semana después.",
    items: [
      { title: "Tu trabajo, siempre a salvo", desc: "Cada guardado actualiza a la vez la copia de tu máquina y la compartida. No hay un paso aparte que recordar." },
      { title: "Dos personas, una tabla", desc: "Trabajad a la vez sin pisaros. Mochi mantiene los dos lados al día." },
    ],
    agentLabel: "Agente Mochi",
    syncedCaption: "sincronizado automáticamente, sin configuración",
  },
  flow: {
    title: "Tres pasos hacia un espacio nativo para agentes",
    sub: "Empieza en minutos. Sin servidores, sin configuración complicada.",
    steps: [
      { title: "Inicializa un espacio de trabajo", desc: "Elige una plantilla lista. Mochi crea el esquema, las relaciones y los datos de ejemplo en segundos." },
      { title: "Chatea con tu agente", desc: "Claude, Codex u OpenCode operan los datos con herramientas tipadas, sin escribir SQL." },
      { title: "Sube a Git", desc: "Exporta un paquete de texto fácil de revisar y comparar. Una rama por espacio de trabajo." },
    ],
  },
  tpl: {
    viewAll: "Ver todas →",
    title: "Empieza con algo que ya funciona",
    sub: "Ventas, personas, inventario o proyectos. Cada uno llega con datos de ejemplo y lo cambias todo con palabras normales.",
    items: [
      "Centraliza las interacciones con clientes para cerrar más ventas",
      "Gestiona personas, roles y asistencia en un solo espacio",
      "Controla stock, almacenes y entradas/salidas en tiempo real",
      "Coordina tareas y entrega a tiempo sin perseguir a nadie",
    ],
  },
  char: {
    title: "Conoce a Mochi",
    sub: "Un pequeño compañero redondo y siempre listo, entre tus agentes de IA y tu base de datos. Mochi nunca decide por ti; solo hace que cada operación de datos sea simple, segura y fácil de seguir.",
  },
  price: {
    title: "Gratis mientras seas tú solo",
    sub: "Todo lo de esta página funciona sin pagar. Pro es para cuando otras personas tienen que estar dentro contigo.",
    free: "Gratis",
    perMonth: "al mes",
    perYear: "al año",
    cta: "Pasar a Pro",
    soon: "Muy pronto",
    note: "Se cobra a través de Polar. Cancela cuando quieras: tus datos se quedan en tu máquina de todas formas.",
    plans: [
      { tagline: "Para una persona", features: ["Todo funciona en tu propio ordenador", "Tantos espacios y tablas como quieras", "Historial completo, y deshacer que llega lejos", "Conecta Claude, Codex u OpenCode"] },
      { tagline: "Para un equipo", features: ["Todo lo de Gratis", "Plazas para el resto del equipo", "Espacios compartidos que van al día", "Soporte por correo"] },
    ],
  },
  cta: { title: "¿Listo para ordenar tus datos?", sub: "Descarga Mochi y empieza en un minuto. Nada que configurar, nada que registrar.", button: "Empezar →" },
  footer: {
    tagline: "Un lugar para los datos de tu equipo. Se quedan en vuestras máquinas y tu IA los usa.",
    product: "Producto",
    developer: "Desarrollo",
    company: "Empresa",
    copyright: "Espacio de datos para equipos y agentes.",
    status: "Todos los sistemas operativos",
  },
  waitlist: {
    title: "Plan gratuito, próximamente",
    sub: "Te escribiremos el día que se abra. Nada más.",
    emailLabel: "Correo electrónico",
    placeholder: "tu@empresa.com",
    button: "Avisarme",
    sending: "Enviando…",
    success: "Ya estás en la lista.",
    error: "Algo salió mal. Inténtalo de nuevo.",
    invalid: "Introduce un correo electrónico válido.",
  },
  success: {
    title: "¡Todo listo!",
    sub: "Tu licencia Pro va de camino a tu correo. Instala Mochi y empieza a construir tu espacio de trabajo.",
    order: "Referencia del pedido:",
    cta: "Ver en GitHub",
    back: "Volver al inicio",
    note: "¿No recibiste el correo? Revisa spam o contáctanos en GitHub.",
  },
};

const fr: Messages = {
  nav: {
    product: "Produit",
    pricing: "Tarifs",
    docs: "Documentation",
    changelog: "Nouveautés",
    community: "Communauté",
    howItWorks: "Comment ça marche",
    features: "Fonctionnalités",
    templates: "Modèles",
    repo: "Dépôt GitHub",
    repoHome: "GitHub Home",
    discussions: "Discussions",
    mcp: "Intégration MCP",
    about: "À propos de Mochi",
    star: "Star sur GitHub",
    login: "Se connecter",
    menu: "Menu",
    openMenu: "Ouvrir le menu",
  },
  eyebrow: {
    flow: "Comment ça marche",
    feat: "Travailler ensemble",
    views: "Vues",
    tpl: "Modèles",
    char: "Pourquoi Mochi",
    compare: "Face à Excel + Copilot et Airtable",
    price: "Tarifs",
    step: "Étape",
    git: "Historique",
    audit: "Contrôle",
  },
  views: {
    title: "Les mêmes données, dans toutes les vues que votre équipe aime",
    sub: "Tableau, colonnes, calendrier, galerie, graphique. Tous lisent les mêmes lignes, changer de vue ne copie rien.",
    shots: ["Leads par statut", "Commandes par date", "Produits en fiches", "Tâches par priorité", "Leads par source"],
  },
  compare: {
    yes: "Oui",
    no: "Non",
    rows: [
      { feature: "Les agents IA lisent et écrivent vos données nativement", excel: "Suggère seulement des formules", airtable: "", mochi: "" },
      { feature: "Où vivent vos données", excel: "Fichier local, sans synchro", airtable: "Leur cloud, toujours", mochi: "Votre ordinateur ou le cloud : à vous de choisir" },
      { feature: "Fonctionne sans serveur ni compte", excel: "Copilot exige un compte Microsoft", airtable: "", mochi: "" },
      { feature: "Chaque écriture est versionnée, traçable et réversible", excel: "Historique d'annulation seulement", airtable: "Offres payantes uniquement", mochi: "" },
      { feature: "Collaboration en temps réel : équipe et agents", excel: "Nécessite Microsoft 365", airtable: "", mochi: "" },
      { feature: "Tarif", excel: "Par siège + option Copilot", airtable: "Par siège, mensuel", mochi: "19 $ une fois, pour toujours" },
    ],
  },

    scripts: {
      "chat": [
            {
                  who: "you",
                  text: "ajouter client Jean, tél 0901234567, Paris au CRM. source twitter, a acheté chemise."
            },
            {
                  who: "mochi",
                  text: "profil créé pour Jean #J-105 ✓"
            },
            {
                  who: "you",
                  text: "liste des commandes d'aujourd'hui"
            },
            {
                  who: "mochi",
                  text: "2 nouvelles commandes 🍡:\n+-----+-------+---------+----------+\n| OID | CLIENT| ARTICLE | STATUT   |\n+-----+-------+---------+----------+\n| 105 | Jean  | Chemise | Nouveau  |\n| 092 | Marie | Robe    | Emball.  |\n+-----+-------+---------+----------+"
            },
            {
                  who: "you",
                  text: "trouver la commande de Marie"
            },
            {
                  who: "mochi",
                  text: "commande #M-092 de Marie: robe, CR, emballage 📦"
            },
            {
                  who: "you",
                  text: "annuler commande #M-092, client a changé d'avis"
            },
            {
                  who: "mochi",
                  text: "annulé #M-092 et inventaire restauré ✓"
            }
      ],
      "template": [
            {
                  who: "you",
                  text: "créer base de données CRM clients et commandes"
            },
            {
                  who: "mochi",
                  text: "Initialisation de 2 tables:\n\n[CUSTOMERS]\n+----+-------+------------+\n| ID | NOM   | TÉLÉPHONE  |\n+----+-------+------------+\n| 01 | Jean  | 0901234567 |\n| 02 | Marie | 0987654321 |\n+----+-------+------------+\n\n[ORDERS]\n+-----+-------+---------+----------+\n| OID | C_ID  | ARTICLE | STATUT   |\n+-----+-------+---------+----------+\n| 101 | 01    | Chemise | Expédié  |\n| 102 | 02    | Robe    | Emball.  |\n+-----+-------+---------+----------+"
            }
      ],
      "branchA": [
            {
                  who: "you",
                  text: "checkout branch feature/add-jean"
            },
            {
                  who: "mochi",
                  text: "✓ basculé sur feature/add-jean"
            },
            {
                  who: "you",
                  text: "ajouter Jean, twitter 0912345678, Paris, source twitter"
            },
            {
                  who: "mochi",
                  text: "profil créé #J-201: Jean · 0912345678 · Paris ✓"
            },
            {
                  who: "you",
                  text: "commit de ce changement"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Jean\n  + id: \"J-201\"\n  + phone: \"0912345678\"\n  + source: \"twitter\"",
                  process: true,
                  id: "commit-A"
            },
            {
                  who: "you",
                  text: "push vers remote"
            },
            {
                  who: "mochi",
                  text: "pushed feature/add-jean → origin 🚀",
                  id: "push-A"
            }
      ],
      "branchB": [
            {
                  who: "you",
                  text: "checkout branch feature/add-marie"
            },
            {
                  who: "mochi",
                  text: "✓ basculé sur feature/add-marie"
            },
            {
                  who: "you",
                  text: "ajouter Marie, fb 0978654321, Lyon, source facebook"
            },
            {
                  who: "mochi",
                  text: "profil créé #M-088: Marie · 0978654321 · Lyon ✓"
            },
            {
                  who: "you",
                  text: "commit de ce changement"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Marie\n  + id: \"M-088\"\n  + phone: \"0978654321\"\n  + source: \"facebook\"",
                  process: true,
                  id: "commit-B"
            },
            {
                  who: "you",
                  text: "annuler commit précédent"
            },
            {
                  who: "mochi",
                  text: "commit annulé et données restaurées 🔙",
                  id: "revert-B"
            }
      ]
},
    db: {
      "userA": "USER A · VENTES",
      "userB": "USER B · MARKETING",
      "branchAName": "feature/add-jean",
      "branchBName": "feature/add-marie",
      "title": "DB TEMPS RÉEL",
      "live": "EN DIRECT",
      "watching": "▸ clients · surveillance des branches…",
      "statusStaged": "staged…",
      "statusPushed": "pushed↑",
      "statusReverted": "reverted",
      "statusMerged": "main ✓ ",
      "legendStaged": "staged…  → commit, non push",
      "legendPushed": "pushed↑  → sync. avec distant",
      "legendReverted": "reverted → modif. annulées",
      "eventsTitle": "▸ événements git",
      "eventsEmpty": "en attente de commits...",
      "dataA": {
            "id": "J-201",
            "name": "Jean",
            "phone": "0912345678",
            "source": "twitter",
            "msgC": "commit: feat(crm): add Jean",
            "msgP": "push to origin"
      },
      "dataB": {
            "id": "M-088",
            "name": "Marie",
            "phone": "0978654321",
            "source": "facebook",
            "msgC": "commit: feat(crm): add Marie",
            "msgR": "revert previous commit"
      }
},
  hero: {
    headline: "Un seul endroit pour tout votre travail. Sans serveur, sans abonnement.",
    sub: "Créez une liste de clients, un suivi de recrutement, tout ce dont votre équipe a besoin. Tout reste sur votre ordinateur.",
    badge: "Local-first · nativement IA",
    download: "Télécharger Mochi",
    ctaPrimary: "Commencer",
    ctaSecondary: "Voir comment ça marche",
    copyLabel: "Copier la commande d'installation",
    trust: [
      { title: "Rien à installer", desc: "C'est sur votre ordinateur, comme n'importe quelle application." },
      { title: "Marche hors ligne", desc: "Vos modifications rejoignent l'équipe dès votre retour en ligne." },
      { title: "À vous seul", desc: "Rien ne quitte votre machine sans que vous le demandiez." },
    ],
  },
  heroDemo: {
    agent: "Claude",
    placeholder: "demandez à Claude de modifier le tableau…",
    empty: "Espace vide",
    turns: [
      {
        ask: "crée une base CRM avec clients, commandes et produits",
        reply: "8 collections créées avec des données d'exemple.",
      },
      {
        ask: "génère une image de couverture pour chaque produit",
        reply: "12 images de produit ajoutées.",
      },
      {
        ask: "quels produits ont moins de 10 en stock ?",
        reply: "5, désormais filtrés dans cette vue.",
      },
    ],
  },
  feat: {
    title: "Un espace où travaillent votre équipe et votre IA",
    sub: "Aussi simple qu'un tableur, aussi solide qu'une base de données, et votre IA lit et écrit chaque ligne.",
    items: [
      { title: "Demandez avec des mots simples", desc: "Claude, Codex et OpenCode peuvent chercher et modifier à votre place. Tout est noté, vous pouvez donc toujours revenir en arrière." },
      { title: "Pas de formules, pas de réglages", desc: "Partez d'un espace déjà prêt, ou décrivez en une phrase ce qu'il vous faut et laissez Mochi le construire." },
    ],
    demo: [
      { ask: "ouvre la table clients", reply: "Customers ouverte, 6 lignes." },
      { ask: "montre seulement les actifs", reply: "Filtré sur 7 actifs." },
    ],
  },
  audit: { title: "Vous voyez tout ce que votre IA a fait", desc: "Chaque modification est listée champ par champ, et un filtre se construit en cliquant, pas en expliquant.", points: ["Chaque modification de l'IA, notée", "Construisez un filtre en cliquant"] },
  git: {
    title: "Chaque changement est gardé, rien ne se perd",
    sub: "Voyez qui a changé quoi et quand. Remettez les choses comme avant, même une semaine plus tard.",
    items: [
      { title: "Votre travail, toujours sauvegardé", desc: "Chaque enregistrement met à jour votre copie et la copie partagée en même temps. Aucune étape à retenir." },
      { title: "Deux personnes, une table", desc: "Travaillez en même temps sans vous gêner. Mochi garde les deux côtés d'accord." },
    ],
    agentLabel: "Agent Mochi",
    syncedCaption: "synchronisé automatiquement, sans configuration",
  },
  flow: {
    title: "Trois étapes vers un espace natif pour agents",
    sub: "Démarrez en quelques minutes. Sans serveur, sans configuration compliquée.",
    steps: [
      { title: "Initialisez un espace de travail", desc: "Choisissez un modèle prêt. Mochi crée le schéma, les relations et les données d'exemple en quelques secondes." },
      { title: "Discutez avec votre agent", desc: "Claude, Codex ou OpenCode manipulent les données via des outils typés, sans SQL." },
      { title: "Validez sur Git", desc: "Exportez un bundle texte facile à relire et à comparer. Une branche par espace de travail." },
    ],
  },
  tpl: {
    viewAll: "Tout voir →",
    title: "Partez de quelque chose qui marche déjà",
    sub: "Ventes, recrutement, stock ou projets. Chacun arrive avec des données d'exemple, et tout se modifie avec des mots simples.",
    items: [
      "Centralisez les interactions clients pour conclure plus d'affaires",
      "Gérez les personnes, les rôles et les présences au même endroit",
      "Suivez le stock, les entrepôts et les flux en temps réel",
      "Coordonnez les tâches et livrez à temps sans relancer personne",
    ],
  },
  char: {
    title: "Voici Mochi",
    sub: "Un petit compagnon tout rond et toujours prêt, entre vos agents IA et votre base de données. Mochi ne décide jamais à votre place ; il rend simplement chaque opération sur les données simple, sûre et facile à suivre.",
  },
  price: {
    title: "Gratuit tant que vous êtes seul",
    sub: "Tout ce que montre cette page marche sans payer. Pro sert quand d'autres personnes doivent y être avec vous.",
    free: "Gratuit",
    perMonth: "par mois",
    perYear: "par an",
    cta: "Passer à Pro",
    soon: "Bientôt",
    note: "Facturé via Polar. Annulez quand vous voulez : vos données restent sur votre machine dans tous les cas.",
    plans: [
      { tagline: "Pour une personne", features: ["Tout tourne sur votre propre ordinateur", "Autant d'espaces et de tables que vous voulez", "Historique complet, et un retour arrière qui remonte loin", "Connectez Claude, Codex ou OpenCode"] },
      { tagline: "Pour une équipe", features: ["Tout ce qu'il y a dans Gratuit", "Des places pour le reste de l'équipe", "Des espaces partagés qui restent d'accord", "Assistance par e-mail"] },
    ],
  },
  cta: { title: "Prêt à remettre vos données en ordre ?", sub: "Téléchargez Mochi et commencez en une minute. Rien à configurer, aucun compte à créer.", button: "Commencer →" },
  footer: {
    tagline: "Un endroit pour les données de votre équipe. Elles restent sur vos machines, et votre IA s'en sert.",
    product: "Produit",
    developer: "Développeurs",
    company: "Entreprise",
    copyright: "Espace de données pour les équipes et les agents.",
    status: "Tous les systèmes sont opérationnels",
  },
  waitlist: {
    title: "Offre gratuite, bientôt disponible",
    sub: "Nous vous écrirons le jour de l'ouverture. Rien d'autre.",
    emailLabel: "E-mail",
    placeholder: "vous@entreprise.com",
    button: "Me prévenir",
    sending: "Envoi…",
    success: "Vous êtes sur la liste.",
    error: "Une erreur est survenue. Réessayez.",
    invalid: "Saisissez une adresse e-mail valide.",
  },
  success: {
    title: "Tout est prêt !",
    sub: "Votre licence Pro est en route vers votre boîte mail. Installez Mochi et commencez à construire votre espace de travail.",
    order: "Référence de commande :",
    cta: "Voir sur GitHub",
    back: "Retour à l'accueil",
    note: "Vous n'avez pas reçu l'e-mail ? Vérifiez vos spams ou contactez-nous sur GitHub.",
  },
};

const de: Messages = {
  nav: {
    product: "Produkt",
    pricing: "Preise",
    docs: "Doku",
    changelog: "Changelog",
    community: "Community",
    howItWorks: "So funktioniert's",
    features: "Funktionen",
    templates: "Vorlagen",
    repo: "GitHub-Repository",
    repoHome: "GitHub Home",
    discussions: "Diskussionen",
    mcp: "MCP-Integration",
    about: "Über Mochi",
    star: "Auf GitHub starren",
    login: "Anmelden",
    menu: "Menü",
    openMenu: "Menü öffnen",
  },
  eyebrow: {
    flow: "So funktioniert's",
    feat: "Zusammenarbeiten",
    views: "Ansichten",
    tpl: "Vorlagen",
    char: "Warum Mochi",
    compare: "Im Vergleich zu Excel + Copilot und Airtable",
    price: "Preise",
    step: "Schritt",
    git: "Verlauf",
    audit: "Kontrolle",
  },
  views: {
    title: "Ein Datensatz, jede Ansicht, die dein Team mag",
    sub: "Tabelle, Board, Kalender, Galerie, Diagramm. Alle lesen dieselben Zeilen, ein Wechsel kopiert also nichts.",
    shots: ["Leads nach Status", "Bestellungen nach Datum", "Produkte als Karten", "Aufgaben nach Priorität", "Leads nach Quelle"],
  },
  compare: {
    yes: "Ja",
    no: "Nein",
    rows: [
      { feature: "KI-Agenten lesen und schreiben deine Daten nativ", excel: "Schlägt nur Formeln vor", airtable: "", mochi: "" },
      { feature: "Wo deine Daten liegen", excel: "Lokale Datei, keine Synchronisierung", airtable: "Immer deren Cloud", mochi: "Dein Laptop oder die Cloud, deine Entscheidung" },
      { feature: "Läuft ohne Server und ohne Konto", excel: "Copilot braucht ein Microsoft-Konto", airtable: "", mochi: "" },
      { feature: "Jeder Schreibvorgang ist versioniert, nachvollziehbar und umkehrbar", excel: "Nur Undo-Verlauf", airtable: "Nur in bezahlten Tarifen", mochi: "" },
      { feature: "Echtzeit-Zusammenarbeit, Team und Agenten", excel: "Benötigt Microsoft 365", airtable: "", mochi: "" },
      { feature: "Preis", excel: "Pro Platz + Copilot-Zusatz", airtable: "Pro Platz, monatlich", mochi: "Einmalig 19 $, für immer" },
    ],
  },

    scripts: {
      "chat": [
            {
                  who: "you",
                  text: "Füge Kunde Hans, Tel 0901234567, Berlin zum CRM hinzu. Quelle WhatsApp, Hemd gekauft."
            },
            {
                  who: "mochi",
                  text: "Profil für Hans erstellt #H-105 ✓"
            },
            {
                  who: "you",
                  text: "Heutige Bestellungen auflisten"
            },
            {
                  who: "mochi",
                  text: "2 neue Bestellungen heute 🍡:\n+-----+-------+---------+----------+\n| OID | KUNDE | ARTIKEL | STATUS   |\n+-----+-------+---------+----------+\n| 105 | Hans  | Hemd    | Neu      |\n| 092 | Anna  | Kleid   | Verpack. |\n+-----+-------+---------+----------+"
            },
            {
                  who: "you",
                  text: "Finde Annas Bestellung"
            },
            {
                  who: "mochi",
                  text: "Bestellung #A-092 für Anna: Kleid, Nachnahme, Verpack. 📦"
            },
            {
                  who: "you",
                  text: "Bestellung #A-092 stornieren, Kunde hat Meinung geändert"
            },
            {
                  who: "mochi",
                  text: "#A-092 storniert und Inventar wiederhergestellt ✓"
            }
      ],
      "template": [
            {
                  who: "you",
                  text: "CRM-Datenbank mit Kunden und Bestellungen erstellen"
            },
            {
                  who: "mochi",
                  text: "2 Datentabellen initialisiert:\n\n[CUSTOMERS]\n+----+-------+------------+\n| ID | NAME  | TELEFON    |\n+----+-------+------------+\n| 01 | Hans  | 0901234567 |\n| 02 | Anna  | 0987654321 |\n+----+-------+------------+\n\n[ORDERS]\n+-----+-------+---------+----------+\n| OID | K_ID  | ARTIKEL | STATUS   |\n+-----+-------+---------+----------+\n| 101 | 01    | Hemd    | Versandt |\n| 102 | 02    | Kleid   | Verpack. |\n+-----+-------+---------+----------+"
            }
      ],
      "branchA": [
            {
                  who: "you",
                  text: "checkout branch feature/add-hans"
            },
            {
                  who: "mochi",
                  text: "✓ zu feature/add-hans gewechselt"
            },
            {
                  who: "you",
                  text: "Hans hinzufügen, WhatsApp 0912345678, Berlin, Quelle WhatsApp"
            },
            {
                  who: "mochi",
                  text: "Profil erstellt #H-201: Hans · 0912345678 · Berlin ✓"
            },
            {
                  who: "you",
                  text: "diese Änderung committen"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Hans\n  + id: \"H-201\"\n  + phone: \"0912345678\"\n  + source: \"WhatsApp\"",
                  process: true,
                  id: "commit-A"
            },
            {
                  who: "you",
                  text: "auf Remote pushen"
            },
            {
                  who: "mochi",
                  text: "pushed feature/add-hans → origin 🚀",
                  id: "push-A"
            }
      ],
      "branchB": [
            {
                  who: "you",
                  text: "checkout branch feature/add-anna"
            },
            {
                  who: "mochi",
                  text: "✓ zu feature/add-anna gewechselt"
            },
            {
                  who: "you",
                  text: "Anna hinzufügen, fb 0978654321, München, Quelle facebook"
            },
            {
                  who: "mochi",
                  text: "Profil erstellt #A-088: Anna · 0978654321 · München ✓"
            },
            {
                  who: "you",
                  text: "diese Änderung committen"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Anna\n  + id: \"A-088\"\n  + phone: \"0978654321\"\n  + source: \"facebook\"",
                  process: true,
                  id: "commit-B"
            },
            {
                  who: "you",
                  text: "vorherigen Commit rückgängig machen"
            },
            {
                  who: "mochi",
                  text: "Commit rückgängig gemacht und Daten wiederhergestellt 🔙",
                  id: "revert-B"
            }
      ]
},
    db: {
      "userA": "USER A · VERTRIEB",
      "userB": "USER B · MARKETING",
      "branchAName": "feature/add-hans",
      "branchBName": "feature/add-anna",
      "title": "ECHTZEIT-DB",
      "live": "LIVE",
      "watching": "▸ Kunden · beobachte Branches…",
      "statusStaged": "staged…",
      "statusPushed": "pushed↑",
      "statusReverted": "reverted",
      "statusMerged": "main ✓ ",
      "legendStaged": "staged…  → committet, nicht gepusht",
      "legendPushed": "pushed↑  → mit Remote synchronisiert",
      "legendReverted": "reverted → Änderungen rückgängig",
      "eventsTitle": "▸ git-Ereignisse",
      "eventsEmpty": "Warten auf Commits...",
      "dataA": {
            "id": "H-201",
            "name": "Hans",
            "phone": "0912345678",
            "source": "whatsapp",
            "msgC": "commit: feat(crm): add Hans",
            "msgP": "push to origin"
      },
      "dataB": {
            "id": "A-088",
            "name": "Anna",
            "phone": "0978654321",
            "source": "facebook",
            "msgC": "commit: feat(crm): add Anna",
            "msgR": "revert previous commit"
      }
},
  hero: {
    headline: "Ein Ort für die ganze Arbeit. Ohne Server, ohne Monatsrechnung.",
    sub: "Baue eine Kundenliste, ein Bewerbungsboard oder was dein Team sonst braucht. Alles bleibt auf deinem eigenen Rechner.",
    badge: "Local-first · KI-nativ",
    download: "Mochi herunterladen",
    ctaPrimary: "Loslegen",
    ctaSecondary: "So funktioniert's",
    copyLabel: "Installationsbefehl kopieren",
    trust: [
      { title: "Nichts einzurichten", desc: "Es liegt auf deinem Rechner wie jede andere App." },
      { title: "Läuft offline", desc: "Deine Änderungen erreichen das Team, sobald du wieder online bist." },
      { title: "Nur deins", desc: "Nichts verlässt deinen Rechner, außer du willst es." },
    ],
  },
  heroDemo: {
    agent: "Claude",
    placeholder: "bitte Claude, die Tabelle zu ändern…",
    empty: "Leerer Workspace",
    turns: [
      {
        ask: "lege eine CRM-Datenbank mit Kunden, Bestellungen und Produkten an",
        reply: "8 Sammlungen mit Beispieldaten erstellt.",
      },
      {
        ask: "erzeuge für jedes Produkt ein Titelbild",
        reply: "12 Produktbilder hinzugefügt.",
      },
      {
        ask: "welche Produkte haben weniger als 10 auf Lager?",
        reply: "5, jetzt in dieser Ansicht gefiltert.",
      },
    ],
  },
  feat: {
    title: "Ein Arbeitsplatz für dein Team und deine KI",
    sub: "So einfach wie eine Tabelle, so stark wie eine Datenbank, und deine KI liest und schreibt jede Zeile.",
    items: [
      { title: "Frag einfach, mit normalen Worten", desc: "Claude, Codex und OpenCode können nachsehen und für dich ändern. Alles wird mitgeschrieben, du kannst es also jederzeit zurücknehmen." },
      { title: "Keine Formeln, kein Einrichten", desc: "Starte mit einem Bereich, der schon läuft, oder beschreibe in einem Satz, was du brauchst, und lass Mochi es bauen." },
    ],
    demo: [
      { ask: "öffne die Kundentabelle", reply: "Customers geöffnet, 6 Zeilen." },
      { ask: "zeig nur die aktiven", reply: "Auf 7 aktive gefiltert." },
    ],
  },
  audit: { title: "Du siehst alles, was deine KI getan hat", desc: "Jede Änderung steht Feld für Feld da, und einen Filter baust du per Klick, nicht per Erklärung.", points: ["Jede Änderung der KI wird notiert", "Einen Filter per Klick bauen"] },
  git: {
    title: "Jede Änderung bleibt erhalten, nichts geht verloren",
    sub: "Sieh, wer was wann geändert hat. Stell alles wieder her, auch eine Woche später.",
    items: [
      { title: "Deine Arbeit ist immer gesichert", desc: "Jedes Speichern bringt deine Kopie und die gemeinsame zugleich auf Stand. Kein Extraschritt, den man vergessen kann." },
      { title: "Zwei Leute, eine Tabelle", desc: "Arbeitet gleichzeitig, ohne euch in die Quere zu kommen. Mochi hält beide Seiten beisammen." },
    ],
    agentLabel: "Mochi-Agent",
    syncedCaption: "automatisch synchronisiert, ohne Konfiguration",
  },
  flow: {
    title: "Drei Schritte zu einem agentennativen Workspace",
    sub: "In Minuten startklar. Keine Server, kein kompliziertes Setup.",
    steps: [
      { title: "Workspace initialisieren", desc: "Wähle eine fertige Vorlage. Mochi erstellt Schema, Relationen und Beispieldaten in Sekunden." },
      { title: "Mit deinem Agenten chatten", desc: "Claude, Codex oder OpenCode bearbeiten Daten über typisierte Tools, ohne SQL." },
      { title: "Zu Git committen", desc: "Exportiere ein textbasiertes Bundle, das sich leicht prüfen und vergleichen lässt. Ein Branch pro Workspace." },
    ],
  },
  tpl: {
    viewAll: "Alle ansehen →",
    title: "Fang mit etwas an, das schon läuft",
    sub: "Vertrieb, Personal, Lager oder Projekte. Jede Vorlage bringt Beispieldaten mit, und du änderst alles mit normalen Worten.",
    items: [
      "Kundenkontakte bündeln und mehr Abschlüsse erzielen",
      "Menschen, Rollen und Anwesenheit an einem Ort verwalten",
      "Bestand, Lager und Zu-/Abgänge in Echtzeit verfolgen",
      "Aufgaben koordinieren und pünktlich liefern, ohne nachzuhaken",
    ],
  },
  char: {
    title: "Das ist Mochi",
    sub: "Ein kleiner, runder, stets bereiter Begleiter, zwischen deinen KI-Agenten und deiner Datenbank. Mochi entscheidet nie für dich; es macht jede Datenoperation nur einfach, sicher und leicht nachvollziehbar.",
  },
  price: {
    title: "Kostenlos, solange du allein bist",
    sub: "Alles auf dieser Seite funktioniert ohne zu zahlen. Pro ist für den Moment, in dem andere mit dabei sein müssen.",
    free: "Kostenlos",
    perMonth: "pro Monat",
    perYear: "pro Jahr",
    cta: "Pro holen",
    soon: "Bald",
    note: "Abrechnung über Polar. Jederzeit kündbar, und deine Daten bleiben so oder so auf deinem Rechner.",
    plans: [
      { tagline: "Für eine Person", features: ["Alles läuft auf deinem eigenen Rechner", "So viele Bereiche und Tabellen, wie du willst", "Vollständiger Verlauf, und ein Rückgängig, das weit zurückreicht", "Verbinde Claude, Codex oder OpenCode"] },
      { tagline: "Für ein Team", features: ["Alles aus Kostenlos", "Plätze für den Rest des Teams", "Geteilte Bereiche, die beisammen bleiben", "Support per E-Mail"] },
    ],
  },
  cta: { title: "Bereit, Ordnung in deine Daten zu bringen?", sub: "Lade Mochi und leg in etwa einer Minute los. Nichts einzurichten, nichts anzumelden.", button: "Loslegen →" },
  footer: {
    tagline: "Ein Ort für die Daten deines Teams. Sie bleiben auf euren Rechnern, und deine KI kann damit arbeiten.",
    product: "Produkt",
    developer: "Entwickler",
    company: "Unternehmen",
    copyright: "Daten-Workspace für Teams und Agenten.",
    status: "Alle Systeme betriebsbereit",
  },
  waitlist: {
    title: "Kostenloser Tarif, bald verfügbar",
    sub: "Wir schreiben dir am Tag der Freischaltung. Sonst nichts.",
    emailLabel: "E-Mail",
    placeholder: "du@firma.de",
    button: "Benachrichtige mich",
    sending: "Wird gesendet…",
    success: "Du stehst auf der Liste.",
    error: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    invalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
  },
  success: {
    title: "Alles bereit!",
    sub: "Deine Pro-Lizenz ist auf dem Weg in dein Postfach. Installiere Mochi und starte mit deinem Workspace.",
    order: "Bestellreferenz:",
    cta: "Auf GitHub ansehen",
    back: "Zur Startseite",
    note: "E-Mail nicht erhalten? Schau im Spam nach oder melde dich auf GitHub.",
  },
};

const ja: Messages = {
  nav: {
    product: "プロダクト",
    pricing: "料金",
    docs: "ドキュメント",
    changelog: "変更履歴",
    community: "コミュニティ",
    howItWorks: "使い方",
    features: "機能",
    templates: "テンプレート",
    repo: "GitHub リポジトリ",
    repoHome: "GitHub Home",
    discussions: "ディスカッション",
    mcp: "MCP 連携",
    about: "Mochi について",
    star: "GitHub でスターを付ける",
    login: "ログイン",
    menu: "メニュー",
    openMenu: "メニューを開く",
  },
  eyebrow: {
    flow: "使い方",
    feat: "いっしょに使う",
    views: "ビュー",
    tpl: "テンプレート",
    char: "Mochi を選ぶ理由",
    compare: "Excel + Copilot・Airtable との比較",
    price: "料金",
    step: "ステップ",
    git: "履歴",
    audit: "コントロール",
  },
  views: {
    title: "同じデータを、チームの好きな見え方で",
    sub: "表、ボード、カレンダー、ギャラリー、グラフ。どれも同じ行を読むので、切り替えても何も複製しません。",
    shots: ["リード（ステータス別）", "注文（注文日別）", "商品（カード表示）", "タスク（優先度別）", "リード（流入元別）"],
  },
  compare: {
    yes: "対応",
    no: "非対応",
    rows: [
      { feature: "AIエージェントがデータをネイティブに読み書き", excel: "数式の提案のみ", airtable: "", mochi: "" },
      { feature: "データの保存場所", excel: "ローカルファイル、同期なし", airtable: "常に提供元のクラウド", mochi: "自分のPCでもクラウドでも, 選べます" },
      { feature: "サーバーもアカウントも不要で動作", excel: "Copilot には Microsoft アカウントが必要", airtable: "", mochi: "" },
      { feature: "すべての書き込みがバージョン管理・追跡・巻き戻し可能", excel: "元に戻す履歴のみ", airtable: "有料プランのみ", mochi: "" },
      { feature: "リアルタイム共同編集, メンバーとエージェント", excel: "Microsoft 365 が必要", airtable: "", mochi: "" },
      { feature: "料金", excel: "1席ごと + Copilot 追加料金", airtable: "1席ごとの月額", mochi: "買い切り 19 ドル、ずっと使える" },
    ],
  },

    scripts: {
      "chat": [
            {
                  who: "you",
                  text: "顧客ケンジを追加、電話0901234567、東京渋谷をCRMへ。ソースはLINE、シャツを購入。"
            },
            {
                  who: "mochi",
                  text: "ケンジのプロファイルを作成しました #K-105 ✓"
            },
            {
                  who: "you",
                  text: "今日の注文リストを表示"
            },
            {
                  who: "mochi",
                  text: "今日の新規注文 2件 🍡:\n+-----+-------+---------+----------+\n| OID | 顧客  | 商品    | ステータス|\n+-----+-------+---------+----------+\n| 105 | Kenji | シャツ  | 新規      |\n| 092 | Sakura| ドレス  | 梱包中    |\n+-----+-------+---------+----------+"
            },
            {
                  who: "you",
                  text: "サクラの注文を探して"
            },
            {
                  who: "mochi",
                  text: "サクラの注文 #S-092: ドレス, 代引き, 梱包中 📦"
            },
            {
                  who: "you",
                  text: "注文 #S-092 をキャンセル。顧客の気が変わった"
            },
            {
                  who: "mochi",
                  text: "#S-092 をキャンセルし、在庫を戻しました ✓"
            }
      ],
      "template": [
            {
                  who: "you",
                  text: "顧客と注文を含むCRMデータベースを作成"
            },
            {
                  who: "mochi",
                  text: "2つのデータテーブルを初期化しました:\n\n[CUSTOMERS]\n+----+-------+------------+\n| ID | 名前  | 電話番号   |\n+----+-------+------------+\n| 01 | Kenji | 0901234567 |\n| 02 | Sakura| 0987654321 |\n+----+-------+------------+\n\n[ORDERS]\n+-----+-------+---------+----------+\n| OID | C_ID  | 商品    | STATUS   |\n+-----+-------+---------+----------+\n| 101 | 01    | シャツ  | 発送済み |\n| 102 | 02    | ドレス  | 梱包中   |\n+-----+-------+---------+----------+"
            }
      ],
      "branchA": [
            {
                  who: "you",
                  text: "checkout branch feature/add-kenji"
            },
            {
                  who: "mochi",
                  text: "✓ feature/add-kenji に切り替えました"
            },
            {
                  who: "you",
                  text: "ケンジを追加, LINE 0912345678, 東京, ソース LINE"
            },
            {
                  who: "mochi",
                  text: "プロファイル作成 #K-201: Kenji · 0912345678 · 東京 ✓"
            },
            {
                  who: "you",
                  text: "この変更をコミット"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Kenji\n  + id: \"K-201\"\n  + phone: \"0912345678\"\n  + source: \"LINE\"",
                  process: true,
                  id: "commit-A"
            },
            {
                  who: "you",
                  text: "リモートにプッシュ"
            },
            {
                  who: "mochi",
                  text: "pushed feature/add-kenji → origin 🚀",
                  id: "push-A"
            }
      ],
      "branchB": [
            {
                  who: "you",
                  text: "checkout branch feature/add-sakura"
            },
            {
                  who: "mochi",
                  text: "✓ feature/add-sakura に切り替えました"
            },
            {
                  who: "you",
                  text: "サクラを追加, Twitter 0978654321, 大阪, ソース Twitter"
            },
            {
                  who: "mochi",
                  text: "プロファイル作成 #S-088: Sakura · 0978654321 · 大阪 ✓"
            },
            {
                  who: "you",
                  text: "この変更をコミット"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Sakura\n  + id: \"S-088\"\n  + phone: \"0978654321\"\n  + source: \"Twitter\"",
                  process: true,
                  id: "commit-B"
            },
            {
                  who: "you",
                  text: "前のコミットを取り消す"
            },
            {
                  who: "mochi",
                  text: "コミットを元に戻し、データを復元しました 🔙",
                  id: "revert-B"
            }
      ]
},
    db: {
      "userA": "USER A · 営業",
      "userB": "USER B · マーケティング",
      "branchAName": "feature/add-kenji",
      "branchBName": "feature/add-sakura",
      "title": "リアルタイム DB",
      "live": "LIVE",
      "watching": "▸ 顧客 · ブランチを監視中…",
      "statusStaged": "staged…",
      "statusPushed": "pushed↑",
      "statusReverted": "reverted",
      "statusMerged": "main ✓ ",
      "legendStaged": "staged…  → コミット済み、未プッシュ",
      "legendPushed": "pushed↑  → リモートに同期済み",
      "legendReverted": "reverted → 変更を取り消し",
      "eventsTitle": "▸ git イベント",
      "eventsEmpty": "コミットを待機中...",
      "dataA": {
            "id": "K-201",
            "name": "Kenji",
            "phone": "0912345678",
            "source": "LINE",
            "msgC": "commit: feat(crm): add Kenji",
            "msgP": "push to origin"
      },
      "dataB": {
            "id": "S-088",
            "name": "Sakura",
            "phone": "0978654321",
            "source": "Twitter",
            "msgC": "commit: feat(crm): add Sakura",
            "msgR": "revert previous commit"
      }
},
  hero: {
    headline: "仕事のすべてをひとつの場所に。サーバーも月額もいりません。",
    sub: "顧客リストでも採用管理でも、チームに必要なものを作れます。すべて自分のパソコンの中にあります。",
    badge: "ローカルファースト · AIネイティブ",
    download: "Mochi をダウンロード",
    ctaPrimary: "はじめる",
    ctaSecondary: "使い方を見る",
    copyLabel: "インストールコマンドをコピー",
    trust: [
      { title: "用意するものはなし", desc: "ほかのアプリと同じように、あなたのパソコンで動きます。" },
      { title: "オフラインでも使える", desc: "オンラインに戻った瞬間、変更がチームに届きます。" },
      { title: "あなただけのもの", desc: "あなたが望まないかぎり、何もパソコンの外に出ません。" },
    ],
  },
  heroDemo: {
    agent: "Claude",
    placeholder: "テーブルの変更を Claude に頼む…",
    empty: "空のワークスペース",
    turns: [
      {
        ask: "顧客・注文・商品を含む CRM データベースを作って",
        reply: "8 個のコレクションをサンプルデータ付きで作成しました。",
      },
      {
        ask: "すべての商品にカバー画像を生成して",
        reply: "商品画像を 12 件追加しました。",
      },
      {
        ask: "在庫が 10 未満の商品は?",
        reply: "5 件です。このビューで絞り込みました。",
      },
    ],
  },
  feat: {
    title: "チームと AI が同じ場所で働けます",
    sub: "表計算のように簡単で、データベースのように頼れて、AI がすべての行を読み書きできます。",
    items: [
      { title: "ふつうの言葉で頼むだけ", desc: "Claude や Codex、OpenCode が調べたり書き換えたりします。すべて記録に残るので、いつでも元に戻せます。" },
      { title: "数式も設定もいりません", desc: "すでに動くワークスペースから始めるか、必要なものを一文で伝えれば Mochi が作ります。" },
    ],
    demo: [
      { ask: "顧客テーブルを開いて", reply: "Customers を開きました。6 行です。" },
      { ask: "アクティブだけ表示して", reply: "アクティブ 7 件に絞り込みました。" },
    ],
  },
  audit: { title: "AI がしたことはすべて見えます", desc: "変更はフィールド単位で並び、絞り込みは説明ではなくクリックで作れます。", points: ["AI の変更はすべて記録されます", "クリックで絞り込みを作る"] },
  git: {
    title: "変更はすべて残るので、なくなるものはありません",
    sub: "誰がいつ何を変えたかがわかります。一週間後でも元の状態に戻せます。",
    items: [
      { title: "あなたの仕事はいつも控えがあります", desc: "保存するたびに手元の分と共有の分が同時に更新されます。覚えておく別の手順はありません。" },
      { title: "二人でひとつの表", desc: "同時に作業してもぶつかりません。Mochi が両方をそろえます。" },
    ],
    agentLabel: "Mochi エージェント",
    syncedCaption: "自動同期・設定不要",
  },
  flow: {
    title: "エージェントネイティブなワークスペースへの3ステップ",
    sub: "数分で開始。サーバーも複雑な設定も不要です。",
    steps: [
      { title: "ワークスペースを初期化", desc: "既製テンプレートを選ぶだけ。Mochiがスキーマ・リレーション・サンプルデータを数秒で作成します。" },
      { title: "エージェントと対話", desc: "Claude・Codex・OpenCodeが型付きツールでデータを操作。SQLは不要です。" },
      { title: "Gitへコミット", desc: "レビューや差分が容易なテキストバンドルを書き出します。ワークスペースごとに1ブランチ。" },
    ],
  },
  tpl: {
    viewAll: "すべて見る →",
    title: "すでに動くものから始めましょう",
    sub: "営業、採用、在庫、プロジェクト。どれもサンプルつきで届き、ふつうの言葉で好きなだけ変えられます。",
    items: [
      "顧客とのやり取りを集約して、成約数を伸ばす",
      "人・役割・勤怠をひとつのワークスペースで管理",
      "在庫・倉庫・入出庫をリアルタイムに把握",
      "タスクを整理し、催促なしで期日どおりに届ける",
    ],
  },
  char: {
    title: "Mochiを紹介",
    sub: "小さくて丸い、いつでも頼れる相棒。AIエージェントとデータベースの間に立ちます。Mochiが代わりに判断することはなく、すべてのデータ操作をシンプルで安全、追跡しやすくします。",
  },
  price: {
    title: "ひとりのうちは無料です",
    sub: "このページにあることは、払わなくても全部できます。Pro は、ほかの人もいっしょに入る必要が出てきたときのものです。",
    free: "無料",
    perMonth: "月あたり",
    perYear: "年あたり",
    cta: "Pro にする",
    soon: "近日公開",
    note: "支払いは Polar 経由です。いつでも解約でき、どちらにしてもデータはあなたのパソコンに残ります。",
    plans: [
      { tagline: "ひとり用", features: ["すべて自分のパソコンで動きます", "ワークスペースもテーブルも好きなだけ", "完全な履歴と、さかのぼれる取り消し", "Claude・Codex・OpenCode をつなげます"] },
      { tagline: "チーム用", features: ["無料プランのすべて", "チームの人数ぶんの席", "ずれない共有ワークスペース", "メールサポート"] },
    ],
  },
  cta: { title: "データを整理する準備はできましたか", sub: "Mochi をダウンロードすれば一分ほどで始められます。設定も登録もいりません。", button: "はじめる →" },
  footer: {
    tagline: "チームのデータを置く場所。みなさんのパソコンの中に残り、AI が使えます。",
    product: "プロダクト",
    developer: "開発者",
    company: "会社情報",
    copyright: "チームとエージェントのためのデータワークスペース。",
    status: "全システム正常稼働",
  },
  waitlist: {
    title: "無料プランは近日公開",
    sub: "公開日にメールでお知らせします。それ以外は送りません。",
    emailLabel: "メールアドレス",
    placeholder: "you@company.com",
    button: "通知を受け取る",
    sending: "送信中…",
    success: "登録が完了しました。",
    error: "問題が発生しました。もう一度お試しください。",
    invalid: "有効なメールアドレスを入力してください。",
  },
  success: {
    title: "準備完了です！",
    sub: "Proライセンスはまもなくメールに届きます。Mochiをインストールしてワークスペースの構築を始めましょう。",
    order: "注文番号：",
    cta: "GitHubで見る",
    back: "ホームに戻る",
    note: "メールが届きませんか？迷惑メールフォルダをご確認いただくか、GitHubでお問い合わせください。",
  },
};

const zh: Messages = {
  nav: {
    product: "产品",
    pricing: "价格",
    docs: "文档",
    changelog: "更新日志",
    community: "社区",
    howItWorks: "如何使用",
    features: "功能",
    templates: "模板",
    repo: "GitHub 仓库",
    repoHome: "GitHub Home",
    discussions: "讨论区",
    mcp: "MCP 集成",
    about: "关于 Mochi",
    star: "在 GitHub 上加星",
    login: "登录",
    menu: "菜单",
    openMenu: "打开菜单",
  },
  eyebrow: {
    flow: "如何使用",
    feat: "一起用",
    views: "视图",
    tpl: "模板",
    char: "为什么选 Mochi",
    compare: "对比 Excel + Copilot 与 Airtable",
    price: "价格",
    step: "步骤",
    git: "历史",
    audit: "掌控",
  },
  views: {
    title: "同一份数据，团队喜欢怎么看就怎么看",
    sub: "表格、看板、日历、图库、图表。它们读的是同一批数据，换个看法不会复制任何东西。",
    shots: ["线索（按状态）", "订单（按下单日期）", "商品（卡片视图）", "任务（按优先级）", "线索（按来源）"],
  },
  compare: {
    yes: "支持",
    no: "不支持",
    rows: [
      { feature: "AI 智能体原生读写你的数据", excel: "仅能建议公式", airtable: "", mochi: "" },
      { feature: "数据存放位置", excel: "本地文件，不同步", airtable: "始终在他们的云上", mochi: "你的电脑或云端, 你说了算" },
      { feature: "无需服务器和账号即可运行", excel: "Copilot 需要微软账号", airtable: "", mochi: "" },
      { feature: "每次写入都有版本、可追溯、可回滚", excel: "仅有撤销历史", airtable: "仅限付费套餐", mochi: "" },
      { feature: "实时协作, 队友与智能体", excel: "需要 Microsoft 365", airtable: "", mochi: "" },
      { feature: "价格", excel: "按席位收费 + Copilot 加购", airtable: "按席位，按月付费", mochi: "19 美元买断，终身可用" },
    ],
  },

    scripts: {
      "chat": [
            {
                  who: "you",
                  text: "添加客户 Wei, 电话 0901234567, 北京 至 CRM。来源 微信, 买衬衫。"
            },
            {
                  who: "mochi",
                  text: "已创建 Wei 的个人资料 #W-105 ✓"
            },
            {
                  who: "you",
                  text: "列出今天的订单"
            },
            {
                  who: "mochi",
                  text: "今天有 2 个新订单 🍡:\n+-----+-------+---------+----------+\n| OID | 客户  | 商品    | 状态     |\n+-----+-------+---------+----------+\n| 105 | Wei   | 衬衫    | 新建     |\n| 092 | Li    | 裙子    | 打包中   |\n+-----+-------+---------+----------+"
            },
            {
                  who: "you",
                  text: "找一下 Li 的订单"
            },
            {
                  who: "mochi",
                  text: "Li 的订单 #L-092: 裙子, 货到付款, 打包中 📦"
            },
            {
                  who: "you",
                  text: "取消订单 #L-092, 客户改变主意了"
            },
            {
                  who: "mochi",
                  text: "已取消 #L-092 并恢复库存 ✓"
            }
      ],
      "template": [
            {
                  who: "you",
                  text: "创建包含客户和订单的CRM数据库"
            },
            {
                  who: "mochi",
                  text: "初始化了 2 个数据表:\n\n[CUSTOMERS]\n+----+-------+------------+\n| ID | 姓名  | 电话       |\n+----+-------+------------+\n| 01 | Wei   | 0901234567 |\n| 02 | Li    | 0987654321 |\n+----+-------+------------+\n\n[ORDERS]\n+-----+-------+---------+----------+\n| OID | C_ID  | 商品    | 状态     |\n+-----+-------+---------+----------+\n| 101 | 01    | 衬衫    | 已发货   |\n| 102 | 02    | 裙子    | 打包中   |\n+-----+-------+---------+----------+"
            }
      ],
      "branchA": [
            {
                  who: "you",
                  text: "checkout branch feature/add-wei"
            },
            {
                  who: "mochi",
                  text: "✓ 已切换到 feature/add-wei"
            },
            {
                  who: "you",
                  text: "添加 Wei, 微信 0912345678, 北京, 来源 微信"
            },
            {
                  who: "mochi",
                  text: "已创建个人资料 #W-201: Wei · 0912345678 · 北京 ✓"
            },
            {
                  who: "you",
                  text: "提交此更改"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Wei\n  + id: \"W-201\"\n  + phone: \"0912345678\"\n  + source: \"微信\"",
                  process: true,
                  id: "commit-A"
            },
            {
                  who: "you",
                  text: "推送到远程"
            },
            {
                  who: "mochi",
                  text: "pushed feature/add-wei → origin 🚀",
                  id: "push-A"
            }
      ],
      "branchB": [
            {
                  who: "you",
                  text: "checkout branch feature/add-li"
            },
            {
                  who: "mochi",
                  text: "✓ 已切换到 feature/add-li"
            },
            {
                  who: "you",
                  text: "添加 Li, 微博 0978654321, 上海, 来源 微博"
            },
            {
                  who: "mochi",
                  text: "已创建个人资料 #L-088: Li · 0978654321 · 上海 ✓"
            },
            {
                  who: "you",
                  text: "提交此更改"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Li\n  + id: \"L-088\"\n  + phone: \"0978654321\"\n  + source: \"微博\"",
                  process: true,
                  id: "commit-B"
            },
            {
                  who: "you",
                  text: "撤销上一个提交"
            },
            {
                  who: "mochi",
                  text: "已撤销提交并恢复数据 🔙",
                  id: "revert-B"
            }
      ]
},
    db: {
      "userA": "USER A · 销售",
      "userB": "USER B · 营销",
      "branchAName": "feature/add-wei",
      "branchBName": "feature/add-li",
      "title": "实时数据库",
      "live": "LIVE",
      "watching": "▸ 客户 · 正在监控分支…",
      "statusStaged": "staged…",
      "statusPushed": "pushed↑",
      "statusReverted": "reverted",
      "statusMerged": "main ✓ ",
      "legendStaged": "staged…  → 已提交, 未推送",
      "legendPushed": "pushed↑  → 已同步到远程",
      "legendReverted": "reverted → 更改已撤销",
      "eventsTitle": "▸ git 事件",
      "eventsEmpty": "等待提交...",
      "dataA": {
            "id": "W-201",
            "name": "Wei",
            "phone": "0912345678",
            "source": "WeChat",
            "msgC": "commit: feat(crm): add Wei",
            "msgP": "push to origin"
      },
      "dataB": {
            "id": "L-088",
            "name": "Li",
            "phone": "0978654321",
            "source": "Weibo",
            "msgC": "commit: feat(crm): add Li",
            "msgR": "revert previous commit"
      }
},
  hero: {
    headline: "把工作放在一个地方。不用服务器，也没有月费。",
    sub: "做一份客户名单、一张招聘看板，或者团队需要的任何东西。它们都存在你自己的电脑上。",
    badge: "本地优先 · AI 原生",
    download: "下载 Mochi",
    ctaPrimary: "开始使用",
    ctaSecondary: "看看怎么用",
    copyLabel: "复制安装命令",
    trust: [
      { title: "不用搭建什么", desc: "它像别的应用一样，装在你自己的电脑上。" },
      { title: "断网也能用", desc: "一回到网上，你的改动就会同步给队友。" },
      { title: "只属于你", desc: "除非你要求，任何内容都不会离开你的电脑。" },
    ],
  },
  heroDemo: {
    agent: "Claude",
    placeholder: "让 Claude 修改这张表…",
    empty: "空工作区",
    turns: [
      {
        ask: "创建一个包含客户、订单和商品的 CRM 数据库",
        reply: "已创建 8 个集合并填入示例数据。",
      },
      {
        ask: "为每个商品生成一张封面图",
        reply: "已添加 12 张商品图片。",
      },
      {
        ask: "哪些商品库存低于 10？",
        reply: "5 个，已在此视图中筛选出来。",
      },
    ],
  },
  feat: {
    title: "一个团队和 AI 都能用的工作区",
    sub: "像表格一样好上手，像数据库一样靠得住，AI 还能读写每一行。",
    items: [
      { title: "用平常的话说一句就行", desc: "Claude、Codex 和 OpenCode 可以帮你查、帮你改。每次改动都会记下来，你随时能撤回。" },
      { title: "不用公式，也不用配置", desc: "从一个已经能跑的工作区开始，或者一句话说清你要什么，交给 Mochi 来搭。" },
    ],
    demo: [
      { ask: "打开客户表", reply: "已打开 Customers，共 6 行。" },
      { ask: "只显示活跃的", reply: "已筛选出 7 个活跃客户。" },
    ],
  },
  audit: { title: "AI 做过的每件事你都看得见", desc: "每次修改都按字段列出来，筛选靠点几下就成，不用解释。", points: ["AI 的每次修改都会记下来", "点几下就能做出筛选"] },
  git: {
    title: "每一次改动都留着，什么都不会丢",
    sub: "看清谁在什么时候改了什么。哪怕过了一周，也能把它放回原样。",
    items: [
      { title: "你的东西一直有备份", desc: "每次保存都会同时更新本机和共享的那份，没有另外要记的步骤。" },
      { title: "两个人，一张表", desc: "同时做事也不会互相踩到。Mochi 会让两边保持一致。" },
    ],
    agentLabel: "Mochi 智能体",
    syncedCaption: "自动同步，无需配置",
  },
  flow: {
    title: "三步搭建面向智能体的工作区",
    sub: "几分钟即可上手。无需服务器，无需复杂配置。",
    steps: [
      { title: "初始化工作区", desc: "选择一个预置模板。Mochi 在数秒内创建架构、关系和示例数据。" },
      { title: "与智能体对话", desc: "Claude、Codex 或 OpenCode 通过类型化工具操作数据ï¼无需 SQL。" },
      { title: "提交到 Git", desc: "导出便于评审和对比的文本包。每个工作区一个分支。" },
    ],
  },
  tpl: {
    viewAll: "查看全部 →",
    title: "从已经能用的东西开始",
    sub: "销售、招聘、库存或项目。每份都带着示例数据，你可以用平常的话随便改。",
    items: [
      "集中管理客户往来，提高成交率",
      "在一个空间里管理人员、角色和考勤",
      "实时掌握库存、仓库和出入库流水",
      "协调任务，不用催也能按时交付",
    ],
  },
  char: {
    title: "认识 Mochi",
    sub: "一个小小的、圆滚滚、随时待命的伙伴ï¼站在你的 AI 智能体和数据库之间。Mochi 从不替你做决定，只让每一次数据操作都简单、安全、易于追踪。",
  },
  price: {
    title: "一个人用，一直免费",
    sub: "这一页上的东西不花钱就能全用。Pro 是给需要别人一起进来的时候准备的。",
    free: "免费",
    perMonth: "每月",
    perYear: "每年",
    cta: "升级 Pro",
    soon: "即将推出",
    note: "通过 Polar 收款。随时可以取消，无论如何数据都留在你自己的电脑上。",
    plans: [
      { tagline: "一个人用", features: ["全部在你自己的电脑上运行", "工作区和表想建多少建多少", "完整历史，撤销能一直往回退", "接上 Claude、Codex 或 OpenCode"] },
      { tagline: "团队用", features: ["免费版的全部", "给团队其他人的席位", "共享工作区，始终一致", "邮件支持"] },
    ],
  },
  cta: { title: "准备好把数据理一理了吗？", sub: "下载 Mochi，大概一分钟就能开始。不用配置，也不用注册。", button: "开始使用 →" },
  footer: {
    tagline: "放团队数据的地方。它留在你们的电脑里，AI 也用得上。",
    product: "产品",
    developer: "开发者",
    company: "公司",
    copyright: "面向团队与智能体的数据工作空间。",
    status: "所有系统运行正常",
  },
  waitlist: {
    title: "免费套餐, 即将推出",
    sub: "开放当天我们会发邮件通知你，仅此而已。",
    emailLabel: "邮箱",
    placeholder: "you@company.com",
    button: "通知我",
    sending: "发送中…",
    success: "已加入名单。",
    error: "出了点问题，请重试。",
    invalid: "请输入有效的邮箱地址。",
  },
  success: {
    title: "一切就绪！",
    sub: "你的 Pro 许可证正发送到你的邮箱。安装 Mochi，开始搭建你的工作区。",
    order: "订单编号：",
    cta: "在 GitHub 上查看",
    back: "返回首页",
    note: "没收到邮件？请检查垃圾邮件文件夹，或通过 GitHub 联系我们。",
  },
};

const vi: Messages = {
  nav: {
    product: "Sản phẩm",
    pricing: "Bảng giá",
    docs: "Tài liệu",
    changelog: "Nhật ký thay đổi",
    community: "Cộng đồng",
    howItWorks: "Cách hoạt động",
    features: "Tính năng",
    templates: "Mẫu có sẵn",
    repo: "Kho GitHub",
    repoHome: "GitHub Home",
    discussions: "Thảo luận",
    mcp: "Tích hợp MCP",
    about: "Về Mochi",
    star: "Gắn sao trên GitHub",
    login: "Đăng nhập",
    menu: "Menu",
    openMenu: "Mở menu",
  },
  eyebrow: {
    flow: "Cách hoạt động",
    feat: "Cùng làm việc",
    views: "Cách xem",
    tpl: "Mẫu có sẵn",
    char: "Vì sao chọn Mochi",
    compare: "So với Excel + Copilot và Airtable",
    price: "Bảng giá",
    step: "Bước",
    git: "Lịch sử",
    audit: "Kiểm soát",
  },
  views: {
    title: "Một bộ dữ liệu, mọi cách nhóm bạn muốn nhìn",
    sub: "Bảng, cột, lịch, thư viện ảnh, biểu đồ. Tất cả đọc cùng một dữ liệu nên đổi cách xem không sao chép gì cả.",
    shots: ["Khách tiềm năng theo trạng thái", "Đơn hàng theo ngày đặt", "Sản phẩm dạng thẻ", "Công việc theo mức ưu tiên", "Khách tiềm năng theo nguồn"],
  },
  compare: {
    yes: "Có",
    no: "Không",
    rows: [
      { feature: "Agent AI đọc và ghi dữ liệu một cách tự nhiên", excel: "Chỉ gợi ý công thức", airtable: "", mochi: "" },
      { feature: "Dữ liệu nằm ở đâu", excel: "Tệp trên máy, không đồng bộ", airtable: "Luôn nằm trên cloud của họ", mochi: "Máy bạn hoặc cloud, bạn quyết" },
      { feature: "Chạy được mà không cần server hay tài khoản", excel: "Copilot đòi tài khoản Microsoft", airtable: "", mochi: "" },
      { feature: "Mọi thao tác ghi đều có phiên bản, truy vết và hoàn tác được", excel: "Chỉ có lịch sử hoàn tác", airtable: "Chỉ có ở gói trả phí", mochi: "" },
      { feature: "Cộng tác thời gian thực, cả người lẫn agent", excel: "Cần Microsoft 365", airtable: "", mochi: "" },
      { feature: "Giá", excel: "Theo đầu người + phụ phí Copilot", airtable: "Theo đầu người, hàng tháng", mochi: "19 $ một lần, dùng mãi mãi" },
    ],
  },

    scripts: {
      "chat": [
            {
                  who: "you",
                  text: "thêm khách tên Hải, sđt 0901234567, 435 Nguyễn Trãi Q5 vào CRM. nguồn tiktok, mua áo."
            },
            {
                  who: "mochi",
                  text: "tạo đơn với khách hàng Hải #H-105 ✓"
            },
            {
                  who: "you",
                  text: "danh sách đơn hàng hôm nay"
            },
            {
                  who: "mochi",
                  text: "hôm nay có 2 đơn mới 🍡:\n+-----+-------+---------+----------+\n| OID | KHÁCH | MÓN     | STATUS   |\n+-----+-------+---------+----------+\n| 105 | Hải   | Áo thun | Mới tạo  |\n| 092 | Lan   | Váy nữ  | Đang gói |\n+-----+-------+---------+----------+"
            },
            {
                  who: "you",
                  text: "tìm đơn của Lan giúp mình"
            },
            {
                  who: "mochi",
                  text: "đơn #L-092 của Lan: mua váy, thanh toán COD, trạng thái đang gói hàng 📦"
            },
            {
                  who: "you",
                  text: "huỷ đơn #L-092 nhé, khách đổi ý rồi"
            },
            {
                  who: "mochi",
                  text: "đã huỷ đơn #L-092 và hoàn lại tồn kho ✓"
            }
      ],
      "template": [
            {
                  who: "you",
                  text: "tạo database CRM gồm khách hàng và đơn hàng"
            },
            {
                  who: "mochi",
                  text: "Khởi tạo 2 bảng dữ liệu mẫu:\n\n[CUSTOMERS]\n+----+-------+------------+\n| ID | TÊN   | SĐT        |\n+----+-------+------------+\n| 01 | Hải   | 0901234567 |\n| 02 | Lan   | 0987654321 |\n+----+-------+------------+\n\n[ORDERS]\n+-----+-------+---------+----------+\n| OID | KH_ID | MÓN     | STATUS   |\n+-----+-------+---------+----------+\n| 101 | 01    | Áo thun | Đã giao  |\n| 102 | 02    | Váy nữ  | Đang gói |\n+-----+-------+---------+----------+"
            }
      ],
      "branchA": [
            {
                  who: "you",
                  text: "checkout branch feature/add-minh"
            },
            {
                  who: "mochi",
                  text: "✓ đang ở branch feature/add-minh"
            },
            {
                  who: "you",
                  text: "thêm khách Minh, zalo 0912345678, Q1 HCM, nguồn zalo"
            },
            {
                  who: "mochi",
                  text: "tạo hồ sơ #M-201: Minh · 0912345678 · Q1 ✓"
            },
            {
                  who: "you",
                  text: "commit thay đổi này"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Minh\n  + id: \"M-201\"\n  + phone: \"0912345678\"\n  + source: \"zalo\"",
                  process: true,
                  id: "commit-A"
            },
            {
                  who: "you",
                  text: "push lên remote"
            },
            {
                  who: "mochi",
                  text: "pushed feature/add-minh → origin 🚀",
                  id: "push-A"
            }
      ],
      "branchB": [
            {
                  who: "you",
                  text: "checkout branch feature/add-thu"
            },
            {
                  who: "mochi",
                  text: "✓ đang ở branch feature/add-thu"
            },
            {
                  who: "you",
                  text: "thêm khách Thu, fb 0978654321, Q3, nguồn facebook"
            },
            {
                  who: "mochi",
                  text: "tạo hồ sơ #T-088: Thu · 0978654321 · Q3 ✓"
            },
            {
                  who: "you",
                  text: "commit thay đổi này"
            },
            {
                  who: "mochi",
                  text: "commit: feat(crm): add customer Thu\n  + id: \"T-088\"\n  + phone: \"0978654321\"\n  + source: \"facebook\"",
                  process: true,
                  id: "commit-B"
            },
            {
                  who: "you",
                  text: "revert commit vừa rồi"
            },
            {
                  who: "mochi",
                  text: "đã revert commit và khôi phục dữ liệu 🔙",
                  id: "revert-B"
            }
      ]
},
    db: {
      "userA": "USER A · SALES",
      "userB": "USER B · MARKETING",
      "branchAName": "feature/add-minh",
      "branchBName": "feature/add-thu",
      "title": "REALTIME DB",
      "live": "LIVE",
      "watching": "▸ customers · watching branches…",
      "statusStaged": "staged…",
      "statusPushed": "pushed↑",
      "statusReverted": "reverted",
      "statusMerged": "main ✓ ",
      "legendStaged": "staged…  → committed, chưa push",
      "legendPushed": "pushed↑  → đã sync lên remote",
      "legendReverted": "reverted → thay đổi bị hoàn tác",
      "eventsTitle": "▸ git events",
      "eventsEmpty": "waiting for commits...",
      "dataA": {
            "id": "M-201",
            "name": "Minh",
            "phone": "0912345678",
            "source": "zalo",
            "msgC": "commit: feat(crm): add Minh",
            "msgP": "push to origin"
      },
      "dataB": {
            "id": "T-088",
            "name": "Thu",
            "phone": "0978654321",
            "source": "facebook",
            "msgC": "commit: feat(crm): add Thu",
            "msgR": "revert previous commit"
      }
},
  hero: {
    headline: "Một nơi cho mọi việc của cả nhóm. Không máy chủ, không phí hằng tháng.",
    sub: "Dựng danh sách khách hàng, bảng theo dõi tuyển dụng, hay bất cứ thứ gì nhóm bạn cần. Tất cả nằm trên máy của bạn.",
    badge: "Local-first · thuần AI",
    download: "Tải Mochi",
    ctaPrimary: "Bắt đầu",
    ctaSecondary: "Xem cách hoạt động",
    copyLabel: "Sao chép lệnh cài đặt",
    trust: [
      { title: "Không phải dựng gì", desc: "Nó chạy trên máy bạn như mọi ứng dụng khác." },
      { title: "Dùng được khi mất mạng", desc: "Thay đổi của bạn đến với cả nhóm ngay khi có mạng trở lại." },
      { title: "Chỉ của riêng bạn", desc: "Không gì rời khỏi máy bạn trừ khi bạn muốn." },
    ],
  },
  heroDemo: {
    agent: "Claude",
    placeholder: "nhờ Claude sửa bảng…",
    empty: "Workspace trống",
    turns: [
      {
        ask: "tạo cơ sở dữ liệu CRM gồm khách hàng, đơn hàng và sản phẩm",
        reply: "Đã tạo 8 collection kèm dữ liệu mẫu.",
      },
      {
        ask: "tạo ảnh bìa cho từng sản phẩm",
        reply: "Đã thêm 12 ảnh sản phẩm.",
      },
      {
        ask: "sản phẩm nào còn dưới 10 trong kho?",
        reply: "5 sản phẩm, đã lọc sẵn trong view này.",
      },
    ],
  },
  feat: {
    title: "Một nơi làm việc cho cả nhóm bạn lẫn AI của bạn",
    sub: "Dễ như bảng tính, mạnh như cơ sở dữ liệu, và AI của bạn đọc ghi được từng dòng.",
    items: [
      { title: "Cứ nói bằng lời thường", desc: "Claude, Codex hay OpenCode có thể tra cứu và sửa giúp bạn. Mọi thay đổi đều được ghi lại nên bạn luôn hoàn tác được." },
      { title: "Không công thức, không cài đặt", desc: "Bắt đầu từ một nơi làm việc đã chạy sẵn, hoặc tả một câu về thứ bạn cần rồi để Mochi dựng." },
    ],
    demo: [
      { ask: "mở bảng khách hàng", reply: "Đã mở Customers, 6 dòng." },
      { ask: "chỉ hiện những khách đang hoạt động", reply: "Đã lọc còn 7 khách hoạt động." },
    ],
  },
  audit: { title: "Bạn thấy được mọi việc AI đã làm", desc: "Từng thay đổi được liệt kê theo từng trường, và bạn dựng bộ lọc bằng cách bấm chọn chứ không phải giải thích.", points: ["Mọi thay đổi của AI đều được ghi lại", "Dựng bộ lọc bằng cách bấm chọn"] },
  git: {
    title: "Mọi thay đổi đều được giữ lại, không mất gì cả",
    sub: "Xem ai sửa gì, lúc nào. Trả lại như cũ bất cứ lúc nào, kể cả một tuần sau.",
    items: [
      { title: "Việc của bạn luôn có bản lưu", desc: "Mỗi lần lưu là cập nhật cả bản trên máy lẫn bản chung. Không có bước riêng nào phải nhớ." },
      { title: "Hai người, một bảng", desc: "Cùng làm một lúc mà không giẫm chân nhau. Mochi giữ hai bên khớp nhau." },
    ],
    agentLabel: "Mochi agent",
    syncedCaption: "tự động đồng bộ, không cần cấu hình",
  },
  flow: {
    title: "Ba bước có ngay workspace cho team",
    sub: "Vài phút là xong. Không server, không cấu hình rườm rà.",
    steps: [
      { title: "Cài đặt Mochi", desc: "Chỉ một lệnh. Miễn phí bắt đầu. Chạy trên Mac, Linux và Windows." },
      { title: "Chọn template", desc: "Bắt đầu từ CRM, HR, kho vận, dự án, hoặc canvas trắng tùy bạn." },
      { title: "Bắt đầu công việc với data của bạn", desc: "Trò chuyện với agent. Mochi đọc, ghi và tổ chức dữ liệu thay bạn." },
    ],
  },
  tpl: {
    viewAll: "Xem tất cả →",
    title: "Bắt đầu từ thứ đã chạy sẵn",
    sub: "Bán hàng, tuyển dụng, kho hay dự án. Mỗi mẫu đều có sẵn dữ liệu ví dụ, và bạn đổi được mọi thứ bằng lời thường.",
    items: [
      "Gom mọi tương tác với khách về một chỗ để chốt đơn nhanh hơn",
      "Quản lý nhân sự, vai trò và chấm công trong cùng một nơi",
      "Theo dõi tồn kho, kho bãi và xuất nhập theo thời gian thực",
      "Điều phối công việc, giao đúng hạn mà không phải đi giục",
    ],
  },
  char: {
    title: "Gặp gỡ Mochi",
    sub: "Một trợ lý nhỏ, tròn trịa và luôn sẵn sàng, đứng giữa team bạn, AI agent và dữ liệu. Mochi không thay bạn quyết định, chỉ giúp mọi thao tác dữ liệu trở nên đơn giản, an toàn và dễ theo dõi.",
  },
  price: {
    title: "Một mình thì miễn phí",
    sub: "Mọi thứ trên trang này dùng không mất tiền. Pro dành cho lúc cần thêm người khác cùng vào.",
    free: "Miễn phí",
    perMonth: "mỗi tháng",
    perYear: "mỗi năm",
    cta: "Lên Pro",
    soon: "Sắp có",
    note: "Thanh toán qua Polar. Huỷ lúc nào cũng được, và dù thế nào dữ liệu vẫn nằm trên máy bạn.",
    plans: [
      { tagline: "Cho một người", features: ["Mọi thứ chạy trên máy của bạn", "Bao nhiêu workspace và bảng tuỳ bạn", "Lịch sử đầy đủ, hoàn tác lùi được xa", "Nối Claude, Codex hay OpenCode"] },
      { tagline: "Cho cả nhóm", features: ["Toàn bộ bản Miễn phí", "Chỗ ngồi cho những người còn lại", "Workspace dùng chung luôn khớp nhau", "Hỗ trợ qua email"] },
    ],
  },
  cta: { title: "Sẵn sàng dọn lại dữ liệu chưa?", sub: "Tải Mochi về và bắt đầu trong khoảng một phút. Không phải cài đặt, không phải đăng ký.", button: "Bắt đầu →" },
  footer: {
    tagline: "Một nơi cho dữ liệu của nhóm bạn. Nó nằm trên máy của các bạn, và AI dùng được.",
    product: "Sản phẩm",
    developer: "Nhà phát triển",
    company: "Công ty",
    copyright: "Không gian dữ liệu cho team và agent.",
    status: "Mọi hệ thống hoạt động bình thường",
  },
  waitlist: {
    title: "Gói Free, sắp ra mắt",
    sub: "Mở là chúng tôi gửi email cho bạn ngay. Không gửi gì khác.",
    emailLabel: "Email",
    placeholder: "ban@congty.com",
    button: "Báo tôi khi có",
    sending: "Đang gửi…",
    success: "Đã ghi tên bạn vào danh sách.",
    error: "Có lỗi xảy ra. Vui lòng thử lại.",
    invalid: "Vui lòng nhập email hợp lệ.",
  },
  success: {
    title: "Xong rồi!",
    sub: "License Pro của bạn đang được gửi tới email. Cài Mochi và bắt đầu xây workspace của bạn.",
    order: "Mã đơn hàng:",
    cta: "Xem trên GitHub",
    back: "Về trang chủ",
    note: "Chưa nhận được email? Kiểm tra hộp thư spam, hoặc liên hệ qua GitHub.",
  },
};

export const messages: Record<LocaleCode, Messages> = { en, es, fr, de, ja, zh, vi };
