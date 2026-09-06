"use client";

import type { ReactNode } from "react";
import {
  AlignLeft,
  ArrowUp,
  ArrowUpDown,
  Check,
  Loader2,
  Asterisk,
  ChevronDown,
  Columns3,
  LayoutGrid,
  ListFilter,
  MoreHorizontal,
  Plus,
  Redo2,
  Rows3,
  Search,
  SquareTerminal,
  Undo2,
  Zap,
} from "lucide-react";

/* Shared chrome for every product surface on the page. The demos used to each
   invent their own panel, which is why they never quite looked like the same
   application. These primitives carry the app's real palette (.appui) and the
   agent panel carries Claude's (.claudeui); both are defined in globals.css. */

export type Tone = "blue" | "green" | "mint" | "amber" | "lilac" | "rose";

export function Pill({ tone, children }: { tone: Tone; children: string }) {
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-[3px] px-1.5 py-[3px] text-[11px] font-medium leading-none"
      style={{ background: `var(--pill-${tone}-bg)`, color: `var(--pill-${tone}-fg)` }}
    >
      {children}
    </span>
  );
}

export function Chip({ tone, letter }: { tone: Tone; letter: string }) {
  return (
    <span
      className="flex h-[15px] w-[15px] flex-none items-center justify-center rounded-[3px] text-[9px] font-semibold"
      style={{ background: `var(--pill-${tone}-bg)`, color: `var(--pill-${tone}-fg)` }}
      aria-hidden
    >
      {letter}
    </span>
  );
}

export function Box() {
  return (
    <span
      className="block h-[13px] w-[13px] rounded-[3px] border"
      style={{ borderColor: "var(--app-faint)" }}
      aria-hidden
    />
  );
}

export function ToolButton({
  icon: Icon,
  children,
  chevron,
  active,
}: {
  icon: typeof ListFilter;
  children: string;
  chevron?: boolean;
  active?: boolean;
}) {
  return (
    <span
      className="flex flex-none items-center gap-1.5 whitespace-nowrap rounded-[5px] px-2 py-1 text-[12px]"
      style={{ background: active ? "var(--app-band)" : "transparent", color: "var(--app-text)" }}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.6} style={{ color: "var(--app-muted)" }} />
      {children}
      {chevron && <ChevronDown className="h-3 w-3" strokeWidth={1.6} style={{ color: "var(--app-faint)" }} />}
    </span>
  );
}

export interface Collection {
  name: string;
  tone: Tone;
  icon: typeof ListFilter;
}

/** The collection strip across the top of a workspace window. Each collection
 *  carries its own glyph in its own tone, the way the app labels them. */
export function AppTabs({
  tabs,
  active,
}: {
  tabs: Collection[];
  active: string;
}) {
  return (
    <div
      className="flex h-[38px] items-center gap-0.5 overflow-x-auto border-b px-1.5"
      style={{ borderColor: "var(--app-line)" }}
    >
      {tabs.map((t) => {
        const isActive = t.name === active;
        const Icon = t.icon;
        return (
          <span
            key={t.name}
            className="flex flex-none items-center gap-1.5 whitespace-nowrap rounded-[5px] px-2 py-1 text-[12px]"
            style={{
              background: isActive ? "var(--app-band)" : "transparent",
              color: isActive ? "var(--app-text)" : "var(--app-muted)",
            }}
          >
            <span
              className="flex h-[16px] w-[16px] flex-none items-center justify-center rounded-[3px]"
              style={{ background: `var(--pill-${t.tone}-bg)`, color: `var(--pill-${t.tone}-fg)` }}
              aria-hidden
            >
              <Icon className="h-[10px] w-[10px]" strokeWidth={2.2} />
            </span>
            {t.name}
          </span>
        );
      })}
      <Plus className="ml-1 h-3.5 w-3.5 flex-none" strokeWidth={1.6} style={{ color: "var(--app-faint)" }} />
    </div>
  );
}

/** The view toolbar. `view` names the current view, `trail` the breadcrumb. */
export function AppToolbar({ view, groups, filters }: { view: string; groups?: number; filters?: number }) {
  return (
    <div
      className="flex h-[38px] items-center gap-0.5 overflow-x-auto border-b px-1.5"
      style={{ borderColor: "var(--app-line)" }}
    >
      <ToolButton icon={LayoutGrid} chevron>{view}</ToolButton>
      <span className="mx-1 h-4 w-px flex-none" style={{ background: "var(--app-line)" }} aria-hidden />
      <ToolButton icon={ListFilter} active={!!filters}>{filters ? `Filter (${filters})` : "Filter"}</ToolButton>
      <ToolButton icon={ArrowUpDown}>Sort</ToolButton>
      <ToolButton icon={Rows3} active={!!groups}>{groups ? `Group (${groups})` : "Group"}</ToolButton>
      <ToolButton icon={Zap}>Rules</ToolButton>
      <ToolButton icon={Columns3}>Columns</ToolButton>

      <span className="ml-auto flex flex-none items-center gap-1.5 pl-3">
        <span
          className="hidden items-center gap-1.5 rounded-[5px] border px-2 py-1 text-[12px] xl:flex"
          style={{ borderColor: "var(--app-line)", color: "var(--app-faint)" }}
        >
          <Search className="h-3 w-3" strokeWidth={1.8} />
          Search
          <span className="mono text-[10px]">⌘F</span>
        </span>
        <Undo2 className="h-3.5 w-3.5" strokeWidth={1.6} style={{ color: "var(--app-muted)" }} />
        <Redo2 className="h-3.5 w-3.5" strokeWidth={1.6} style={{ color: "var(--app-muted)" }} />
        <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.6} style={{ color: "var(--app-muted)" }} />
        <span
          className="flex items-center gap-1 rounded-[5px] px-2 py-1 text-[12px] font-medium"
          style={{ background: "var(--app-btn)", color: "var(--app-btn-fg)" }}
        >
          <Plus className="h-3 w-3" strokeWidth={2.2} />
          New
        </span>
      </span>
    </div>
  );
}

