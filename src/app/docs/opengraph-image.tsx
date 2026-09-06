import { ImageResponse } from "next/og";
import { SocialImage, SOCIAL_SIZE } from "@/components/SocialImage";

export const alt = "Mochi docs";
export const size = SOCIAL_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <SocialImage kicker="Docs" title="Get going in about a minute" />,
    size
  );
}
