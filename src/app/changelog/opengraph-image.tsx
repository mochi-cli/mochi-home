import { ImageResponse } from "next/og";
import { SocialImage, SOCIAL_SIZE } from "@/components/SocialImage";

export const alt = "Mochi changelog";
export const size = SOCIAL_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <SocialImage kicker="Changelog" title="What changed, release by release" />,
    size
  );
}
