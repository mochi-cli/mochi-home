import type { ReactNode } from "react";
import Brand from "./Brand";

/** The short pages the account flow sends people to: sign-in landed, payment
 *  went through, payment did not. Somebody reads one for four seconds and
 *  closes the tab, so it is one centred message and nothing else. They now sit
 *  in the site's own type and colours rather than inline styles. */
export default function StatusPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-5 text-center">
      <Brand />
      <h1 className="display-sm mt-10 max-w-[20ch]">{title}</h1>
      <p className="lead mt-4 max-w-[46ch]">{children}</p>
    </main>
  );
}
