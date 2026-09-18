import { useYouTubePlayer } from "../hooks/useYouTubePlayer.js";

export function VideoPlayer({ youtubeId, initialSeconds, onProgress, onWatchedThreshold }) {
  const { containerRef } = useYouTubePlayer({ youtubeId, initialSeconds, onProgress, onWatchedThreshold });
  return <div ref={containerRef} className="aspect-video w-full overflow-hidden rounded-2xl bg-ink" />;
}
