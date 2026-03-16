import { JarvisInlineWidget } from "@/components/jarvis-inline-widget";

/**
 * /embed/inline
 *
 * Transparent-background page that renders JarvisInlineWidget.
 * Loaded inside the <iframe> created by embed-inline.js on external sites.
 */
export default function EmbedInlinePage() {
  return (
    <div
      className="min-h-screen bg-transparent flex items-start justify-start p-2"
      style={{ background: "transparent" }}
    >
      <JarvisInlineWidget />
    </div>
  );
}