export function HeadCell({
  icon: Icon,
  children,
  tag,
  width,
  align = "left",
}: {
  icon?: typeof AlignLeft;
  children: string;
  tag?: string;
  width?: number;
  align?: "left" | "right";
}) {
  return (
    <th
      className="whitespace-nowrap border-b border-r px-3 py-2 text-left text-[12px] font-medium"
      style={{ borderColor: "var(--app-line)", color: "var(--app-text)", width }}
    >
      <span className={`flex items-center gap-1.5 ${align === "right" ? "justify-end" : ""}`}>
        {Icon && <Icon className="h-3 w-3 flex-none" strokeWidth={1.8} style={{ color: "var(--app-faint)" }} />}
        {children}
        {tag && <span className="text-[10px] font-normal" style={{ color: "var(--app-faint)" }}>{tag}</span>}
        <ChevronDown className="ml-auto h-3 w-3 flex-none" strokeWidth={1.6} style={{ color: "var(--app-faint)" }} />
      </span>
    </th>
  );
}

export function Cell({
  children,
  className = "",
  width,
}: {
  children: ReactNode;
  className?: string;
  width?: number;
}) {
  return (
    <td
      className={`border-b border-r px-3 py-[7px] align-middle ${className}`}
      style={{ borderColor: "var(--app-line)", width }}
    >
      {children}
    </td>
  );
}

export function GroupRow({ label, count, span }: { label: string; count: number; span: number }) {
  return (
    <tr>
      <td
        colSpan={span}
        className="border-b px-3 py-1.5"
        style={{ borderColor: "var(--app-line)", background: "var(--app-band)" }}
      >
        <span className="flex items-center gap-2 text-[12px] font-medium">
          <ChevronDown className="h-3 w-3" strokeWidth={2} style={{ color: "var(--app-muted)" }} />
          {label}
          <span className="tabular-nums font-normal" style={{ color: "var(--app-faint)" }}>{count}</span>
        </span>
      </td>
    </tr>
  );
}

// ─── the agent panel ──────────────────────────────────────────────────────────
export interface Msg {
  who: "you" | "claude";
  text: string;
  /** rendered as a fixed-width block, for machine output like an ASCII table */
  block?: boolean;
  /** renders as an MCP call rather than prose; `text` is the tool name */
  tool?: { running: boolean; secs: number };
}

/** An agent reply can carry an ASCII table. Those lines either draw a rule
 *  (+-----+) or hold cells (| a | b |), and they always arrive as one
 *  contiguous run, so a line-by-line scan is enough and stays correct while the
 *  reply is still being typed out one character at a time. */
export function splitReply(text: string): Msg[] {
  const isTableLine = (l: string) => /^\s*[+|]/.test(l) && l.trim().length > 1;
  const out: Msg[] = [];
  for (const l of text.split("\n")) {
    const block = isTableLine(l);
    const last = out[out.length - 1];
    if (last && !!last.block === block) last.text += "\n" + l;
    else out.push({ who: "claude", text: l, block });
  }
  return out.filter((b) => b.text.trim().length > 0);
}

export function ClaudeMessage({ msg, caret }: { msg: Msg; caret?: boolean }) {
  if (msg.tool) {
    return <ToolCall name={msg.text} running={msg.tool.running} secs={msg.tool.secs} />;
  }
  if (msg.who === "you") {
    return (
      <p
        className="ml-8 flex-none self-end whitespace-pre-wrap rounded-[10px] px-3 py-2 text-[13px] leading-relaxed"
        style={{ background: "var(--cl-user)" }}
      >
        {msg.text}
        {caret && <Caret />}
      </p>
    );
  }
  return (
    <div className="flex flex-none gap-2 text-[13px] leading-relaxed">
      {/* Tinted by whichever agent is driving, so the transcript follows the
          panel without every message having to know which one that is. */}
      <span className="mono mt-[1px] flex-none text-[11px]" style={{ color: "var(--cl-accent)" }} aria-hidden>
        &#8250;&#8250;
      </span>
      {msg.block ? (
        <pre
          className="mono min-w-0 flex-1 overflow-x-auto rounded-[8px] border px-2.5 py-2 text-[11px] leading-[1.5]"
          style={{ borderColor: "var(--cl-line)", background: "var(--cl-field)" }}
        >
          {msg.text}
          {caret && <Caret />}
        </pre>
      ) : (
        <span className="min-w-0 flex-1 whitespace-pre-wrap">
          {msg.text}
          {caret && <Caret />}
        </span>
      )}
    </div>
  );
}

