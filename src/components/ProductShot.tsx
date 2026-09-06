import Image from "next/image";

/** A real screenshot of the Mochi app on a canvas panel. No fake window chrome:
 *  the traffic lights added nothing the screenshot did not already say, and the
 *  caption sits outside the image so it reads as a label, not an overlay. */
export default function ProductShot({
  src,
  alt,
  title,
  width,
  height,
  priority = false,
  className = "",
  imgClassName = "",
  sizes = "(max-width: 1024px) 88vw, 420px",
}: {
  src: string;
  alt: string;
  /** short functional label shown under the shot */
  title?: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  sizes?: string;
}) {
  return (
    <figure className={className}>
      <div className="canvas">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          className={`block h-auto w-full ${imgClassName}`}
        />
      </div>
      {title && (
        <figcaption className="mt-3 text-[14px] text-ink-2">{title}</figcaption>
      )}
    </figure>
  );
}
