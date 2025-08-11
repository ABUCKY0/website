import React, { useEffect, useState } from "react";

export default function DiscordStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

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
        if (msg.d) {
          setStatus(msg.d);
          setLoading(false);
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