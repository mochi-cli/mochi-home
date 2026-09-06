"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  ArrowUp,
  Calendar,
  CircleCheck,
  CircleDot,
  GitBranch,
  GitCommit,
  Hash,
  MessageSquare,
  Type,
  Users,
  X,
} from "lucide-react";
import { useLang } from "./LanguageProvider";
import MochiConsole, { type Line } from "./MochiConsole";
import AuditHistory from "./AuditHistory";
import FilterBuilder from "./FilterBuilder";
import PromptToTable from "./PromptToTable";
import MacDock from "./MacDock";
import CanvasSection, { Captions } from "./CanvasSection";
import {
  AppTabs,
  AppToolbar,
  Box,
  Cell,
  Chip,
  type Collection,
  HeadCell,
  Pill,
  type Tone,
} from "./appui";

const GIT_COLLECTIONS: Collection[] = [
  { name: "Customers", tone: "amber", icon: Users },
  { name: "Interactions", tone: "lilac", icon: MessageSquare },
  { name: "Leads", tone: "green", icon: CircleCheck },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type RowState = "staged" | "pushed" | "merged" | "reverted";
type DBRow = {
  id: string;
  name: string;
  phone: string;
  source: string;
  branch: string;
  updated: string;
  status: RowState;
};
type LiveLog = {
  id: string;
  branch: string;
  msg: string;
  type: "commit" | "push" | "revert";
};
type DB = {
  userA: string;
  userB: string;
  branchAName: string;
  branchBName: string;
  title: string;
  live: string;
  watching: string;
  statusStaged: string;
  statusPushed: string;
  statusReverted: string;
  statusMerged: string;
  eventsTitle: string;
  eventsEmpty: string;
  dataA: {
    id: string;
    name: string;
    phone: string;
    source: string;
    msgC: string;
    msgP: string;
  };
  dataB: {
    id: string;
    name: string;
    phone: string;
    source: string;
    msgC: string;
    msgR: string;
  };
};

const STATE_TONE: Record<RowState, Tone> = {
  staged: "amber",
  pushed: "blue",
  merged: "mint",
  reverted: "rose",
};

// ─── the git workspace: one big grid, two agents writing into it ─────────────
// Records that already live on main before the demo runs. Without these the
// grid sits empty for the ~14s the consoles spend typing their way to a first
// commit, which reads as a broken table rather than a waiting one.
const SEED_ROWS: DBRow[] = [
  {
    id: "C-101",
    name: "Priya Nair",
    phone: "0911223344",
    source: "event",
    branch: "main",
    updated: "02/14/2026",
    status: "merged",
  },
  {
    id: "C-104",
    name: "Leo Fischer",
    phone: "0977001122",
    source: "twitter",
    branch: "main",
    updated: "03/02/2026",
    status: "merged",
  },
  {
    id: "C-107",
    name: "Grace Osei",
    phone: "0966332211",
    source: "referral",
    branch: "main",
    updated: "03/28/2026",
    status: "merged",
  },
  {
    id: "C-110",
    name: "Hugo Marchand",
    phone: "0902114477",
    source: "website",
    branch: "main",
    updated: "04/16/2026",
    status: "merged",
  },
  {
    id: "C-113",
    name: "Yuki Tanabe",
    phone: "0955889900",
    source: "event",
    branch: "main",
    updated: "05/09/2026",
    status: "merged",
  },
  {
    id: "C-116",
    name: "Nora Haddad",
    phone: "0933441188",
    source: "twitter",
    branch: "main",
    updated: "06/01/2026",
    status: "merged",
  },
  {
    id: "C-118",
    name: "Ana",
    phone: "0905551122",
    source: "referral",
    branch: "main",
    updated: "06/22/2026",
    status: "merged",
  },
  {
    id: "C-119",
    name: "Tom",
    phone: "0938774410",
    source: "website",
    branch: "main",
    updated: "07/05/2026",
    status: "merged",
  },
];

const SOURCE_TONE: Record<string, Tone> = {
  referral: "lilac",
  website: "blue",
  event: "amber",
  twitter: "green",
  facebook: "rose",
};

function GitWorkspace({
  m,
  syncedCaption,
}: {
  m: { db: DB; scripts: { branchA: Line[]; branchB: Line[] } };
  syncedCaption: string;
}) {
  const { db } = m;
  const [rows, setRows] = useState<DBRow[]>(SEED_ROWS);
  const [logs, setLogs] = useState<LiveLog[]>([]);
  // A console restarting its script shouldn't blank the table straight away:
  // it takes ~14s to type its way back to the first commit, and an empty grid
  // for most of the loop reads as broken. Defer the wipe until new data lands.
  const pendingClear = useRef(false);

  useEffect(() => {
    const takeClear = () => {
      if (!pendingClear.current) return false;
      pendingClear.current = false;
      return true;
    };
    const handleReset = () => {
      pendingClear.current = true;
    };

    const add = (
      data: { id: string; name: string; phone: string; source: string },
      branch: string,
      msg: string,
    ) => {
      const clear = takeClear();
      const row: DBRow = {
        ...data,
        branch,
        updated: "08/12/2026",
        status: "staged",
      };
      setRows((r) => {
        const base = clear ? SEED_ROWS : r;
        return base.find((x) => x.id === row.id) ? base : [...base, row];
      });
      setLogs((l) => [
        ...(clear ? [] : l),
        { id: `${branch}-${Date.now()}`, branch, msg, type: "commit" },
      ]);
    };

    const handleA = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "commit-A") add(db.dataA, db.branchAName, db.dataA.msgC);
      if (detail === "push-A") {
        setRows((r) =>
          r.map((x) => (x.id === db.dataA.id ? { ...x, status: "pushed" } : x)),
        );
        setLogs((l) => [
          ...l,
          {
            id: `push-${Date.now()}`,
            branch: db.branchAName,
            msg: db.dataA.msgP,
            type: "push",
          },
        ]);
      }
    };
    const handleB = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "commit-B") add(db.dataB, db.branchBName, db.dataB.msgC);
      if (detail === "revert-B") {
        setRows((r) =>
          r.map((x) =>
            x.id === db.dataB.id ? { ...x, status: "reverted" } : x,
          ),
        );
        setLogs((l) => [
          ...l,
          {
            id: `revert-${Date.now()}`,
            branch: db.branchBName,
            msg: db.dataB.msgR,
            type: "revert",
          },
        ]);
      }
    };

    window.addEventListener("mochi-reset-branch-a", handleReset);
    window.addEventListener("mochi-reset-branch-b", handleReset);
    window.addEventListener("mochi-action-branch-a", handleA);
    window.addEventListener("mochi-action-branch-b", handleB);
    return () => {
      window.removeEventListener("mochi-reset-branch-a", handleReset);
      window.removeEventListener("mochi-reset-branch-b", handleReset);
      window.removeEventListener("mochi-action-branch-a", handleA);
      window.removeEventListener("mochi-action-branch-b", handleB);
    };
  }, [db]);

  const statusLabel = (s: RowState) =>
    s === "merged"
      ? db.statusMerged
      : s === "pushed"
        ? db.statusPushed
        : s === "reverted"
          ? db.statusReverted
          : db.statusStaged;

  const line = { borderColor: "var(--app-line)" };

  return (
    // The dock straddles the window's bottom edge, the same way it does under
    // the hero: this is two people on one machine, not a diagram.
    <div className="relative pb-8">
      <div className="canvas appui relative">
        <AppTabs tabs={GIT_COLLECTIONS} active="Customers" />
        <AppToolbar view="Grid view" />

        <div className="h-[360px] overflow-auto sm:h-[440px] lg:h-[560px]">
          <table className="w-full min-w-[54rem] border-collapse">
            <thead>
              <tr style={{ background: "var(--app-bg)" }}>
                <th
                  className="border-b border-r px-3 py-2"
                  style={{ ...line, width: 36 }}
                >
                  <Box />
                </th>
                <th
                  className="border-b border-r px-2 py-2 text-right text-[11px] font-normal"
                  style={{ ...line, color: "var(--app-faint)", width: 40 }}
                >
                  #
                </th>
                <HeadCell icon={Type} tag="primary" width={122}>
                  Customer_ID
                </HeadCell>
                <HeadCell icon={AlignLeft} width={150}>
                  Name
                </HeadCell>
                <HeadCell icon={Hash} width={134}>
                  Phone
                </HeadCell>
                <HeadCell icon={CircleDot} width={118}>
                  Source
                </HeadCell>
                <HeadCell icon={GitBranch}>Branch</HeadCell>
                <HeadCell icon={CircleDot} width={124}>
                  Sync
                </HeadCell>
                <HeadCell icon={Calendar} width={122}>
                  Updated
                </HeadCell>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className="animate-row-in"
                  style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                >
                  <Cell width={36}>
                    <Box />
                  </Cell>
                  <Cell width={40} className="text-right">
                    <span
                      className="text-[11px] tabular-nums"
                      style={{ color: "var(--app-faint)" }}
                    >
                      {i + 1}
                    </span>
                  </Cell>
                  <Cell width={122}>
                    <span className="flex items-center gap-2">
                      <Chip tone="amber" letter="C" />
                      <span className="mono text-[12px]">{r.id}</span>
                    </span>
                  </Cell>
                  <Cell width={150}>
                    <span className="text-[12.5px]">{r.name}</span>
                  </Cell>
                  <Cell width={134}>
                    <span className="mono text-[12px]">{r.phone}</span>
                  </Cell>
                  <Cell width={118}>
                    <Pill tone={SOURCE_TONE[r.source] ?? "blue"}>
                      {r.source}
                    </Pill>
                  </Cell>
                  <Cell>
                    <span className="mono flex items-center gap-1.5 text-[12px]">
                      <GitBranch
                        className="h-3 w-3 flex-none"
                        strokeWidth={1.8}
                        style={{ color: "var(--app-faint)" }}
                      />
                      {r.branch}
                    </span>
                  </Cell>
                  <Cell width={124}>
                    <Pill tone={STATE_TONE[r.status]}>
                      {statusLabel(r.status)}
                    </Pill>
                  </Cell>
                  <Cell width={122}>
                    <span className="mono text-[12px]">{r.updated}</span>
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>

          {logs.length > 0 && (
            <div className="space-y-1.5 px-4 py-3">
              <div
                className="mono mb-1 text-[10px]"
                style={{ color: "var(--app-faint)" }}
              >
                {db.eventsTitle}
              </div>
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="mono flex animate-in fade-in items-center gap-2 text-[11px] duration-300"
                >
                  {log.type === "revert" ? (
                    <X
                      className="h-3 w-3"
                      strokeWidth={2}
                      style={{ color: "var(--pill-rose-fg)" }}
                    />
                  ) : log.type === "push" ? (
                    <ArrowUp
                      className="h-3 w-3"
                      strokeWidth={2}
                      style={{ color: "var(--pill-mint-fg)" }}
                    />
                  ) : (
                    <GitCommit
                      className="h-3 w-3"
                      strokeWidth={2}
                      style={{ color: "var(--app-faint)" }}
                    />
                  )}
                  <span style={{ color: "var(--app-faint)" }}>
                    [{log.branch}]
                  </span>
                  <span
                    className={log.type === "revert" ? "line-through" : ""}
                    style={{
                      color:
                        log.type === "revert"
                          ? "var(--pill-rose-fg)"
                          : "var(--app-text)",
                    }}
                  >
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex h-[38px] items-center border-t px-4" style={line}>
          <span
            className="mono text-[11px]"
            style={{ color: "var(--app-faint)" }}
          >
            {syncedCaption}
          </span>
        </div>

        {/* Two teammates, docked into the same window on opposite sides, writing
          into the grid between them. */}
        <MochiConsole
          customScript={m.scripts.branchA}
          heightClass="h-[208px] lg:h-[196px]"
          consoleId="branch-a"
          floating="left"
          agentLabel={db.userA}
          status={db.branchAName}
        />
        <MochiConsole
          customScript={m.scripts.branchB}
          heightClass="h-[208px] lg:h-[196px]"
          consoleId="branch-b"
          initialDelay={3500}
          floating="right"
          agentLabel={db.userB}
          status={db.branchBName}
        />
      </div>
      <MacDock className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 sm:flex" />
    </div>
  );
}

// ─── the three sections ───────────────────────────────────────────────────────
export default function AINative() {
  const { m } = useLang();

  return (
    <>
      <CanvasSection
        id="features"
        kicker={m.eyebrow.feat}
        title={m.feat.title}
        sub={m.feat.sub}
        captions={<Captions items={[m.feat.items[0], m.feat.items[1]]} />}
      >
        <PromptToTable />
      </CanvasSection>

      <CanvasSection
        kicker={m.eyebrow.git}
        title={m.git.title}
        sub={m.git.sub}
        captions={<Captions items={[m.git.items[0], m.git.items[1]]} />}
      >
        <GitWorkspace m={m} syncedCaption={m.git.syncedCaption} />
      </CanvasSection>

      <CanvasSection
        kicker={m.eyebrow.audit}
        title={m.audit.title}
        sub={m.audit.desc}
        captions={
          <Captions items={m.audit.points.map((title) => ({ title }))} />
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <AuditHistory compact />
          <FilterBuilder compact />
        </div>
      </CanvasSection>
    </>
  );
}
