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

type CellKind = "yes" | "no" | "partial" | "text";

/** Only the *shape* of each cell lives here — which icon it gets and whether it
 *  carries prose. The wording comes from m.compare.rows so it can be translated. */
const ROW_KINDS: { excel: CellKind; airtable: CellKind; mochi: CellKind }[] = [
  { excel: "partial", airtable: "no", mochi: "yes" },
  { excel: "text", airtable: "text", mochi: "text" },
  { excel: "partial", airtable: "no", mochi: "yes" },
  { excel: "partial", airtable: "partial", mochi: "yes" },
  { excel: "partial", airtable: "yes", mochi: "yes" },
  { excel: "text", airtable: "text", mochi: "text" },
];

function CellContent({
  kind,
  label,
  yes,
  no,
}: {
  kind: CellKind;
  label: string;
  yes: string;
  no: string;
}) {
  if (kind === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-soft-foreground">
        <Check className="h-4 w-4 text-brand" />
        {yes}
      </span>
    );
  }
  if (kind === "no") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <X className="h-4 w-4 text-muted-foreground/60" />
        {no}
      </span>
    );
  }
  if (kind === "partial") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <Minus className="h-4 w-4 text-muted-foreground/60" />
        {label}
      </span>
    );
  }
  return <span className="text-[13px] text-foreground">{label}</span>;
}

export default function MascotIntro() {
  const { m } = useLang();
  return (
    <section id="mochi" className="relative">
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{m.eyebrow.char}</p>
          <h2 className="mt-3 text-[length:var(--text-h2)] font-semibold tracking-tight text-foreground">
            {m.char.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {m.char.sub}
          </p>
        </Reveal>

        {/* same section, same intro — just checked against the tools you're probably using today */}
        <Reveal variant="soft">
          <p className="eyebrow mt-14 text-center">{m.eyebrow.compare}</p>
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
                  {m.compare.rows.map((r, i) => {
                    const kinds = ROW_KINDS[i];
                    const words = { yes: m.compare.yes, no: m.compare.no };
                    return (
                    <TableRow key={r.feature}>
                      <TableCell className="text-[13px] font-medium text-foreground">{r.feature}</TableCell>
                      <TableCell>
                        <CellContent kind={kinds.excel} label={r.excel} {...words} />
                      </TableCell>
                      <TableCell>
                        <CellContent kind={kinds.airtable} label={r.airtable} {...words} />
                      </TableCell>
                      <TableCell className="bg-brand-soft/40">
                        <CellContent kind={kinds.mochi} label={r.mochi} {...words} />
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
