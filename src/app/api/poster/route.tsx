import { ImageResponse } from "next/og";
import { Poster, SIZES, type SizeName, type VariantName } from "@/components/Poster";

/* Renders the marketing and social images on demand, so a new platform size or
   a reworded claim is a query string rather than a round trip through a design
   tool. `scripts/posters.sh` walks the combinations it wants and writes them
   into public/social. */

const VARIANTS: VariantName[] = ["claim", "numbers", "agent", "limits", "pricing"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const v = url.searchParams.get("v");
  const s = url.searchParams.get("s");

  const variant: VariantName = VARIANTS.includes(v as VariantName) ? (v as VariantName) : "claim";
  const size: SizeName = s && s in SIZES ? (s as SizeName) : "og";

  return new ImageResponse(<Poster variant={variant} size={size} />, SIZES[size]);
}
