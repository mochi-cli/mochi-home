import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { CodeBlock, InlineCode, Note } from "@/components/Prose";
import DownloadLink from "@/components/DownloadLink";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Get Mochi running, connect an agent, create a workspace, and keep a copy of your history.",
  alternates: { canonical: "/docs" },
};

/* Everything on this page is taken from the app's own README so it cannot
   describe a product that does not exist. The commands are the real ones. */

interface Section {
  id: string;
  title: string;
  body: React.ReactNode;
}

export default function DocsPage() {
  const sections: Section[] = [
    {
      id: "get-mochi",
      title: "Get Mochi",
      body: (
        <>
          <p>
            Download the app from{" "}
        <DownloadLink
              className="text-ink underline-offset-4 transition-colors hover:text-ink-2 hover:underline"
        >
              the latest release
        </DownloadLink>
            , open it, and you have a workspace. Nothing to sign up for and nothing to configure.
          </p>
          <Note>
            <InlineCode text="Running it from a checkout instead needs Node 24 or newer." />
          </Note>
        </>
      ),
    },
    {
      id: "connect-an-agent",
      title: "Connect an agent",
      body: (
        <>
          <p>
            In the app. Open <strong className="text-ink">Settings</strong> — the gear beside your
            account, at the foot of the sidebar — and stay on the{" "}
            <strong className="text-ink">Agents</strong> tab it opens on.
          </p>
          <p className="mt-4">
            It lists the clients it can find on this machine: Claude Code, Claude Desktop, Codex,
            OpenCode, Hermes Agent and OpenClaw. Anything it cannot find is marked{" "}
            <em>Not installed</em> rather than hidden, so a client you expected to see and do not
            tells you something. Press <strong className="text-ink">Connect</strong> on the one you
            use, then restart that client so it notices.
          </p>
          <p className="mt-4">
            Connecting writes Mochi into that client&rsquo;s own MCP configuration, alongside
            whatever is already in it. Nothing else in the file is touched, and the panel names the
            other servers it found there so you can see that for yourself. Disconnect removes just
            that entry.
          </p>
          <Note>
            <InlineCode text="For a client that is not in the list, the same panel shows the command to add by hand, with a button to copy it." />
          </Note>
          <p className="mt-4">
            The agent talks to Mochi over a pipe on your own machine, so there is no port to open,
            no token to paste and nothing in between.
          </p>
        </>
      ),
    },
    {
      id: "make-a-workspace",
      title: "Make a workspace",
      body: (
        <>
          <p>
            Nothing is created until you name it. Press{" "}
            <strong className="text-ink">New workspace</strong>, give it a short name — a name, not
            a path — and pick what to start from: an empty workspace, or one of the samples (CRM,
            HR, Inventory, Projects) which arrives with tables and a few rows in it, so there is
            something to look at straight away.
          </p>
          <p className="mt-4">
            Each workspace is a separate database file on your machine. Or ask the agent, once it
            is connected, and it does the same thing:
          </p>
          <CodeBlock>{`Create a workspace named sales-demo,
seed the CRM template, and open it.`}</CodeBlock>
        </>
      ),
    },
    {
      id: "open-a-table",
      title: "Open a table from chat",
      body: (
        <p>
          <InlineCode text="Ask the agent to open a table and it opens the one for the workspace you are in. It cannot be handed a path or a link, so a prompt can never point it somewhere you did not mean." />
        </p>
      ),
    },
    {
      id: "where-data-lives",
      title: "Where your data lives",
      body: (
        <>
          <p>
            <InlineCode text="Your rows are in a file under `~/.mochi`, on your machine. Nothing about a row is sent anywhere, and the app works with the network off." />
          </p>
          <p className="mt-4">
            <InlineCode text="Database files are ignored by Git by default, so nothing lands in a commit by accident." />
          </p>
        </>
      ),
    },
    {
      id: "history",
      title: "Keep a copy of the history",
      body: (
        <>
          <p>
            <InlineCode text="Every change is attributed to whoever made it, whether that was a person or an agent. Undo puts things back without erasing the record of what happened." />
          </p>
          <p className="mt-4">
            You can take the whole history with you. Open{" "}
            <strong className="text-ink">More actions → History</strong> and press{" "}
            <strong className="text-ink">Export as a Git bundle</strong>. What you get is one
            ordinary file that Git understands on its own — no Mochi needed to read it back:
          </p>
          <CodeBlock>{`git bundle verify history.bundle
git clone history.bundle history`}</CodeBlock>
        </>
      ),
    },
  ];

  return (
    <PageShell
      kicker="Docs"
      title="Get going in about a minute"
      sub="Download it, point an agent at it, name a workspace. That is the whole setup."
    >
      <section className="mx-auto max-w-[1280px] px-5 pb-28 pt-16 sm:px-8 md:pb-36">
        <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="flex flex-col border-t border-line">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block border-b border-line py-3 text-[15px] text-ink-2 transition-colors hover:text-ink"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 border-t border-line">
            {sections.map((s) => (
              <article key={s.id} id={s.id} className="scroll-mt-24 border-b border-line py-10">
                <h2 className="display-sm">{s.title}</h2>
                <div className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
                  {s.body}
                </div>
              </article>
            ))}

          </div>
        </div>
      </section>
    </PageShell>
  );
}
