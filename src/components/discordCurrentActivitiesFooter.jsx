import React, { useEffect, useState } from "react";
import styles from "../styles/discordCurrentActivitesFooter.module.css";

export default function DiscordCurrentActivitiesFooter() {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadTrack = async () => {
      try {
        const response = await fetch(`/api/lastfm?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Last.fm request failed with status ${response.status}`);
        }

        const nextTrack = await response.json();
        if (!cancelled) {
          setTrack(nextTrack.track || null);
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

  const activityText = track
    ? track.nowPlaying
      ? `Listening to ${track.name} by ${track.artist}`
      : `Last Listened to ${track.name} by ${track.artist} on Spotify`
    : "";

  if (!track) {
    return <p className="footer-text">©ABUCKY0 2026</p>;
  }

  return (
    <div className={`${styles["activities-list"]} ${styles["footer-activity-list"]}`}>
      <div className={styles["activity-summary"]}>
        <img
          src="/icons/spotify.svg"
          alt=""
          className={styles["activity-icon"]}
          aria-hidden="true"
        />
        <span className={styles["activity-text"]}>
          {activityText}
        </span>
      </div>
    </div>
  );
}
