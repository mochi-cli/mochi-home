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
export interface Messages {
  scripts: any;
  db: any;
  hero: { headline: string; sub: string };
  feat: { title: string; items: Feature[] };
  git: { title: string; items: Feature[]; agentLabel: string; syncedCaption: string };
  flow: { title: string; steps: Step[] };
  tpl: { title: string; sub: string; items: string[] };
  char: { title: string; sub: string };
  price: { title: string; sub: string; billed: string; popular: string; plans: Plan[] };
  cta: { sub: string };
  footer: { tagline: string };
  success: { title: string; sub: string; order: string; cta: string; back: string; note: string };
}

const en: Messages = {

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
    sub: "Build CRM, HR, inventory, or any internal tool — no code, no prompts, no monthly server fees. Runs on your laptop, syncs peer-to-peer, and works natively with Claude, Codex, and OpenCode.",
  },
  feat: {
    title: "One workspace for your team and your AI agents",
    items: [
      {
        title: "Chat with Claude, Codex & OpenCode",
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
    steps: [
      { title: "Install Mochi", desc: "One command. Free to start. Works on Mac, Linux, and Windows." },
      { title: "Pick a template", desc: "Start from CRM, HR, Inventory, Projects, or a blank canvas." },
      { title: "Start working with your data", desc: "Talk to your agent — Mochi reads, writes, and organizes it for you." },
    ],
  },
  tpl: {
    title: "Templates for the tools you actually need",
    sub: "Whether you run sales, HR, ops, or a project team — start from a template with schema, relations, and sample data. Customize in plain language, or let your agent do it.",
    items: [
      "Customers, sales opportunities, interaction history",
      "People, departments, attendance, reviews",
      "Products, stock, real-time in/out flow",
      "Tasks, progress, members, deadlines",
    ],
  },
  char: {
    title: "Meet Mochi",
    sub: "A small, round, always-ready sidekick — standing between your team, your AI agents, and your data. Mochi never decides for you; it just makes every data operation simple, safe, and easy to track.",
  },
  price: {
    title: "Choose your plan",
    sub: "Start free. Level up when your team grows.",
    billed: "One-time payment. Pay once, use forever.",
    popular: "MOST POPULAR",
    plans: [
      { tagline: "For solo hobby projects", features: ["3 workspaces", "Free templates only", "Git bundle deploy", "Community support"] },
      { tagline: "For individual builders", features: ["Unlimited workspaces", "Mochi Table", "Premium templates", "Git bundle deploy", "Write history & rollback", "Priority support"] },
    ],
  },
  cta: { sub: "Install Mochi in seconds — no server, no prompts, no lock-in." },
  footer: { tagline: "Your team's data workspace — no server bills, no lock-in, agent-ready." },
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
    headline: "Deja que tus agentes de IA hablen con tus datos",
    sub: "Mochi convierte database en un espacio de trabajo nativo para agentes: crea una plantilla con un solo comando, opera tus datos en lenguaje natural y guárdalos con seguridad en Git.",
  },
  feat: {
    title: "Todo lo que tu agente necesita para trabajar con datos",
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
    steps: [
      { title: "Inicializa un espacio de trabajo", desc: "Elige una plantilla lista. Mochi crea el esquema, las relaciones y los datos de ejemplo en segundos." },
      { title: "Chatea con tu agente", desc: "Claude, Codex u OpenCode operan los datos con herramientas tipadas, sin escribir SQL." },
      { title: "Sube a Git", desc: "Exporta un paquete de texto fácil de revisar y comparar. Una rama por espacio de trabajo." },
    ],
  },
  tpl: {
    title: "Plantillas para las herramientas que realmente necesitas",
    sub: "Ya sea que gestiones ventas, RRHH, operaciones o un equipo de proyecto — empieza desde una plantilla con esquema, relaciones y datos de ejemplo. Personaliza en lenguaje natural o deja que tu agente lo haga.",
    items: [
      "Clientes, oportunidades de venta, historial de interacciones",
      "Personas, departamentos, asistencia, evaluaciones",
      "Productos, stock, flujo de entrada/salida en tiempo real",
      "Tareas, progreso, miembros, plazos",
    ],
  },
  char: {
    title: "Conoce a Mochi",
    sub: "Un pequeño compañero redondo y siempre listo, entre tus agentes de IA y tu base de datos. Mochi nunca decide por ti; solo hace que cada operación de datos sea simple, segura y fácil de seguir.",
  },
  price: {
    title: "Elige tu plan",
    sub: "Empieza gratis. Sube de nivel cuando quieras.",
    billed: "Pago único. Paga una vez, úsalo para siempre.",
    popular: "MÁS POPULAR",
    plans: [
      { tagline: "Para proyectos personales", features: ["3 espacios de trabajo", "Solo plantillas gratuitas", "Despliegue de paquete Git", "Soporte de la comunidad"] },
      { tagline: "Para creadores individuales", features: ["Espacios ilimitados", "Mochi Table", "Plantillas premium", "Despliegue de paquete Git", "Historial y reversión", "Soporte prioritario"] },
    ],
  },
  cta: { sub: "Instala Mochi en segundos y empieza con tu primera plantilla." },
  footer: { tagline: "El compañero de datos nativo para agentes: Claude, Codex y OpenCode." },
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
    headline: "Laissez vos agents IA dialoguer avec vos données",
    sub: "Mochi transforme database en un espace de travail natif pour agents : créez un modèle en une commande, manipulez vos données en langage naturel et validez-les en toute sécurité sur Git.",
  },
  feat: {
    title: "Tout ce dont votre agent a besoin pour travailler avec les données",
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
    steps: [
      { title: "Initialisez un espace de travail", desc: "Choisissez un modèle prêt. Mochi crée le schéma, les relations et les données d'exemple en quelques secondes." },
      { title: "Discutez avec votre agent", desc: "Claude, Codex ou OpenCode manipulent les données via des outils typés — sans SQL." },
      { title: "Validez sur Git", desc: "Exportez un bundle texte facile à relire et à comparer. Une branche par espace de travail." },
    ],
  },
  tpl: {
    title: "Des modèles prêts à l'emploi, personnalisables au besoin",
    sub: "Chaque modèle est livré avec un schéma, des relations de données et des données d'exemple — assez pour démarrer tout de suite, assez simple pour l'adapter à vos besoins.",
    items: [
      "Clients, opportunités de vente, historique des interactions",
      "Personnes, services, présence, évaluations",
      "Produits, stock, entrées/sorties en temps réel",
      "Tâches, avancement, membres, échéances",
    ],
  },
  char: {
    title: "Voici Mochi",
    sub: "Un petit compagnon tout rond et toujours prêt, entre vos agents IA et votre base de données. Mochi ne décide jamais à votre place ; il rend simplement chaque opération sur les données simple, sûre et facile à suivre.",
  },
  price: {
    title: "Choisissez votre formule",
    sub: "Commencez gratuitement. Passez au niveau supérieur quand vous voulez.",
    billed: "Paiement unique. Payez une fois, utilisez à vie.",
    popular: "LE PLUS POPULAIRE",
    plans: [
      { tagline: "Pour les projets perso", features: ["3 espaces de travail", "Modèles gratuits uniquement", "Déploiement de bundle Git", "Support communautaire"] },
      { tagline: "Pour les créateurs individuels", features: ["Espaces illimités", "Mochi Table", "Modèles premium", "Déploiement de bundle Git", "Historique et retour arrière", "Support prioritaire"] },
    ],
  },
  cta: { sub: "Installez Mochi en quelques secondes et démarrez avec votre premier modèle." },
  footer: { tagline: "Le compagnon de données natif pour agents : Claude, Codex et OpenCode." },
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
    headline: "Lass deine KI-Agenten mit deinen Daten sprechen",
    sub: "Mochi macht database zu einem agentennativen Workspace: Erstelle eine Vorlage mit einem Befehl, bearbeite deine Daten in natürlicher Sprache und committe sie sicher zu Git.",
  },
  feat: {
    title: "Alles, was dein Agent für die Arbeit mit Daten braucht",
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
    steps: [
      { title: "Workspace initialisieren", desc: "Wähle eine fertige Vorlage. Mochi erstellt Schema, Relationen und Beispieldaten in Sekunden." },
      { title: "Mit deinem Agenten chatten", desc: "Claude, Codex oder OpenCode bearbeiten Daten über typisierte Tools – ohne SQL." },
      { title: "Zu Git committen", desc: "Exportiere ein textbasiertes Bundle, das sich leicht prüfen und vergleichen lässt. Ein Branch pro Workspace." },
    ],
  },
  tpl: {
    title: "Fertige Vorlagen, bei Bedarf anpassbar",
    sub: "Jede Vorlage kommt mit Schema, Datenrelationen und Beispieldaten – genug, damit dein Agent sofort loslegt, einfach genug für deine Anpassungen.",
    items: [
      "Kunden, Verkaufschancen, Interaktionsverlauf",
      "Personen, Abteilungen, Anwesenheit, Bewertungen",
      "Produkte, Bestand, Zu-/Abgänge in Echtzeit",
      "Aufgaben, Fortschritt, Mitglieder, Fristen",
    ],
  },
  char: {
    title: "Das ist Mochi",
    sub: "Ein kleiner, runder, stets bereiter Begleiter – zwischen deinen KI-Agenten und deiner Datenbank. Mochi entscheidet nie für dich; es macht jede Datenoperation nur einfach, sicher und leicht nachvollziehbar.",
  },
  price: {
    title: "Wähle deinen Plan",
    sub: "Kostenlos starten. Aufsteigen, wenn du bereit bist.",
    billed: "Einmalzahlung. Einmal zahlen, für immer nutzen.",
    popular: "AM BELIEBTESTEN",
    plans: [
      { tagline: "Für private Hobbyprojekte", features: ["3 Workspaces", "Nur kostenlose Vorlagen", "Git-Bundle-Deploy", "Community-Support"] },
      { tagline: "Für einzelne Entwickler", features: ["Unbegrenzte Workspaces", "Mochi Table", "Premium-Vorlagen", "Git-Bundle-Deploy", "Schreibverlauf & Rollback", "Priorisierter Support"] },
    ],
  },
  cta: { sub: "Installiere Mochi in Sekunden und starte mit deiner ersten Vorlage." },
  footer: { tagline: "Der agentennative Datenbegleiter für Claude, Codex und OpenCode." },
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
    headline: "AIエージェントをあなたのデータと対話させよう",
    sub: "Mochiはdatabaseをエージェントネイティブなワークスペースに変えます。1つのコマンドでテンプレートを作成し、自然言語でデータを操作し、安全にGitへコミットできます。",
  },
  feat: {
    title: "エージェントがデータを扱うために必要なすべて",
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
    steps: [
      { title: "ワークスペースを初期化", desc: "既製テンプレートを選ぶだけ。Mochiがスキーマ・リレーション・サンプルデータを数秒で作成します。" },
      { title: "エージェントと対話", desc: "Claude・Codex・OpenCodeが型付きツールでデータを操作。SQLは不要です。" },
      { title: "Gitへコミット", desc: "レビューや差分が容易なテキストバンドルを書き出します。ワークスペースごとに1ブランチ。" },
    ],
  },
  tpl: {
    title: "既製テンプレート、必要に応じてカスタマイズ",
    sub: "各テンプレートにはスキーマ・データリレーション・サンプルデータが付属。エージェントがすぐ動き出せて、あなたのニーズに合わせて簡単に調整できます。",
    items: [
      "顧客、商談、対応履歴",
      "従業員、部署、勤怠、評価",
      "商品、在庫、リアルタイムの入出庫",
      "タスク、進捗、メンバー、期限",
    ],
  },
  char: {
    title: "Mochiを紹介",
    sub: "小さくて丸い、いつでも頼れる相棒。AIエージェントとデータベースの間に立ちます。Mochiが代わりに判断することはなく、すべてのデータ操作をシンプルで安全、追跡しやすくします。",
  },
  price: {
    title: "プランを選ぶ",
    sub: "無料で始めて、必要になったらレベルアップ。",
    billed: "一度きりのお支払い。一度払えば、ずっと使えます。",
    popular: "一番人気",
    plans: [
      { tagline: "個人の趣味プロジェクト向け", features: ["ワークスペース3つ", "無料テンプレートのみ", "Gitバンドルデプロイ", "コミュニティサポート"] },
      { tagline: "個人開発者向け", features: ["ワークスペース無制限", "Mochi Table", "プレミアムテンプレート", "Gitバンドルデプロイ", "書き込み履歴とロールバック", "優先サポート"] },
    ],
  },
  cta: { sub: "数秒でMochiをインストールして、最初のテンプレートから始めましょう。" },
  footer: { tagline: "Claude・Codex・OpenCodeのためのエージェントネイティブなデータ相棒。" },
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
    headline: "让你的 AI 智能体与数据对话",
    sub: "Mochi 把 database 变成面向智能体的工作区：一条命令创建模板，用自然语言操作数据，并安全地提交到 Git。",
  },
  feat: {
    title: "智能体处理数据所需的一切",
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
    steps: [
      { title: "初始化工作区", desc: "选择一个预置模板。Mochi 在数秒内创建架构、关系和示例数据。" },
      { title: "与智能体对话", desc: "Claude、Codex 或 OpenCode 通过类型化工具操作数据——无需 SQL。" },
      { title: "提交到 Git", desc: "导出便于评审和对比的文本包。每个工作区一个分支。" },
    ],
  },
  tpl: {
    title: "预置模板，按需定制",
    sub: "每个模板都自带架构、数据关系和示例数据——足以让智能体立即上手，又简单到可按你的需求调整。",
    items: [
      "客户、销售机会、互动记录",
      "人员、部门、考勤、评估",
      "商品、库存、实时出入库",
      "任务、进度、成员、截止日期",
    ],
  },
  char: {
    title: "认识 Mochi",
    sub: "一个小小的、圆滚滚、随时待命的伙伴——站在你的 AI 智能体和数据库之间。Mochi 从不替你做决定，只让每一次数据操作都简单、安全、易于追踪。",
  },
  price: {
    title: "选择你的方案",
    sub: "免费开始，准备好再升级。",
    billed: "一次性付款，一次购买，永久使用。",
    popular: "最受欢迎",
    plans: [
      { tagline: "适合个人业余项目", features: ["3 个工作区", "仅限免费模板", "Git 包部署", "社区支持"] },
      { tagline: "适合独立开发者", features: ["无限工作区", "Mochi Table", "高级模板", "Git 包部署", "写入历史与回滚", "优先支持"] },
    ],
  },
  cta: { sub: "几秒钟安装 Mochi，从你的第一个模板开始。" },
  footer: { tagline: "面向 Claude、Codex 和 OpenCode 的智能体原生数据伙伴。" },
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
    headline: "Không gian dữ liệu cho cả team, không tốn phí server",
    sub: "Tự xây CRM, HR, kho vận hay bất kỳ công cụ nội bộ nào — không cần code, không cần prompt, không cần thuê server hàng tháng. Chạy ngay trên laptop, đồng bộ P2P với đồng đội, và tương thích sẵn với Claude, Codex, OpenCode.",
  },
  feat: {
    title: "Một workspace cho cả team và AI agent của bạn",
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
    steps: [
      { title: "Cài đặt Mochi", desc: "Chỉ một lệnh. Miễn phí bắt đầu. Chạy trên Mac, Linux và Windows." },
      { title: "Chọn template", desc: "Bắt đầu từ CRM, HR, kho vận, dự án — hoặc canvas trắng tùy bạn." },
      { title: "Bắt đầu công việc với data của bạn", desc: "Trò chuyện với agent — Mochi đọc, ghi và tổ chức dữ liệu thay bạn." },
    ],
  },
  tpl: {
    title: "Template cho đúng công cụ team bạn cần",
    sub: "Dù bạn làm sales, HR, vận hành hay điều phối dự án — bắt đầu từ template có sẵn schema, quan hệ và dữ liệu mẫu. Tùy biến bằng ngôn ngữ đời thường, hoặc để agent làm hộ.",
    items: [
      "Khách hàng, cơ hội bán hàng, lịch sử tương tác",
      "Nhân sự, phòng ban, chấm công, đánh giá",
      "Sản phẩm, tồn kho, nhập xuất thời gian thực",
      "Task, tiến độ, thành viên, deadline",
    ],
  },
  char: {
    title: "Gặp gỡ Mochi",
    sub: "Một trợ lý nhỏ, tròn trịa và luôn sẵn sàng — đứng giữa team bạn, AI agent và dữ liệu. Mochi không thay bạn quyết định, chỉ giúp mọi thao tác dữ liệu trở nên đơn giản, an toàn và dễ theo dõi.",
  },
  price: {
    title: "Chọn gói của bạn",
    sub: "Bắt đầu miễn phí. Nâng cấp khi team lớn hơn.",
    billed: "Thanh toán một lần. Trả một lần, dùng mãi mãi.",
    popular: "PHỔ BIẾN NHẤT",
    plans: [
      { tagline: "Cho dự án cá nhân", features: ["3 workspace", "Chỉ dùng template miễn phí", "Deploy bundle Git", "Hỗ trợ cộng đồng"] },
      { tagline: "Cho nhà phát triển cá nhân", features: ["Workspace không giới hạn", "Mochi Table", "Template cao cấp", "Deploy bundle Git", "Lịch sử ghi & rollback", "Hỗ trợ ưu tiên"] },
    ],
  },
  cta: { sub: "Cài đặt Mochi trong vài giây — không server, không prompt, không lock-in." },
  footer: { tagline: "Không gian dữ liệu cho cả team — không phí server, không lock-in, sẵn sàng cho AI." },
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
