"use client";

import { memo, useEffect, useRef, useState } from "react";
import { AlignLeft, Calendar, CircleCheck, CircleDot, Link2, Type, Users } from "lucide-react";
import { useLang } from "./LanguageProvider";
import {
  AppTabs,
  AppToolbar,
  Box,
  Cell,
  Chip,
  ClaudeMessage,
  ClaudePanel,
  type Collection,
  HeadCell,
  Pill,
  splitReply,
  type Msg,
  type Tone,
} from "./appui";

/* The section's claim is that a person and an agent work the same workspace,
   so the demo is that sentence acted out. Claude starts alone on the paper,
   answering the way a chat does. Then the workspace it is asked for opens
   behind it, and the panel moves aside to the corner it lives in inside the
   app, and keeps working from there. The move is one continuous translate of
   the same element, which is what makes it read as the panel going somewhere
   rather than one panel closing and another opening. */

interface Customer {
  id: string;
  name: string;
  email: string;
  source: string;
  sourceTone: Tone;
  status: "Active" | "Trial" | "Churned";
  created: string;
}

const CUSTOMERS: Customer[] = [
  { id: "CUS-001", name: "Sofia Martinez", email: "sofia.martinez@haldenroe.com", source: "Website", sourceTone: "blue", status: "Active", created: "02/11/2026" },
  { id: "CUS-004", name: "Ethan Walker", email: "ethan.walker@acetube.io", source: "Referral", sourceTone: "lilac", status: "Active", created: "03/04/2026" },
  { id: "CUS-007", name: "Isabella Garcia", email: "isabella.garcia@timbershadow.co", source: "Twitter", sourceTone: "green", status: "Churned", created: "11/28/2025" },
  { id: "CUS-011", name: "Mia Chen", email: "mia.chen@lksgroup.com", source: "Website", sourceTone: "blue", status: "Active", created: "05/19/2026" },
  { id: "CUS-014", name: "Emma Dubois", email: "emma.dubois@visionquest.fr", source: "Event", sourceTone: "amber", status: "Trial", created: "07/02/2026" },
  { id: "CUS-019", name: "Marcus Okafor", email: "marcus.okafor@blueharbour.uk", source: "Referral", sourceTone: "lilac", status: "Active", created: "07/26/2026" },
  { id: "CUS-022", name: "Hannah Fischer", email: "hannah.fischer@fischerlabs.de", source: "Website", sourceTone: "blue", status: "Active", created: "08/03/2026" },
  { id: "CUS-025", name: "Daniel Novak", email: "daniel.novak@novakandsons.cz", source: "Event", sourceTone: "amber", status: "Trial", created: "08/09/2026" },
  { id: "CUS-028", name: "Ava Thompson", email: "ava.thompson@haldenroe.com", source: "Referral", sourceTone: "lilac", status: "Active", created: "08/14/2026" },
  { id: "CUS-031", name: "Kenji Tanaka", email: "kenji.tanaka@acetube.io", source: "Twitter", sourceTone: "green", status: "Active", created: "08/18/2026" },
  { id: "CUS-034", name: "Linh Nguyen", email: "linh.nguyen@blueharbour.uk", source: "Website", sourceTone: "blue", status: "Trial", created: "08/21/2026" },
  { id: "CUS-037", name: "Marco Reyes", email: "marco.reyes@lksgroup.com", source: "Event", sourceTone: "amber", status: "Churned", created: "08/25/2026" },
];

const STATUS_TONE: Record<Customer["status"], Tone> = {
  Active: "mint",
  Trial: "amber",
  Churned: "rose",
};

const COLLECTIONS: Collection[] = [
  { name: "Customers", tone: "amber", icon: Users },
  { name: "Leads", tone: "green", icon: CircleCheck },
];

/** The call behind each exchange. The first four run against the chat script
 *  the section already ships; the last two run the open and the filter. */
