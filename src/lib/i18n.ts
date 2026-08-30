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
    menu: string;
    openMenu: string;
  };
  hero: {
    headline: string;
    sub: string;
    badge: string;
    ctaPrimary: string;
    ctaSecondary: string;
    copyLabel: string;
    trust: Trust[];
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
  };
  feat: { title: string; sub: string; items: Feature[] };
  /** the fifth feature block; the first four come from feat/git above */
  audit: Feature;
  git: { title: string; items: Feature[]; agentLabel: string; syncedCaption: string };
  flow: { title: string; sub: string; steps: Step[] };
  views: { title: string; sub: string; shots: string[] };
  tpl: { title: string; sub: string; items: string[]; viewAll: string };
  char: { title: string; sub: string };
  compare: { yes: string; no: string; rows: CompareRow[] };
  price: { title: string; sub: string; billed: string; popular: string; soon: string; getPro: string; forever: string; plans: Plan[] };
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
    repoHome: "GitHub — Home",
    discussions: "Discussions",
    mcp: "MCP integration",
    about: "About Mochi",
    star: "Star on GitHub",
    menu: "Menu",
    openMenu: "Open menu",
  },
  eyebrow: {
    flow: "How it works",
    feat: "Features",
    views: "Views",
    tpl: "Templates",
    char: "Why Mochi",
    compare: "Versus Excel + Copilot, and Airtable",
    price: "Pricing",
    step: "Step",
  },
  views: {
    title: "One dataset, every view your team thinks in",
    sub: "Grid, Kanban, Calendar, Gallery, Chart — all read the same records. Switch views without copying data or rebuilding a thing.",
    shots: ["Leads — By Status", "Orders — By Order Date", "Products — Product Cards", "Tasks — Grouped by Priority", "Leads — By Source"],
  },
  compare: {
    yes: "Yes",
    no: "No",
    rows: [
      { feature: "AI agents read & write your data natively", excel: "Suggests formulas only", airtable: "", mochi: "" },
      { feature: "Where your data lives", excel: "Local file, no sync", airtable: "Their cloud, always", mochi: "Your laptop or the cloud — your call" },
      { feature: "Runs without a server or account", excel: "Copilot needs a Microsoft account", airtable: "", mochi: "" },
      { feature: "Every write is versioned, traceable & reversible", excel: "Undo history only", airtable: "Paid tiers only", mochi: "" },
      { feature: "Real-time collab — teammates and agents", excel: "Needs Microsoft 365", airtable: "", mochi: "" },
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
    headline: "The local-first data workspace for your team and AI agents. Zero server bills.",
    sub: "Build CRM, HR, inventory, or any internal tool — no code, no prompts, no monthly server fees. Runs on your laptop, syncs peer-to-peer, and works natively with Claude, OpenCode, and Hermes-Agent.",
    badge: "Local-first · Peer-to-peer · AI-native",
    ctaPrimary: "Get started",
    ctaSecondary: "See how it works",
    copyLabel: "Copy install command",
    trust: [
      { title: "No server.", desc: "Your data stays on your devices." },
      { title: "Peer-to-peer sync.", desc: "Works offline. Changes sync when you're back." },
      { title: "Private by default.", desc: "Encrypted in transit. You own your data." },
    ],
  },
  feat: {
    title: "One workspace for your team and your AI agents",
    sub: "Mochi combines the simplicity of a spreadsheet, the power of a database, and the intelligence of AI.",
    items: [
      {
        title: "Chat with Claude, OpenCode & Hermes-Agent",
        desc: "AI agents operate your data through typed MCP tools — safe, auditable, and Git-backed. Every change is diff-reviewable.",
      },
      {
        title: "Design your data with no code, no prompts",
        desc: "Pick a template — CRM, HR, Inventory, Projects — or describe your tables in plain Markdown. Mochi builds the schema, relations, and sample data.",
      },
      {
        title: "Real-time team collaboration",
        desc: "Teammates share the same workspace via peer-to-peer sync. Edit together, no cloud servers, no per-seat billing.",
      },
      {
        title: "Runs on your laptop — no server bills",
        desc: "Your data lives on your machine. Zero hosting fees, no SaaS lock-in, no waiting on IT to spin up a database.",
      },
      {
        title: "Undo anything, keep the full history",
        desc: "Every edit is versioned in Git. Review who changed what, and roll back in one command when something goes wrong.",
      },
    ],
  },
  audit: { title: "Auditable, no-code control", desc: "Every agent edit is logged field by field, and filters or groups are built by clicking — not by prompting." },
  git: {
    title: "Git-backed storage control & data history",
    items: [
      {
        title: "Sync your database online, via Git",
        desc: "Every commit updates your local files and your hosted database together — no separate sync step, no drift.",
      },
      {
        title: "Team collab with agent",
        desc: "Two teammates, two branches, one shared workspace — Mochi keeps every edit in sync, no merge conflicts.",
      },
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
      { title: "Start working with your data", desc: "Talk to your agent — Mochi reads, writes, and organizes it for you." },
    ],
  },
  tpl: {
    viewAll: "View all →",
    title: "Templates for the tools you actually need",
    sub: "Whether you run sales, HR, ops, or a project team — start from a template with schema, relations, and sample data. Customize in plain language, or let your agent do it.",
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
    title: "Choose your plan",
    sub: "One plan, one payment. Yours forever.",
    billed: "One-time payment. Pay once, use forever.",
    popular: "MOST POPULAR",
    forever: "/forever",
    soon: "Soon",
    getPro: "Get Pro →",
    plans: [
      { tagline: "For solo hobby projects", features: ["3 workspaces", "Free templates only", "Git bundle deploy", "Community support"] },
      { tagline: "For individual builders", features: ["Unlimited workspaces", "Mochi Table", "Premium templates", "Git bundle deploy", "Write history & rollback", "Priority support"] },
    ],
  },
  cta: { title: "Ready to organize your data?", sub: "Install Mochi in seconds — no server, no prompts, no lock-in.", button: "Get started →" },
  footer: {
    tagline: "Your team's data workspace — no server bills, no lock-in, agent-ready.",
    product: "Product",
    developer: "Developer",
    company: "Company",
    copyright: "Data workspace for teams and agents.",
    status: "All systems operational",
  },
  waitlist: {
    title: "Free plan — coming soon",
    sub: "We'll email you the day it opens. Nothing else.",
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
    repoHome: "GitHub — Home",
    discussions: "Debates",
    mcp: "Integración MCP",
    about: "Sobre Mochi",
    star: "Marcar en GitHub",
    menu: "Menú",
    openMenu: "Abrir menú",
  },
  eyebrow: {
    flow: "Cómo funciona",
    feat: "Funciones",
    views: "Vistas",
    tpl: "Plantillas",
    char: "Por qué Mochi",
    compare: "Frente a Excel + Copilot y Airtable",
    price: "Precios",
    step: "Paso",
  },
  views: {
    title: "Un solo conjunto de datos, todas las vistas que tu equipo necesita",
    sub: "Cuadrícula, Kanban, Calendario, Galería, Gráfico: todas leen los mismos registros. Cambia de vista sin copiar datos ni rehacer nada.",
    shots: ["Leads — Por estado", "Pedidos — Por fecha", "Productos — Fichas", "Tareas — Por prioridad", "Leads — Por origen"],
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
    headline: "El espacio de datos local para tu equipo y tus agentes de IA. Cero facturas de servidor.",
    sub: "Crea un CRM, RR. HH., inventario o cualquier herramienta interna: sin código, sin prompts, sin cuotas mensuales de servidor. Funciona en tu portátil, se sincroniza entre pares y habla de forma nativa con Claude, OpenCode y Hermes-Agent.",
    badge: "Local-first · Peer-to-peer · Nativo para IA",
    ctaPrimary: "Empezar",
    ctaSecondary: "Ver cómo funciona",
    copyLabel: "Copiar comando de instalación",
    trust: [
      { title: "Sin servidor.", desc: "Tus datos se quedan en tus dispositivos." },
      { title: "Sincronización peer-to-peer.", desc: "Funciona sin conexión. Se sincroniza al volver." },
      { title: "Privado por defecto.", desc: "Cifrado en tránsito. Los datos son tuyos." },
    ],
  },
  feat: {
    title: "Todo lo que tu agente necesita para trabajar con datos",
    sub: "Mochi combina la simplicidad de una hoja de cálculo, la potencia de una base de datos y la inteligencia de la IA.",
    items: [
      {
        title: "Chatea con naturalidad con Claude, Codex y OpenCode",
        desc: "Habla directamente en lenguaje natural. Mochi entiende el contexto de tu espacio de trabajo y opera los datos por ti mediante herramientas tipadas.",
      },
      {
        title: "Crea una plantilla con un solo comando",
        desc: "Esquemas listos para CRM, HRM, inventario y proyectos, con datos de ejemplo incluidos.",
      },
      {
        title: "MULTI-BRANCH · MULTI-USER · REALTIME DB",
        desc: "Los agentes pueden trabajar en múltiples ramas simultáneamente. Las actualizaciones se transmiten en vivo a la BD en tiempo real sin colisiones.",
      },
    ],
  },
  audit: { title: "Control auditable, sin código", desc: "Cada edición del agente queda registrada campo por campo, y los filtros o grupos se crean haciendo clic, no escribiendo prompts." },
  git: {
    title: "Almacenamiento en Git y control del historial de datos",
    items: [
      {
        title: "Sincroniza tu base de datos online, vía Git",
        desc: "Cada commit actualiza tus archivos locales y tu base de datos alojada a la vez — sin paso de sincronización aparte, sin desviaciones.",
      },
      {
        title: "Colabora en equipo con el agente",
        desc: "Dos compañeros, dos ramas, un espacio de trabajo compartido — Mochi mantiene cada cambio sincronizado, sin conflictos de fusión.",
      },
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
    title: "Plantillas para las herramientas que realmente necesitas",
    sub: "Ya sea que gestiones ventas, RRHH, operaciones o un equipo de proyecto — empieza desde una plantilla con esquema, relaciones y datos de ejemplo. Personaliza en lenguaje natural o deja que tu agente lo haga.",
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
    title: "Elige tu plan",
    sub: "Un plan, un pago. Tuyo para siempre.",
    billed: "Pago único. Paga una vez, úsalo para siempre.",
    popular: "MÁS POPULAR",
    forever: "/para siempre",
    soon: "Próximamente",
    getPro: "Obtener Pro →",
    plans: [
      { tagline: "Para proyectos personales", features: ["3 espacios de trabajo", "Solo plantillas gratuitas", "Despliegue de paquete Git", "Soporte de la comunidad"] },
      { tagline: "Para creadores individuales", features: ["Espacios ilimitados", "Mochi Table", "Plantillas premium", "Despliegue de paquete Git", "Historial y reversión", "Soporte prioritario"] },
    ],
  },
  cta: { title: "¿Listo para organizar tus datos?", sub: "Instala Mochi en segundos y empieza con tu primera plantilla.", button: "Empezar →" },
  footer: {
    tagline: "El compañero de datos nativo para agentes: Claude, Codex y OpenCode.",
    product: "Producto",
    developer: "Desarrollo",
    company: "Empresa",
    copyright: "Espacio de datos para equipos y agentes.",
    status: "Todos los sistemas operativos",
  },
  waitlist: {
    title: "Plan gratuito — próximamente",
    sub: "Te escribiremos el día que se abra. Nada más.",
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
    repoHome: "GitHub — Home",
    discussions: "Discussions",
    mcp: "Intégration MCP",
    about: "À propos de Mochi",
    star: "Star sur GitHub",
    menu: "Menu",
    openMenu: "Ouvrir le menu",
  },
  eyebrow: {
    flow: "Comment ça marche",
    feat: "Fonctionnalités",
    views: "Vues",
    tpl: "Modèles",
    char: "Pourquoi Mochi",
    compare: "Face à Excel + Copilot et Airtable",
    price: "Tarifs",
    step: "Étape",
  },
  views: {
    title: "Un seul jeu de données, toutes les vues dont votre équipe a besoin",
    sub: "Grille, Kanban, Calendrier, Galerie, Graphique : tous lisent les mêmes enregistrements. Changez de vue sans copier ni reconstruire quoi que ce soit.",
    shots: ["Leads — Par statut", "Commandes — Par date", "Produits — Fiches", "Tâches — Par priorité", "Leads — Par source"],
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
    headline: "L'espace de données local pour votre équipe et vos agents IA. Zéro facture de serveur.",
    sub: "Créez un CRM, un SIRH, un inventaire ou n'importe quel outil interne : sans code, sans prompts, sans frais de serveur mensuels. Tourne sur votre ordinateur, se synchronise en pair-à-pair et dialogue nativement avec Claude, OpenCode et Hermes-Agent.",
    badge: "Local-first · Peer-to-peer · Nativement IA",
    ctaPrimary: "Commencer",
    ctaSecondary: "Voir comment ça marche",
    copyLabel: "Copier la commande d'installation",
    trust: [
      { title: "Aucun serveur.", desc: "Vos données restent sur vos appareils." },
      { title: "Synchro peer-to-peer.", desc: "Fonctionne hors ligne. Tout se synchronise au retour." },
      { title: "Privé par défaut.", desc: "Chiffré en transit. Vos données vous appartiennent." },
    ],
  },
  feat: {
    title: "Tout ce dont votre agent a besoin pour travailler avec les données",
    sub: "Mochi réunit la simplicité d'un tableur, la puissance d'une base de données et l'intelligence de l'IA.",
    items: [
      {
        title: "Discutez naturellement avec Claude, Codex et OpenCode",
        desc: "Parlez directement en langage naturel. Mochi comprend le contexte de votre espace et manipule les données pour vous via des outils typés.",
      },
      {
        title: "Créez un modèle en une seule commande",
        desc: "Des schémas prêts à l'emploi pour CRM, RH, inventaire et projets — données d'exemple incluses.",
      },
      {
        title: "MULTI-BRANCH · MULTI-USER · REALTIME DB",
        desc: "Les agents peuvent travailler sur plusieurs branches simultanément. Les mises à jour en direct sont diffusées sans collision.",
      },
    ],
  },
  audit: { title: "Un contrôle auditable, sans code", desc: "Chaque modification de l'agent est journalisée champ par champ, et les filtres ou groupes se construisent en cliquant, pas en rédigeant des prompts." },
  git: {
    title: "Stockage Git et contrôle de l'historique des données",
    items: [
      {
        title: "Synchronisez votre base de données en ligne, via Git",
        desc: "Chaque commit met à jour vos fichiers locaux et votre base de données hébergée en même temps — pas d'étape de synchro séparée, pas de dérive.",
      },
      {
        title: "Collaboration d'équipe avec l'agent",
        desc: "Deux coéquipiers, deux branches, un espace de travail partagé — Mochi garde chaque modification synchronisée, sans conflit de fusion.",
      },
    ],
    agentLabel: "Agent Mochi",
    syncedCaption: "synchronisé automatiquement, sans configuration",
  },
  flow: {
    title: "Trois étapes vers un espace natif pour agents",
    sub: "Démarrez en quelques minutes. Sans serveur, sans configuration compliquée.",
    steps: [
      { title: "Initialisez un espace de travail", desc: "Choisissez un modèle prêt. Mochi crée le schéma, les relations et les données d'exemple en quelques secondes." },
      { title: "Discutez avec votre agent", desc: "Claude, Codex ou OpenCode manipulent les données via des outils typés — sans SQL." },
      { title: "Validez sur Git", desc: "Exportez un bundle texte facile à relire et à comparer. Une branche par espace de travail." },
    ],
  },
  tpl: {
    viewAll: "Tout voir →",
    title: "Des modèles prêts à l'emploi, personnalisables au besoin",
    sub: "Chaque modèle est livré avec un schéma, des relations de données et des données d'exemple — assez pour démarrer tout de suite, assez simple pour l'adapter à vos besoins.",
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
    title: "Choisissez votre formule",
    sub: "Une offre, un paiement. À vous pour toujours.",
    billed: "Paiement unique. Payez une fois, utilisez à vie.",
    popular: "LE PLUS POPULAIRE",
    forever: "/à vie",
    soon: "Bientôt",
    getPro: "Passer à Pro →",
    plans: [
      { tagline: "Pour les projets perso", features: ["3 espaces de travail", "Modèles gratuits uniquement", "Déploiement de bundle Git", "Support communautaire"] },
      { tagline: "Pour les créateurs individuels", features: ["Espaces illimités", "Mochi Table", "Modèles premium", "Déploiement de bundle Git", "Historique et retour arrière", "Support prioritaire"] },
    ],
  },
  cta: { title: "Prêt à organiser vos données ?", sub: "Installez Mochi en quelques secondes et démarrez avec votre premier modèle.", button: "Commencer →" },
  footer: {
    tagline: "Le compagnon de données natif pour agents : Claude, Codex et OpenCode.",
    product: "Produit",
    developer: "Développeurs",
    company: "Entreprise",
    copyright: "Espace de données pour les équipes et les agents.",
    status: "Tous les systèmes sont opérationnels",
  },
  waitlist: {
    title: "Offre gratuite — bientôt disponible",
    sub: "Nous vous écrirons le jour de l'ouverture. Rien d'autre.",
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
    repoHome: "GitHub — Home",
    discussions: "Diskussionen",
    mcp: "MCP-Integration",
    about: "Über Mochi",
    star: "Auf GitHub starren",
    menu: "Menü",
    openMenu: "Menü öffnen",
  },
  eyebrow: {
    flow: "So funktioniert's",
    feat: "Funktionen",
    views: "Ansichten",
    tpl: "Vorlagen",
    char: "Warum Mochi",
    compare: "Im Vergleich zu Excel + Copilot und Airtable",
    price: "Preise",
    step: "Schritt",
  },
  views: {
    title: "Ein Datensatz, jede Ansicht, in der dein Team denkt",
    sub: "Grid, Kanban, Kalender, Galerie, Diagramm — alle lesen dieselben Datensätze. Ansicht wechseln, ohne Daten zu kopieren oder etwas neu zu bauen.",
    shots: ["Leads — Nach Status", "Bestellungen — Nach Datum", "Produkte — Karten", "Aufgaben — Nach Priorität", "Leads — Nach Quelle"],
  },
  compare: {
    yes: "Ja",
    no: "Nein",
    rows: [
      { feature: "KI-Agenten lesen und schreiben deine Daten nativ", excel: "Schlägt nur Formeln vor", airtable: "", mochi: "" },
      { feature: "Wo deine Daten liegen", excel: "Lokale Datei, keine Synchronisierung", airtable: "Immer deren Cloud", mochi: "Dein Laptop oder die Cloud — deine Entscheidung" },
      { feature: "Läuft ohne Server und ohne Konto", excel: "Copilot braucht ein Microsoft-Konto", airtable: "", mochi: "" },
      { feature: "Jeder Schreibvorgang ist versioniert, nachvollziehbar und umkehrbar", excel: "Nur Undo-Verlauf", airtable: "Nur in bezahlten Tarifen", mochi: "" },
      { feature: "Echtzeit-Zusammenarbeit — Team und Agenten", excel: "Benötigt Microsoft 365", airtable: "", mochi: "" },
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
    headline: "Der lokale Datenraum für dein Team und deine KI-Agenten. Keine Serverkosten.",
    sub: "Baue ein CRM, HR-Tool, Inventar oder jedes interne Werkzeug — ohne Code, ohne Prompts, ohne monatliche Servergebühren. Läuft auf deinem Laptop, synchronisiert peer-to-peer und arbeitet nativ mit Claude, OpenCode und Hermes-Agent.",
    badge: "Local-first · Peer-to-peer · KI-nativ",
    ctaPrimary: "Loslegen",
    ctaSecondary: "So funktioniert's",
    copyLabel: "Installationsbefehl kopieren",
    trust: [
      { title: "Kein Server.", desc: "Deine Daten bleiben auf deinen Geräten." },
      { title: "Peer-to-Peer-Sync.", desc: "Funktioniert offline. Änderungen synchronisieren sich später." },
      { title: "Privat by default.", desc: "Verschlüsselt bei der Übertragung. Die Daten gehören dir." },
    ],
  },
  feat: {
    title: "Alles, was dein Agent für die Arbeit mit Daten braucht",
    sub: "Mochi verbindet die Einfachheit einer Tabelle, die Leistung einer Datenbank und die Intelligenz von KI.",
    items: [
      {
        title: "Chatte natürlich mit Claude, Codex & OpenCode",
        desc: "Sprich direkt in natürlicher Sprache. Mochi versteht den Kontext deines Workspace und bearbeitet Daten für dich über typisierte Tools.",
      },
      {
        title: "Erstelle eine Vorlage mit einem Befehl",
        desc: "Fertige Schemata für CRM, HRM, Inventar und Projekte – Beispieldaten inklusive.",
      },
      {
        title: "MULTI-BRANCH · MULTI-USER · REALTIME DB",
        desc: "Agenten können gleichzeitig an mehreren Branches arbeiten. Live-Updates werden ohne Kollisionen in die Realtime-DB gestreamt.",
      },
    ],
  },
  audit: { title: "Nachvollziehbare Kontrolle, ganz ohne Code", desc: "Jede Änderung des Agenten wird Feld für Feld protokolliert, und Filter oder Gruppen entstehen per Klick — nicht per Prompt." },
  git: {
    title: "Git-gesicherter Speicher & Datenverwaltung",
    items: [
      {
        title: "Synchronisiere deine Datenbank online, via Git",
        desc: "Jeder Commit aktualisiert deine lokalen Dateien und deine gehostete Datenbank gleichzeitig — kein separater Sync-Schritt, keine Abweichung.",
      },
      {
        title: "Teamzusammenarbeit mit Agent",
        desc: "Zwei Kolleg:innen, zwei Branches, ein gemeinsamer Workspace — Mochi hält jede Änderung synchron, ganz ohne Merge-Konflikte.",
      },
    ],
    agentLabel: "Mochi-Agent",
    syncedCaption: "automatisch synchronisiert, ohne Konfiguration",
  },
  flow: {
    title: "Drei Schritte zu einem agentennativen Workspace",
    sub: "In Minuten startklar. Keine Server, kein kompliziertes Setup.",
    steps: [
      { title: "Workspace initialisieren", desc: "Wähle eine fertige Vorlage. Mochi erstellt Schema, Relationen und Beispieldaten in Sekunden." },
      { title: "Mit deinem Agenten chatten", desc: "Claude, Codex oder OpenCode bearbeiten Daten über typisierte Tools – ohne SQL." },
      { title: "Zu Git committen", desc: "Exportiere ein textbasiertes Bundle, das sich leicht prüfen und vergleichen lässt. Ein Branch pro Workspace." },
    ],
  },
  tpl: {
    viewAll: "Alle ansehen →",
    title: "Fertige Vorlagen, bei Bedarf anpassbar",
    sub: "Jede Vorlage kommt mit Schema, Datenrelationen und Beispieldaten – genug, damit dein Agent sofort loslegt, einfach genug für deine Anpassungen.",
    items: [
      "Kundenkontakte bündeln und mehr Abschlüsse erzielen",
      "Menschen, Rollen und Anwesenheit an einem Ort verwalten",
      "Bestand, Lager und Zu-/Abgänge in Echtzeit verfolgen",
      "Aufgaben koordinieren und pünktlich liefern, ohne nachzuhaken",
    ],
  },
  char: {
    title: "Das ist Mochi",
    sub: "Ein kleiner, runder, stets bereiter Begleiter – zwischen deinen KI-Agenten und deiner Datenbank. Mochi entscheidet nie für dich; es macht jede Datenoperation nur einfach, sicher und leicht nachvollziehbar.",
  },
  price: {
    title: "Wähle deinen Plan",
    sub: "Ein Tarif, eine Zahlung. Für immer deins.",
    billed: "Einmalzahlung. Einmal zahlen, für immer nutzen.",
    popular: "AM BELIEBTESTEN",
    forever: "/für immer",
    soon: "Bald",
    getPro: "Pro holen →",
    plans: [
      { tagline: "Für private Hobbyprojekte", features: ["3 Workspaces", "Nur kostenlose Vorlagen", "Git-Bundle-Deploy", "Community-Support"] },
      { tagline: "Für einzelne Entwickler", features: ["Unbegrenzte Workspaces", "Mochi Table", "Premium-Vorlagen", "Git-Bundle-Deploy", "Schreibverlauf & Rollback", "Priorisierter Support"] },
    ],
  },
  cta: { title: "Bereit, deine Daten zu ordnen?", sub: "Installiere Mochi in Sekunden und starte mit deiner ersten Vorlage.", button: "Loslegen →" },
  footer: {
    tagline: "Der agentennative Datenbegleiter für Claude, Codex und OpenCode.",
    product: "Produkt",
    developer: "Entwickler",
    company: "Unternehmen",
    copyright: "Daten-Workspace für Teams und Agenten.",
    status: "Alle Systeme betriebsbereit",
  },
  waitlist: {
    title: "Kostenloser Tarif — bald verfügbar",
    sub: "Wir schreiben dir am Tag der Freischaltung. Sonst nichts.",
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
    repoHome: "GitHub — Home",
    discussions: "ディスカッション",
    mcp: "MCP 連携",
    about: "Mochi について",
    star: "GitHub でスターを付ける",
    menu: "メニュー",
    openMenu: "メニューを開く",
  },
  eyebrow: {
    flow: "使い方",
    feat: "機能",
    views: "ビュー",
    tpl: "テンプレート",
    char: "Mochi を選ぶ理由",
    compare: "Excel + Copilot・Airtable との比較",
    price: "料金",
    step: "ステップ",
  },
  views: {
    title: "ひとつのデータを、チームの考え方どおりのビューで",
    sub: "グリッド、カンバン、カレンダー、ギャラリー、チャート — すべて同じレコードを読みます。データを複製することも作り直すこともなく、ビューだけを切り替えられます。",
    shots: ["リード — ステータス別", "注文 — 注文日別", "商品 — カード表示", "タスク — 優先度別", "リード — 流入元別"],
  },
  compare: {
    yes: "対応",
    no: "非対応",
    rows: [
      { feature: "AIエージェントがデータをネイティブに読み書き", excel: "数式の提案のみ", airtable: "", mochi: "" },
      { feature: "データの保存場所", excel: "ローカルファイル、同期なし", airtable: "常に提供元のクラウド", mochi: "自分のPCでもクラウドでも — 選べます" },
      { feature: "サーバーもアカウントも不要で動作", excel: "Copilot には Microsoft アカウントが必要", airtable: "", mochi: "" },
      { feature: "すべての書き込みがバージョン管理・追跡・巻き戻し可能", excel: "元に戻す履歴のみ", airtable: "有料プランのみ", mochi: "" },
      { feature: "リアルタイム共同編集 — メンバーとエージェント", excel: "Microsoft 365 が必要", airtable: "", mochi: "" },
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
    headline: "チームとAIエージェントのための、ローカルファーストなデータワークスペース。サーバー費用はゼロ。",
    sub: "CRM、人事、在庫管理など、社内ツールを何でも構築できます。コードもプロンプトも月額のサーバー費用も不要。手元のノートPCで動き、ピアツーピアで同期し、Claude・OpenCode・Hermes-Agent とそのまま連携します。",
    badge: "ローカルファースト · ピアツーピア · AIネイティブ",
    ctaPrimary: "はじめる",
    ctaSecondary: "使い方を見る",
    copyLabel: "インストールコマンドをコピー",
    trust: [
      { title: "サーバー不要。", desc: "データはあなたの端末に残ります。" },
      { title: "ピアツーピア同期。", desc: "オフラインでも動作し、復帰時に同期します。" },
      { title: "既定でプライベート。", desc: "通信は暗号化。データの所有者はあなたです。" },
    ],
  },
  feat: {
    title: "エージェントがデータを扱うために必要なすべて",
    sub: "Mochiは、表計算の手軽さ、データベースの性能、そしてAIの知性をひとつにまとめます。",
    items: [
      {
        title: "Claude・Codex・OpenCodeと自然に対話",
        desc: "自然言語でそのまま話しかけるだけ。Mochiはワークスペースの文脈を理解し、型付きツールでデータを操作します。",
      },
      {
        title: "1コマンドでテンプレートを作成",
        desc: "CRM・HRM・在庫・プロジェクト向けのスキーマをすぐに利用可能。サンプルデータ付き。",
      },
      {
        title: "MULTI-BRANCH · MULTI-USER · REALTIME DB",
        desc: "エージェントは複数のブランチで同時に作業できます。ライブアップデートは衝突することなくリアルタイムDBにストリーミングされます。",
      },
    ],
  },
  audit: { title: "ノーコードで、監査できる操作", desc: "エージェントの編集はフィールド単位で記録され、フィルターやグループ化はプロンプトではなくクリックで作れます。" },
  git: {
    title: "Git連携ストレージ制御とデータ履歴管理",
    items: [
      {
        title: "Git 経由でデータベースをオンライン同期",
        desc: "コミットのたびに、ローカルファイルとホスト先のデータベースが同時に更新されます。別途の同期作業もズレも発生しません。",
      },
      {
        title: "エージェントとチームで共同作業",
        desc: "2人のメンバー、2つのブランチ、1つの共有ワークスペース — Mochi があらゆる変更を同期し、マージの衝突もありません。",
      },
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
    title: "既製テンプレート、必要に応じてカスタマイズ",
    sub: "各テンプレートにはスキーマ・データリレーション・サンプルデータが付属。エージェントがすぐ動き出せて、あなたのニーズに合わせて簡単に調整できます。",
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
    title: "プランを選ぶ",
    sub: "プランはひとつ、支払いも一度きり。ずっとあなたのものです。",
    billed: "一度きりのお支払い。一度払えば、ずっと使えます。",
    popular: "一番人気",
    forever: "/買い切り",
    soon: "近日公開",
    getPro: "Pro を購入 →",
    plans: [
      { tagline: "個人の趣味プロジェクト向け", features: ["ワークスペース3つ", "無料テンプレートのみ", "Gitバンドルデプロイ", "コミュニティサポート"] },
      { tagline: "個人開発者向け", features: ["ワークスペース無制限", "Mochi Table", "プレミアムテンプレート", "Gitバンドルデプロイ", "書き込み履歴とロールバック", "優先サポート"] },
    ],
  },
  cta: { title: "データを整理する準備はできましたか？", sub: "数秒でMochiをインストールして、最初のテンプレートから始めましょう。", button: "はじめる →" },
  footer: {
    tagline: "Claude・Codex・OpenCodeのためのエージェントネイティブなデータ相棒。",
    product: "プロダクト",
    developer: "開発者",
    company: "会社情報",
    copyright: "チームとエージェントのためのデータワークスペース。",
    status: "全システム正常稼働",
  },
  waitlist: {
    title: "無料プランは近日公開",
    sub: "公開日にメールでお知らせします。それ以外は送りません。",
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
    repoHome: "GitHub — Home",
    discussions: "讨论区",
    mcp: "MCP 集成",
    about: "关于 Mochi",
    star: "在 GitHub 上加星",
    menu: "菜单",
    openMenu: "打开菜单",
  },
  eyebrow: {
    flow: "如何使用",
    feat: "功能",
    views: "视图",
    tpl: "模板",
    char: "为什么选 Mochi",
    compare: "对比 Excel + Copilot 与 Airtable",
    price: "价格",
    step: "步骤",
  },
  views: {
    title: "同一份数据，团队需要的每一种视图",
    sub: "表格、看板、日历、图库、图表 — 读取的都是同一批记录。切换视图不必复制数据，也不用重新搭一遍。",
    shots: ["线索 — 按状态", "订单 — 按下单日期", "商品 — 卡片视图", "任务 — 按优先级", "线索 — 按来源"],
  },
  compare: {
    yes: "支持",
    no: "不支持",
    rows: [
      { feature: "AI 智能体原生读写你的数据", excel: "仅能建议公式", airtable: "", mochi: "" },
      { feature: "数据存放位置", excel: "本地文件，不同步", airtable: "始终在他们的云上", mochi: "你的电脑或云端 — 你说了算" },
      { feature: "无需服务器和账号即可运行", excel: "Copilot 需要微软账号", airtable: "", mochi: "" },
      { feature: "每次写入都有版本、可追溯、可回滚", excel: "仅有撤销历史", airtable: "仅限付费套餐", mochi: "" },
      { feature: "实时协作 — 队友与智能体", excel: "需要 Microsoft 365", airtable: "", mochi: "" },
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
    headline: "为团队和 AI 智能体打造的本地优先数据空间。服务器费用为零。",
    sub: "搭建 CRM、人事、库存或任何内部工具 —— 不用写代码，不用写提示词，也没有每月的服务器账单。就在你的电脑上运行，点对点同步，并原生对接 Claude、OpenCode 和 Hermes-Agent。",
    badge: "本地优先 · 点对点 · AI 原生",
    ctaPrimary: "开始使用",
    ctaSecondary: "看看怎么用",
    copyLabel: "复制安装命令",
    trust: [
      { title: "无需服务器。", desc: "数据始终留在你自己的设备上。" },
      { title: "点对点同步。", desc: "离线可用，恢复联网后自动同步。" },
      { title: "默认私密。", desc: "传输全程加密，数据归你所有。" },
    ],
  },
  feat: {
    title: "智能体处理数据所需的一切",
    sub: "Mochi 把表格的简单、数据库的能力和 AI 的智能合到了一起。",
    items: [
      {
        title: "与 Claude、Codex 和 OpenCode 自然对话",
        desc: "直接用自然语言交流。Mochi 理解你的工作区上下文，并通过类型化工具替你操作数据。",
      },
      {
        title: "一条命令创建模板",
        desc: "为 CRM、HRM、库存和项目预置的架构，附带示例数据。",
      },
      {
        title: "MULTI-BRANCH · MULTI-USER · REALTIME DB",
        desc: "代理可以同时在多个分支上工作。实时更新直接流向实时数据库，不会发生冲突。",
      },
    ],
  },
  audit: { title: "可审计的无代码控制", desc: "智能体的每一次修改都会逐字段记录，筛选和分组用点击就能完成，不用写提示词。" },
  git: {
    title: "Git 驱动的存储控制与数据历史管理",
    items: [
      {
        title: "通过 Git 在线同步数据库",
        desc: "每次提交都会同时更新本地文件和托管数据库 —— 无需额外同步步骤，不会产生数据偏差。",
      },
      {
        title: "与智能体团队协作",
        desc: "两位同事，两条分支，一个共享工作区 —— Mochi 让每一次修改保持同步，没有合并冲突。",
      },
    ],
    agentLabel: "Mochi 智能体",
    syncedCaption: "自动同步，无需配置",
  },
  flow: {
    title: "三步搭建面向智能体的工作区",
    sub: "几分钟即可上手。无需服务器，无需复杂配置。",
    steps: [
      { title: "初始化工作区", desc: "选择一个预置模板。Mochi 在数秒内创建架构、关系和示例数据。" },
      { title: "与智能体对话", desc: "Claude、Codex 或 OpenCode 通过类型化工具操作数据——无需 SQL。" },
      { title: "提交到 Git", desc: "导出便于评审和对比的文本包。每个工作区一个分支。" },
    ],
  },
  tpl: {
    viewAll: "查看全部 →",
    title: "预置模板，按需定制",
    sub: "每个模板都自带架构、数据关系和示例数据——足以让智能体立即上手，又简单到可按你的需求调整。",
    items: [
      "集中管理客户往来，提高成交率",
      "在一个空间里管理人员、角色和考勤",
      "实时掌握库存、仓库和出入库流水",
      "协调任务，不用催也能按时交付",
    ],
  },
  char: {
    title: "认识 Mochi",
    sub: "一个小小的、圆滚滚、随时待命的伙伴——站在你的 AI 智能体和数据库之间。Mochi 从不替你做决定，只让每一次数据操作都简单、安全、易于追踪。",
  },
  price: {
    title: "选择你的方案",
    sub: "一个套餐，一次付费，终身属于你。",
    billed: "一次性付款，一次购买，永久使用。",
    popular: "最受欢迎",
    forever: "/永久",
    soon: "即将推出",
    getPro: "获取 Pro →",
    plans: [
      { tagline: "适合个人业余项目", features: ["3 个工作区", "仅限免费模板", "Git 包部署", "社区支持"] },
      { tagline: "适合独立开发者", features: ["无限工作区", "Mochi Table", "高级模板", "Git 包部署", "写入历史与回滚", "优先支持"] },
    ],
  },
  cta: { title: "准备好整理你的数据了吗？", sub: "几秒钟安装 Mochi，从你的第一个模板开始。", button: "开始使用 →" },
  footer: {
    tagline: "面向 Claude、Codex 和 OpenCode 的智能体原生数据伙伴。",
    product: "产品",
    developer: "开发者",
    company: "公司",
    copyright: "面向团队与智能体的数据工作空间。",
    status: "所有系统运行正常",
  },
  waitlist: {
    title: "免费套餐 — 即将推出",
    sub: "开放当天我们会发邮件通知你，仅此而已。",
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
    repoHome: "GitHub — Home",
    discussions: "Thảo luận",
    mcp: "Tích hợp MCP",
    about: "Về Mochi",
    star: "Gắn sao trên GitHub",
    menu: "Menu",
    openMenu: "Mở menu",
  },
  eyebrow: {
    flow: "Cách hoạt động",
    feat: "Tính năng",
    views: "Chế độ xem",
    tpl: "Mẫu có sẵn",
    char: "Vì sao chọn Mochi",
    compare: "So với Excel + Copilot và Airtable",
    price: "Bảng giá",
    step: "Bước",
  },
  views: {
    title: "Một bộ dữ liệu, đủ mọi cách nhìn mà team bạn cần",
    sub: "Lưới, Kanban, Lịch, Thư viện, Biểu đồ — tất cả đọc cùng một tập bản ghi. Đổi cách xem mà không phải sao chép dữ liệu hay dựng lại từ đầu.",
    shots: ["Khách tiềm năng — Theo trạng thái", "Đơn hàng — Theo ngày đặt", "Sản phẩm — Dạng thẻ", "Công việc — Theo mức ưu tiên", "Khách tiềm năng — Theo nguồn"],
  },
  compare: {
    yes: "Có",
    no: "Không",
    rows: [
      { feature: "Agent AI đọc và ghi dữ liệu một cách tự nhiên", excel: "Chỉ gợi ý công thức", airtable: "", mochi: "" },
      { feature: "Dữ liệu nằm ở đâu", excel: "Tệp trên máy, không đồng bộ", airtable: "Luôn nằm trên cloud của họ", mochi: "Máy bạn hoặc cloud — bạn quyết" },
      { feature: "Chạy được mà không cần server hay tài khoản", excel: "Copilot đòi tài khoản Microsoft", airtable: "", mochi: "" },
      { feature: "Mọi thao tác ghi đều có phiên bản, truy vết và hoàn tác được", excel: "Chỉ có lịch sử hoàn tác", airtable: "Chỉ có ở gói trả phí", mochi: "" },
      { feature: "Cộng tác thời gian thực — cả người lẫn agent", excel: "Cần Microsoft 365", airtable: "", mochi: "" },
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
    headline: "Không gian dữ liệu local-first cho team và agent AI của bạn. Không tốn một đồng phí server.",
    sub: "Tự xây CRM, HR, kho vận hay bất kỳ công cụ nội bộ nào — không cần code, không cần prompt, không cần thuê server hàng tháng. Chạy ngay trên laptop, đồng bộ ngang hàng với đồng đội, và tương thích sẵn với Claude, OpenCode và Hermes-Agent.",
    badge: "Local-first · Ngang hàng · Thuần AI",
    ctaPrimary: "Bắt đầu",
    ctaSecondary: "Xem cách hoạt động",
    copyLabel: "Sao chép lệnh cài đặt",
    trust: [
      { title: "Không cần server.", desc: "Dữ liệu nằm lại trên máy của bạn." },
      { title: "Đồng bộ ngang hàng.", desc: "Chạy offline. Có mạng lại là đồng bộ." },
      { title: "Riêng tư mặc định.", desc: "Mã hoá khi truyền. Dữ liệu là của bạn." },
    ],
  },
  feat: {
    title: "Một workspace cho cả team và AI agent của bạn",
    sub: "Mochi gộp lại sự đơn giản của bảng tính, sức mạnh của cơ sở dữ liệu và trí thông minh của AI.",
    items: [
      {
        title: "Trò chuyện với Claude, Codex & OpenCode",
        desc: "AI agent thao tác dữ liệu qua MCP tool có kiểu — an toàn, có audit, lưu trên Git. Mọi thay đổi đều xem được dạng diff.",
      },
      {
        title: "Thiết kế dữ liệu, không cần code, không cần prompt",
        desc: "Chọn template — CRM, HR, kho vận, dự án — hoặc mô tả bảng bằng Markdown. Mochi tự dựng schema, quan hệ và dữ liệu mẫu.",
      },
      {
        title: "Cộng tác thời gian thực cả team",
        desc: "Đồng đội dùng chung workspace qua đồng bộ P2P. Cùng chỉnh sửa, không server cloud, không tính phí theo đầu người.",
      },
      {
        title: "Chạy trên laptop — không tốn phí server",
        desc: "Dữ liệu nằm trên máy bạn. Không phí hosting, không lock-in SaaS, không chờ IT dựng database.",
      },
      {
        title: "Undo bất kỳ lúc nào, giữ nguyên lịch sử",
        desc: "Mọi chỉnh sửa được version trên Git. Xem ai đã đổi gì, và rollback về trạng thái trước chỉ với một lệnh.",
      },
    ],
  },
  audit: { title: "Kiểm soát được, truy vết được, không cần code", desc: "Mọi thay đổi của agent đều được ghi lại theo từng trường, còn bộ lọc và nhóm thì tạo bằng cách bấm chuột chứ không phải viết prompt." },
  git: {
    title: "Kiểm soát lưu trữ DB trên Git & quản lý lịch sử dữ liệu",
    items: [
      {
        title: "Đồng bộ database online qua Git",
        desc: "Mỗi commit cập nhật cả file local lẫn database online cùng lúc — không cần bước đồng bộ riêng, không lệch dữ liệu.",
      },
      {
        title: "Cộng tác nhóm với agent",
        desc: "Hai người, hai nhánh, một workspace chung — Mochi giữ mọi thay đổi đồng bộ, không xung đột merge.",
      },
    ],
    agentLabel: "Mochi agent",
    syncedCaption: "tự động đồng bộ, không cần cấu hình",
  },
  flow: {
    title: "Ba bước có ngay workspace cho team",
    sub: "Vài phút là xong. Không server, không cấu hình rườm rà.",
    steps: [
      { title: "Cài đặt Mochi", desc: "Chỉ một lệnh. Miễn phí bắt đầu. Chạy trên Mac, Linux và Windows." },
      { title: "Chọn template", desc: "Bắt đầu từ CRM, HR, kho vận, dự án — hoặc canvas trắng tùy bạn." },
      { title: "Bắt đầu công việc với data của bạn", desc: "Trò chuyện với agent — Mochi đọc, ghi và tổ chức dữ liệu thay bạn." },
    ],
  },
  tpl: {
    viewAll: "Xem tất cả →",
    title: "Template cho đúng công cụ team bạn cần",
    sub: "Dù bạn làm sales, HR, vận hành hay điều phối dự án — bắt đầu từ template có sẵn schema, quan hệ và dữ liệu mẫu. Tùy biến bằng ngôn ngữ đời thường, hoặc để agent làm hộ.",
    items: [
      "Gom mọi tương tác với khách về một chỗ để chốt đơn nhanh hơn",
      "Quản lý nhân sự, vai trò và chấm công trong cùng một nơi",
      "Theo dõi tồn kho, kho bãi và xuất nhập theo thời gian thực",
      "Điều phối công việc, giao đúng hạn mà không phải đi giục",
    ],
  },
  char: {
    title: "Gặp gỡ Mochi",
    sub: "Một trợ lý nhỏ, tròn trịa và luôn sẵn sàng — đứng giữa team bạn, AI agent và dữ liệu. Mochi không thay bạn quyết định, chỉ giúp mọi thao tác dữ liệu trở nên đơn giản, an toàn và dễ theo dõi.",
  },
  price: {
    title: "Chọn gói của bạn",
    sub: "Một gói, trả một lần, dùng mãi mãi.",
    billed: "Thanh toán một lần. Trả một lần, dùng mãi mãi.",
    popular: "PHỔ BIẾN NHẤT",
    forever: "/trọn đời",
    soon: "Sắp có",
    getPro: "Mua Pro →",
    plans: [
      { tagline: "Cho dự án cá nhân", features: ["3 workspace", "Chỉ dùng template miễn phí", "Deploy bundle Git", "Hỗ trợ cộng đồng"] },
      { tagline: "Cho nhà phát triển cá nhân", features: ["Workspace không giới hạn", "Mochi Table", "Template cao cấp", "Deploy bundle Git", "Lịch sử ghi & rollback", "Hỗ trợ ưu tiên"] },
    ],
  },
  cta: { title: "Sẵn sàng sắp xếp lại dữ liệu chưa?", sub: "Cài đặt Mochi trong vài giây — không server, không prompt, không lock-in.", button: "Bắt đầu →" },
  footer: {
    tagline: "Không gian dữ liệu cho cả team — không phí server, không lock-in, sẵn sàng cho AI.",
    product: "Sản phẩm",
    developer: "Nhà phát triển",
    company: "Công ty",
    copyright: "Không gian dữ liệu cho team và agent.",
    status: "Mọi hệ thống hoạt động bình thường",
  },
  waitlist: {
    title: "Gói Free — sắp ra mắt",
    sub: "Mở là chúng tôi gửi email cho bạn ngay. Không gửi gì khác.",
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
