const partners = [
  {
    href: "https://letslaunch.today/product/mochi",
    src: "https://letslaunch.today/badge/mochi.svg",
    alt: "Mochi on LetsLaunch",
    width: 250,
    height: 54,
  },
  {
    href: "https://domain-rating.com/site/mochi-cli.com?utm_source=badge",
    src: "https://domain-rating.com/badge/mochi-cli.com.svg",
    alt: "mochi-cli.com — verified DR 0/100",
    width: 300,
    height: 64,
  },
  {
    href: "https://publishyoursaas.com/listing/mochi-cli-com",
    src: "https://publishyoursaas.com/publishyoursaas-badge.svg",
    alt: "Mochi Table is listed on PublishYourSaaS",
    width: 240,
    height: 60,
  },
  {
    href: "https://www.scrolllaunch.com/products/mochi-table?ref=badge",
    src: "https://www.scrolllaunch.com/api/badge/mochi-table",
    alt: "Featured on ScrollLaunch",
    width: 220,
    height: 48,
  },
  {
    href: "https://tinylaunch.com",
    src: "https://tinylaunch.com/tinylaunch_badge_launching_soon.svg",
    alt: "TinyLaunch Badge",
    width: 202,
    height: 64,
  },
] as const;

export default function PartnerRow() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="border-y border-line bg-surface/70 py-10 sm:py-12"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-x-5 gap-y-6 px-5 sm:grid-cols-2 sm:px-8 md:grid-cols-[140px_repeat(4,minmax(0,1fr))] md:gap-x-6">
        <h2 id="partners-heading" className="kicker col-span-full text-ink-2 md:col-span-1">
          Partners
        </h2>
        {partners.map((partner) => (
          <a
            key={partner.href}
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-16 min-w-0 items-center justify-center rounded-xl transition-opacity hover:opacity-80"
          >
            <img
              src={partner.src}
              alt={partner.alt}
              width={partner.width}
              height={partner.height}
              loading="lazy"
              className="max-h-16 w-auto max-w-full object-contain"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
