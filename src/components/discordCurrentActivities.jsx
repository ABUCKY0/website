import React, { useEffect, useState } from "react";

import styles from "../styles/discordCurrentActivities.module.css";


export default function DiscordCurrentActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("https://api.lanyard.rest/v1/users/925248483135463454")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data.activities)) {
          setActivities(data.data.activities);
        }
      });
  }, []);

  if (!activities.length) return null;

  const getActivityVerb = (activity) => {
    if (activity.type === 0) return "Playing";
    if (activity.type === 1) return "Streaming";
    if (activity.type === 2) return "Listening on";
    if (activity.type === 3) return "Watching";
    //4 is custom and not supported by discord's api so we're gonna ingore it and hope it never gets used
    if (activity.type === 5) return "Competing in";
    return "Using";
  };

  const getPlatformIcon = (activity) => {
    let iconName = "discord";
    if (typeof activity.type === "number") {
      switch (activity.type) {
        case 0:
          iconName = "playing";
          break;
        case 1:
          iconName = "streaming";
          break;
        case 2:
          iconName = "listening";
          break;
        case 3:
          iconName = "watching";
          break;
        case 5:
          iconName = "competing";
        default:
          iconName = "discord";
      }
    }

    // if activity name is amazon music or vscode, use those
    if (activity.name === "Amazon Music") {
      iconName = "amazon-music";
    }
    if (activity.name === "Visual Studio Code") {
      iconName = "vscode";
    }

    return (
      <img
        src={`/icons/${iconName}.svg`}
        alt={iconName}
        className={styles["activity-icon"]}
        draggable={false}
      />
    );
  };

  const getLargeImageUrl = (activity) => {
    
    if (activity.assets && activity.assets.large_image) {
      const img = activity.assets.large_image;
      console.log(img);

      // Handle Spotify album art
      if (img.startsWith("spotify:")) {
        // Format: spotify:<album_id>
        const albumId = img.split(":")[1];
        if (albumId) {
          return `https://i.scdn.co/image/${albumId}`;
        }
      }

      // ✅ Fixed mp:external parsing
      if (img.startsWith("mp:external/")) {
        const parts = img.split("/");
        const maybeProtocol = parts[2];
        if (maybeProtocol === "https" || maybeProtocol === "http") {
          return `${maybeProtocol}://${parts.slice(3).join("/")}`;
        }
        // fallback to CDN format if malformed
        if (activity.application_id) {
          return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
        }
      }

      if (/^\d+$/.test(img) && activity.application_id) {
        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
      }

      if (activity.application_id) {
        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
      }
    }

    return "/icons/discord.svg"; 
  };

  return (
    <div className={styles["activities-list"]}>
      {activities.map((activity, index) => (


        <div key={index} className={styles["activity-list-item"]}>

          <div className={styles["activity-top-row"]}>
            {getActivityVerb(activity)} {activity.name}

            {getPlatformIcon(activity)}
          </div>
          <div className={styles["activity-body"]}>
            <img
              className={styles["activity-image"]}
              src={getLargeImageUrl(activity)}
              alt={activity.name}
            />
            <div className={styles["activity-text-body"]}>
              <div className={styles["activity-title"]}>
                {activity.details || activity.name}
              </div>
              {activity.state && (
                <div className={styles["activity-state"]}>{activity.state}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