const CHAT_TOOLS = [
  { name: "mochi.create_record", secs: 0.9 },
  { name: "mochi.query_records", secs: 0.7 },
  { name: "mochi.get_record", secs: 0.5 },
  { name: "mochi.update_record", secs: 1.1 },
];
const OPEN_TOOL = { name: "mochi.open_table", secs: 0.8 };
const FILTER_TOOL = { name: "mochi.set_filter", secs: 0.5 };

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** The workspace window, kept out of the transcript's render path. Typing runs
 *  one state update per character, and re-rendering twelve rows of grid on each
 *  of them made the conversation run at a third of the speed it asks for. */
const Workspace = memo(function Workspace({
  rows,
  filtered,
}: {
  rows: Customer[];
  filtered: boolean;
}) {
  return (
  <div className="canvas appui">
    <AppTabs tabs={COLLECTIONS} active="Customers" />
    <AppToolbar view="Grid view" filters={filtered ? 1 : 0} />
    <div className="h-[320px] overflow-auto lg:h-[544px]">
      <table className="w-full min-w-[52rem] border-collapse">
        <thead>
          <tr style={{ background: "var(--app-bg)" }}>
            <th className="border-b border-r px-3 py-2" style={{ borderColor: "var(--app-line)", width: 36 }}>
              <Box />
            </th>
            <th
              className="border-b border-r px-2 py-2 text-right text-[11px] font-normal"
              style={{ borderColor: "var(--app-line)", color: "var(--app-faint)", width: 40 }}
            >
              #
            </th>
            <HeadCell icon={Type} tag="primary" width={136}>Customer_ID</HeadCell>
            <HeadCell icon={AlignLeft} width={168}>Name</HeadCell>
            <HeadCell icon={Link2}>Email</HeadCell>
            <HeadCell icon={CircleDot} width={122}>Source</HeadCell>
            <HeadCell icon={CircleDot} width={112}>Status</HeadCell>
            <HeadCell icon={Calendar} width={122}>Created</HeadCell>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr key={c.id} className="animate-row-in" style={{ animationDelay: `${i * 45}ms` }}>
              <Cell width={36}><Box /></Cell>
              <Cell width={40} className="text-right">
                <span className="text-[11px] tabular-nums" style={{ color: "var(--app-faint)" }}>{i + 1}</span>
              </Cell>
              <Cell width={136}>
                <span className="flex items-center gap-2">
                  <Chip tone="amber" letter="C" />
                  <span className="mono text-[12px]">{c.id}</span>
                </span>
              </Cell>
              <Cell width={168}><span className="text-[12.5px]">{c.name}</span></Cell>
              <Cell><span className="mono block truncate text-[12px]">{c.email}</span></Cell>
              <Cell width={122}><Pill tone={c.sourceTone}>{c.source}</Pill></Cell>
              <Cell width={112}><Pill tone={STATUS_TONE[c.status]}>{c.status}</Pill></Cell>
              <Cell width={122}><span className="mono text-[12px]">{c.created}</span></Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
});


export default function PromptToTable() {
  const { m } = useLang();
  const turns = m.feat.demo;
  const script = m.scripts.chat as { who: "you" | "mochi"; text: string }[];

  const [log, setLog] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [docked, setDocked] = useState(false);
  const [filtered, setFiltered] = useState(false);
  // Only above lg does the panel have a size to animate. Below it, the panel
  // and the window stack in flow and each takes its natural height.
  const [wide, setWide] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const type = async (text: string) => {
      for (let c = 1; c <= text.length; c++) {
        if (cancelled) return true;
        setDraft(text.slice(0, c));
        await sleep(20);
      }
      return false;
    };

    const send = async (text: string) => {
      await sleep(260);
      setDraft("");
      setLog((l) => [...l, { who: "you", text }]);
      await sleep(280);
    };

    const call = async (tool: { name: string; secs: number }, effect?: () => void) => {
      setLog((l) => [...l, { who: "claude", text: tool.name, tool: { running: true, secs: tool.secs } }]);
      await sleep(tool.secs * 1000);
      if (cancelled) return;
      effect?.();
      setLog((l) => {
        const next = [...l];
        next[next.length - 1] = { ...next[next.length - 1], tool: { running: false, secs: tool.secs } };
        return next;
      });
      await sleep(300);
    };

    const stream = async (text: string) => {
      const parts = splitReply(text);
      const speed = text.length > 100 ? 4 : 11;
      for (const part of parts) {
        setLog((l) => [...l, { ...part, text: "" }]);
        for (let c = 1; c <= part.text.length; c++) {
          if (cancelled) return true;
          setLog((l) => {
            const next = [...l];
            next[next.length - 1] = { ...next[next.length - 1], text: part.text.slice(0, c) };
            return next;
          });
          await sleep(speed);
        }
      }
      return false;
    };

    const run = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setOpen(true);
        setDocked(true);
        setLog([
          { who: "you", text: turns[0].ask },
          { who: "claude", text: turns[0].reply },
          { who: "you", text: turns[1].ask },
          { who: "claude", text: turns[1].reply },
        ]);
        setFiltered(true);
        return;
      }

      while (!cancelled) {
        setLog([]);
        setDraft("");
        setOpen(false);
        setDocked(false);
        setFiltered(false);
        await sleep(1200);

        // 1. the conversation the section already had, on the open paper
        let i = 0;
        for (const line of script) {
          if (cancelled) return;
          if (line.who === "you") {
            if (await type(line.text)) return;
            await send(line.text);
            await call(CHAT_TOOLS[i % CHAT_TOOLS.length]);
            i += 1;
          } else {
            if (await stream(line.text)) return;
            await sleep(700);
          }
        }
        await sleep(500);

        // 2. the ask that opens a workspace: the window arrives behind the
        //    panel, and the panel leaves the middle for the corner
        if (cancelled) return;
        if (await type(turns[0].ask)) return;
        await send(turns[0].ask);
        await call(OPEN_TOOL, () => { setOpen(true); setDocked(true); });
        if (await stream(turns[0].reply)) return;
        await sleep(1600);

        // 3. and it keeps working from there
        if (cancelled) return;
        if (await type(turns[1].ask)) return;
        await send(turns[1].ask);
        await call(FILTER_TOOL, () => setFiltered(true));
        if (await stream(turns[1].reply)) return;
        await sleep(5200);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [script, turns]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [log, draft]);

  const visible = filtered ? CUSTOMERS.filter((c) => c.status === "Active") : CUSTOMERS;
  /** Full frame until the workspace is open, then the corner card. */
  const size = wide
    ? docked
      ? { width: "23rem", height: "20rem" }
      : { width: "calc(100% - 2rem)", height: "calc(100% - 2rem)" }
    : undefined;

  return (
    <div className="relative flex flex-col gap-6 lg:block lg:h-[620px]">
      {/* the workspace, opening behind the panel */}
      <div
        className={`order-2 transition-all duration-700 lg:absolute lg:inset-0 lg:order-none ${
          open ? "opacity-100 lg:scale-100" : "pointer-events-none opacity-0 lg:scale-[0.985]"
        }`}
        style={{ transitionTimingFunction: EASE }}
        aria-hidden={!open}
      >
        <Workspace rows={visible} filtered={filtered} />
      </div>

      {/* Claude: centred on the paper, then docked into the window's corner.
          Same element throughout, moved with one transform. The window runs
          taller than the panel so half the rows stay clear of it. */}
      <div
        className="relative order-1 z-10 mx-auto w-full max-w-[23rem] transition-[width,height] duration-700 lg:absolute lg:bottom-4 lg:left-4 lg:order-none lg:mx-0 lg:max-w-none"
        style={{ transitionTimingFunction: EASE, ...size }}
      >
        <ClaudePanel
          agent={m.heroDemo.agent}
          placeholder={m.heroDemo.placeholder}
          draft={draft}
          scrollRef={scrollRef}
          bodyClass="h-[220px] lg:h-auto lg:min-h-0 lg:flex-1"
        >
          {log.map((msg, i) => (
            <ClaudeMessage key={i} msg={msg} />
          ))}
        </ClaudePanel>
      </div>
    </div>
  );
}
