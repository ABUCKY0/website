import React, { useEffect, useState } from "react";
import { useLanyard } from "use-lanyard";
import styles from "../styles/discordCurrentActivities.module.css";

const DISCORD_ID = "925248483135463454";

export default function DiscordCurrentActivities() {
  const presence = useLanyard(DISCORD_ID);
  const [now, setNow] = useState(Date.now()); // ticking clock

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activities = presence?.activities ?? [];
  if (!activities.length) return null;

  // Activity verb
  const getActivityVerb = (activity) => {
    if (activity.type === 0) return "Playing";
    if (activity.type === 1) return "Streaming";
    if (activity.type === 2) return "Listening on";
    if (activity.type === 3) return "Watching";
    if (activity.type === 5) return "Competing in";
    return "Using";
  };

  // Platform icon
  const getPlatformIcon = (activity) => {
    let iconName = "discord";

    switch (activity.type) {
      case 0: iconName = "playing"; break;
      case 1: iconName = "streaming"; break;
      case 2: iconName = "listening"; break;
      case 3: iconName = "watching"; break;
      case 5: iconName = "competing"; break;
      default: iconName = "discord";
    }

    if (activity.name === "Amazon Music") iconName = "amazon-music";
    if (activity.name === "Spotify") iconName = "spotify";
    if (activity.name === "Visual Studio Code") iconName = "vscode";

    return (
      <img
        src={`/icons/${iconName}.svg`}
        alt={iconName}
        className={styles["activity-icon"]}
        draggable={false}
      />
    );
  };

  // Large image
  const getLargeImageUrl = (activity) => {
    if (activity.assets?.large_image) {
      const img = activity.assets.large_image;

      if (img.startsWith("spotify:")) {
        const albumId = img.split(":")[1];
        return `https://i.scdn.co/image/${albumId}`;
      }

      if (img.startsWith("mp:external/")) {
        return img.replace("mp:", "https://media.discordapp.net/");
      }

      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp?size=512`;
    }

    if (activity.application_id && !activity.assets?.large_image) {
      return `https://dcdn.dstn.to/app-icons/${activity.application_id}.webp?size=512`;
    }

    return "/discord-icon-square-blue.png";
  };

  const getSmallImageUrl = (activity) => {
    const img = activity.assets?.small_image;
    if (!img) return null;

    // if (img.startsWith("spotify:")) {
    //   const id = img.split(":")[1];
    //   return `https://i.scdn.co/image/${id}`;
    // }

    if (img.startsWith("mp:external/")) {
      return img.replace("mp:", "https://media.discordapp.net/");
    }

    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.webp?size=256`;
  };

  // Smart duration formatter: 3:32 or 1:01:36
  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${m}:${String(s).padStart(2, "0")}`;
  };

  // LIVE elapsed timer
  const formatElapsed = (activity) => {
    const start = activity?.timestamps?.start;
    const end = activity?.timestamps?.end;

    if (!start) return null;

    // Current elapsed time in seconds
    let diffSeconds = Math.floor((now - start) / 1000);

    // If there's an end timestamp, clamp the timer so it never exceeds it
    if (end) {
      const maxSeconds = Math.floor((end - start) / 1000);
      diffSeconds = Math.min(diffSeconds, maxSeconds);
    }

    return formatDuration(diffSeconds);
  };


  return (
    <div className={styles["activities-list"]}>
      {activities
        .filter((activity) => !(activity?.id && String(activity.id) === "custom"))
        .map((activity, index) => (
          <div key={activity.id || index} className={styles["activity-list-item"]}>
            <div className={styles["activity-body"]}>
              {/* <img
                className={styles["activity-image"]}
                src={getLargeImageUrl(activity)}
                alt={activity.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/discord-icon-square-blue.png";
                }}
              /> */}
              <div className={styles["activity-image-wrapper"]}>
                <img
                  className={styles["activity-image"]}
                  src={getLargeImageUrl(activity)}
                  alt={activity.name}
                />

                {activity.assets?.small_image && (
                  <img
                    className={styles["activity-small-image"]}
                    src={getSmallImageUrl(activity)}
                    alt="small icon"
                  />
                )}
              </div>

              <div className={styles["activity-text-body"]}>
                <div className={styles["activity-title"]}>
                  {activity.details || activity.name}
                </div>

                {activity.state && (
                  <div className={styles["activity-state"]}>{activity.state}</div>
                )}
              </div>
            </div>

            <hr />

            <div className={styles["activity-bottom-row"]}>
              <div className={styles["activity-verb"]}>
                {getActivityVerb(activity)} {activity.name}
              </div>

              <div className={styles["activity-timer"]}>
                {formatElapsed(activity)}
              </div>

              {getPlatformIcon(activity)}
            </div>
          </div>
        ))}
    </div>
  );
}
