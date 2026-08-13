"use client";

import { Check, X, Minus } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Cell = { kind: "yes" } | { kind: "no" } | { kind: "partial"; label: string } | { kind: "text"; label: string };
interface Row {
  feature: string;
  excel: Cell;
  airtable: Cell;
  mochi: Cell;
}

const ROWS: Row[] = [
  {
    feature: "AI agents read & write your data natively",
    excel: { kind: "partial", label: "Suggests formulas only" },
    airtable: { kind: "no" },
    mochi: { kind: "yes" },
  },
  {
    feature: "Where your data lives",
    excel: { kind: "text", label: "Local file, no sync" },
    airtable: { kind: "text", label: "Their cloud, always" },
    mochi: { kind: "text", label: "Your laptop or the cloud — your call" },
  },
  {
    feature: "Runs without a server or account",
    excel: { kind: "partial", label: "Copilot needs a Microsoft account" },
    airtable: { kind: "no" },
    mochi: { kind: "yes" },
  },
  {
    feature: "Every write is versioned, traceable & reversible",
    excel: { kind: "partial", label: "Undo history only" },
    airtable: { kind: "partial", label: "Paid tiers only" },
    mochi: { kind: "yes" },
  },
  {
    feature: "Real-time collab — teammates and agents",
    excel: { kind: "partial", label: "Needs Microsoft 365" },
    airtable: { kind: "yes" },
    mochi: { kind: "yes" },
  },
  {
    feature: "Pricing",
    excel: { kind: "text", label: "Per seat + Copilot add-on" },
    airtable: { kind: "text", label: "Per seat, monthly" },
    mochi: { kind: "text", label: "$19 once, forever" },
  },
];

function CellContent({ cell }: { cell: Cell }) {
  if (cell.kind === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-soft-foreground">
        <Check className="h-4 w-4 text-brand" />
        Yes
      </span>
    );
  }
  if (cell.kind === "no") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <X className="h-4 w-4 text-muted-foreground/60" />
        No
      </span>
    );
  }
  if (cell.kind === "partial") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <Minus className="h-4 w-4 text-muted-foreground/60" />
        {cell.label}
      </span>
    );
  }
  return <span className="text-[13px] text-foreground">{cell.label}</span>;
}

export default function MascotIntro() {
  const { m } = useLang();
  return (
    <section id="mochi" className="relative border-b border-border">
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why Mochi</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {m.char.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {m.char.sub}
          </p>
        </Reveal>

        {/* same section, same intro — just checked against the tools you're probably using today */}
        <Reveal>
          <p className="eyebrow mt-14 text-center">Versus Excel + Copilot, and Airtable</p>
          <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[38%] text-[13px]">&nbsp;</TableHead>
                    <TableHead className="text-[13px] text-muted-foreground">Excel + Copilot</TableHead>
                    <TableHead className="text-[13px] text-muted-foreground">Airtable</TableHead>
                    <TableHead className="bg-brand-soft/40 text-[13px] font-semibold text-foreground">
                      Mochi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map((r) => (
                    <TableRow key={r.feature}>
                      <TableCell className="text-[13px] font-medium text-foreground">{r.feature}</TableCell>
                      <TableCell>
                        <CellContent cell={r.excel} />
                      </TableCell>
                      <TableCell>
                        <CellContent cell={r.airtable} />
                      </TableCell>
                      <TableCell className="bg-brand-soft/40">
                        <CellContent cell={r.mochi} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
