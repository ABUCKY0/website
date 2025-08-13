import React, { useEffect, useState } from "react";

import styles from "../styles/discordCurrentActivities.module.css";


export default function DiscordCurrentActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://api.lanyard.rest/socket");
    let heartbeatInterval;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: "925248483135463454",
          },
        })
      );
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
        if (msg.d && Array.isArray(msg.d.activities)) {
          setActivities(msg.d.activities);
        }
      }
      // Heartbeat
      if (msg.op === 1 && typeof msg.d === "number") {
        heartbeatInterval = setInterval(() => {
          ws.send(JSON.stringify({ op: 3 }));
        }, msg.d);
      }
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    ws.onclose = () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      ws.close();
    };
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
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/discord-icon-square-blue.png"; }}
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
