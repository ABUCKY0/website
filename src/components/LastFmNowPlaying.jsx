import { useEffect, useState } from "react";

export default function LastFmNowPlaying() {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadTrack = async () => {
      try {
        const response = await fetch("/api/lastfm");

        if (!response.ok) {
          throw new Error(`Last.fm request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!cancelled) {
          setTrack(data.track || null);
        }
      } catch (error) {
        console.error("Unable to load Last.fm track:", error);
      }
    };

    loadTrack();
    const interval = setInterval(loadTrack, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!track) {
    return (
      <>
        <p className="now-playing-label">LAST PLAYED</p>
        <div className="now-playing-content">
          <p className="now-playing-empty">No recent track</p>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="now-playing-label">
        {track.nowPlaying ? "CURRENTLY LISTENING TO" : "LAST LISTENED TO"}
      </p>
      <div className="now-playing-content">
        <div className="now-playing-track">
          {track.image && (
            <img
              className="now-playing-art"
              src={track.image}
              alt={`Album artwork for ${track.album}`}
            />
          )}
          <div className="now-playing-details">
            <strong className="now-playing-title">{track.name}</strong>
            <span className="now-playing-artist">{track.artist}</span>
            <span className="now-playing-album">{track.album}</span>
          </div>
        </div>
      </div>
    </>
  );
}
