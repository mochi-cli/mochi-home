import Image from "next/image";

/** A real screenshot of the Mochi app, dressed in the same window chrome the
 *  component-built previews use so captures and mockups read as one system. */
export default function ProductShot({
  src,
  alt,
  title,
  width,
  height,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  /** shown in the window title bar */
  title?: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)] ${className}`}
    >
      <div className="flex h-9 items-center gap-2 border-b border-border bg-secondary/70 px-4">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        {title && (
          <figcaption className="ml-3 truncate text-[11px] text-muted-foreground">{title}</figcaption>
        )}
      </div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 640px"
        className="block h-auto w-full"
      />
    </figure>
  );
}
