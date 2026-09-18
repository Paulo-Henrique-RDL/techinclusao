import { useEffect, useRef } from "react";
import { VIDEO_PROGRESS_DEBOUNCE_MS, WATCHED_THRESHOLD } from "../lib/constants.js";

let apiLoadPromise = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

export function useYouTubePlayer({ youtubeId, initialSeconds, onProgress, onWatchedThreshold }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!youtubeId) return undefined;

    let cancelled = false;
    let intervalId = null;
    let watchedThresholdReached = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: (event) => {
            if (initialSeconds > 5) event.target.seekTo(initialSeconds, true);
          },
        },
      });

      intervalId = window.setInterval(() => {
        const player = playerRef.current;
        if (!player || typeof player.getCurrentTime !== "function") return;
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (!duration) return;

        onProgress(Math.floor(currentTime));
        if (!watchedThresholdReached && currentTime / duration >= WATCHED_THRESHOLD) {
          watchedThresholdReached = true;
          onWatchedThreshold();
        }
      }, VIDEO_PROGRESS_DEBOUNCE_MS);
    });

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
      playerRef.current?.destroy?.();
    };
  }, [youtubeId]);

  return { containerRef };
}
