import Image from "next/image";

/** The mark and the name together. brand/README.md rules out a drawn wordmark
 *  ("a second asset to keep in step with the first, for a pairing that appears
 *  once"), so the name is set in the page's own type at its own weight. The
 *  mark itself is used untouched: no recolour, no shadow, no rotation. */
export default function Brand({
  onInk = false,
  priority = false,
}: {
  /** the mark follows the reader's system theme, so an ink slab has to flip it */
  onInk?: boolean;
  priority?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/mark.svg"
        alt=""
        width={32}
        height={32}
        priority={priority}
        className={`h-[22px] w-[22px] flex-none ${onInk ? "mark-on-ink" : ""}`}
        aria-hidden
      />
      <span className="text-[17px] font-[520] tracking-[-0.02em] text-ink">Mochi</span>
    </span>
  );
}
