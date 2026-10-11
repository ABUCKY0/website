import React from "react";
import { useLanyard } from "use-lanyard";

const DISCORD_ID = "925248483135463454";

export default function DiscordStatus() {
  const status = useLanyard(DISCORD_ID);

  if (!status) {
    return <div />;
  }

  let color = "#222";
  let statusText = "Offline";

  switch (status.discord_status) {
    case "online":
      color = "#00cc00";
      statusText = "Online";
      break;

    case "idle":
      color = "#ca9654";
      statusText = "Idle";
      break;

    case "dnd":
      color = "#ff0000";
      statusText = "Do Not Disturb";
      break;

    case "offline":
      color = "#555";
      statusText = "Offline";
      break;

    default:
      break;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "1.25rem",
          height: "1.25rem",
          borderRadius: "50%",
          backgroundColor: color,
          border: "2px solid #333",
        }}
        title={`${statusText} on Discord`}
      />
    </div>
  );
}