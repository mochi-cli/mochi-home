import { ImageResponse } from "next/og";
import { SocialImage, SOCIAL_SIZE } from "@/components/SocialImage";

export const alt = "Mochi, one place for all your team's work";
export const size = SOCIAL_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <SocialImage title="One place for all your work. No servers, no monthly bill." />,
    size
  );
}
