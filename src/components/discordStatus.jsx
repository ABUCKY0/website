import React, { useEffect, useState } from "react";

export default function DiscordStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.lanyard.rest/v1/users/925248483135463454")
      .then((res) => {
        console.log("Fetch response:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setStatus(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div></div>;
  if (!status) return <div></div>;
  let color;
  if (status.discord_status === "online") {
    color = "#00cc00";
  } else if (status.discord_status === "idle") {
    color = "#ca9654";
  } else if (status.discord_status === "dnd") {
    color = "red";
    status.discord_status = "Do Not Disturb";
  } else {
    color = "#222";
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span
        style={{
          display: "inline-block",
          width: "1.25rem",
          height: "1.25rem",
          borderRadius: "50%",
          backgroundColor: color,
          border: "2px solid #333",
          verticalAlign: "middle",
        }}
        title={(status.discord_status).charAt(0).toUpperCase() + (status.discord_status).slice(1) + " on Discord"}
        
      ></span>
    </div>
  );
}