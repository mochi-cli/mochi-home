/* Mirrored from CHANGELOG.md in the app repo. This is a copy, not a summary:
   the wording is the release note as written, so the page cannot drift into
   claiming something the release did not do. Regenerate it from that file
   rather than editing entries here. */

export interface Release {
  version: string;
  items: string[];
}

export const RELEASES: Release[] = [
  {
    version: "0.2.18",
    items: [
      "Add `install codex` as the single-command onboarding flow: it creates the control store, installs the skill, and configures MCP.",
      "Let workspace creation and template seeding happen later in agent chat, or optionally during installation with `--workspace` and `--template`.",
    ],
  },
  {
    version: "0.2.17",
    items: [
      "Refuse MCP configuration when its local database does not exist.",
      "Copy `npx` installations into a stable local MCP runtime instead of saving an evictable `_npx` cache path in agent configuration.",
    ],
  },
  {
    version: "0.2.16",
    items: [
      "Make `open_table` default to the in-app browser; system browser opening is explicit.",
    ],
  },
  {
    version: "0.2.15",
    items: [
      "Restore the lightweight Git installation and direct MCP setup from v0.2.13.",
    ],
  },
  {
    version: "0.2.13",
    items: [
      "Add `install mcp <client>` as the direct MCP-only setup command; keep `init` for compatibility.",
    ],
  },
  {
    version: "0.2.12",
    items: [
      "Make Git URL installation small: package only installs the `ws` runtime dependency; the committed bundle supplies the app.",
    ],
  },
  {
    version: "0.2.11",
    items: [
      "Wait for asynchronous MCP tool responses before closing stdio.",
      "Skip the expensive web build during Git URL installs when the committed dist bundle is present.",
    ],
  },
  {
    version: "0.2.10",
    items: [
      "Export Git bundle row snapshots as readable Markdown tables.",
      "Add a deep Git fixture covering agent attribution, field-level Markdown diffs, bundle verification, and clone recovery.",
    ],
  },
  {
    version: "0.2.9",
    items: [
      "Add explicit one-command Codex setup with a named seeded workspace.",
      "Let Codex browser-capable clients open a local table in-app through `open_table`.",
      "Add MCP/database/workspace/skill diagnostics to `init codex --status`.",
    ],
  },
  {
    version: "0.2.8",
    items: [
      "Add the `open_table` MCP tool, which launches the local browser app for the current MCP workspace without accepting an agent-supplied URL or path.",
      "Add Codex and Claude plugin directories that bundle the Mochi skill and MCP configuration.",
    ],
  },
  {
    version: "0.2.7",
    items: [
      "Tell the agent how to reconnect when MCP is unavailable instead of mistaking the current Git folder for an empty table.",
      "Distinguish an empty connected workspace from a missing local store and suggest safe workspace names, `.mochi` locations, and Codex config paths.",
    ],
  },
];