/** An MCP call, shown the way the agent surface shows one: spinning while the
 *  tool runs, ticked with its duration when it returns. This is the moment the
 *  page is actually about, so it gets its own affordance rather than a jump
 *  from question to answer. */
export function ToolCall({
  name,
  running,
  secs,
}: {
  name: string;
  running: boolean;
  secs: number;
}) {
  return (
    <div
      className="flex flex-none items-center gap-2 rounded-[8px] border px-2.5 py-1.5"
      style={{ borderColor: "var(--cl-line)", background: "var(--cl-field)" }}
    >
      {running ? (
        <Loader2
          className="animate-spin-slow h-3.5 w-3.5 flex-none"
          strokeWidth={2.2}
          style={{ color: "var(--cl-accent)" }}
          aria-hidden
        />
      ) : (
        <Check
          className="h-3.5 w-3.5 flex-none"
          strokeWidth={2.6}
          style={{ color: "var(--cl-accent)" }}
          aria-hidden
        />
      )}
      <span className="mono min-w-0 flex-1 truncate text-[11.5px]">{name}</span>
      <span className="mono flex-none text-[10px]" style={{ color: "var(--cl-muted)" }}>
        {running ? "running" : `${secs}s`}
      </span>
    </div>
  );
}

/* Steady, not blinking. This caret only ever appears while text is being
   produced — a draft being typed, a reply still arriving — and a caret that
   blinks through that reads as the picture flickering rather than as a cursor.
   Blinking is what an editor does when it is idle and waiting for you. */
function Caret() {
  return <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-current align-middle" />;
}

/** Claude, as the product shows it: a card in the app's own chrome. `floating`
 *  docks it inside a workspace window from lg up; otherwise it is a plain panel. */
export type AgentSkin = "claude" | "codex";

export function ClaudePanel({
  agent,
  skin = "claude",
  placeholder,
  draft,
  children,
  scrollRef,
  bodyClass = "h-[196px]",
  floating = false,
  status,
}: {
  agent: string;
  skin?: AgentSkin;
  placeholder: string;
  draft: string;
  children: ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  bodyClass?: string;
  /** dock the panel inside a workspace window from lg up, on the given side */
  floating?: false | "left" | "right";
  status?: string;
}) {
  return (
    <aside
      className={`${skin === "codex" ? "codexui" : "claudeui"} flex flex-col ${
        floating
          ? `border-t lg:absolute lg:bottom-4 lg:w-[23rem] lg:rounded-[10px] lg:border lg:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_18px_46px_-14px_rgba(0,0,0,0.42)] ${
              floating === "left" ? "lg:left-4" : "lg:right-4"
            }`
          : "h-full rounded-[10px] border"
      }`}
      style={{ borderColor: "var(--cl-line)" }}
    >
      <div
        className="flex h-[38px] flex-none items-center gap-2 border-b px-3.5"
        style={{ borderColor: "var(--cl-line)" }}
      >
        {skin === "codex" ? (
          <SquareTerminal className="h-4 w-4" strokeWidth={2} style={{ color: "var(--cl-accent)" }} aria-hidden />
        ) : (
          <Asterisk className="h-4 w-4" strokeWidth={2.6} style={{ color: "var(--cl-accent)" }} aria-hidden />
        )}
        <span className="text-[13px] font-medium">{agent}</span>
        <span className="mono ml-auto text-[10px] tracking-[0.04em]" style={{ color: "var(--cl-muted)" }}>
          {status ?? "MCP"}
        </span>
      </div>

      <div
        ref={scrollRef}
        className={`flex flex-col justify-end gap-2.5 overflow-y-auto px-3.5 py-3 ${bodyClass}`}
      >
        {children}
      </div>

      <div className="flex-none p-2.5">
        <div
          className="flex items-center gap-2 rounded-[10px] border px-3 py-2"
          style={{ borderColor: "var(--cl-line)", background: "var(--cl-field)" }}
        >
          <span
            className="min-w-0 flex-1 truncate text-[13px]"
            style={{ color: draft ? "var(--cl-text)" : "var(--cl-muted)" }}
          >
            {draft || placeholder}
            {draft && <Caret />}
          </span>
          <span
            className="flex h-6 w-6 flex-none items-center justify-center rounded-full transition-opacity"
            style={{
              background: "var(--cl-accent)",
              color: "var(--cl-accent-fg)",
              opacity: draft ? 1 : 0.45,
            }}
            aria-hidden
          >
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </aside>
  );
}
