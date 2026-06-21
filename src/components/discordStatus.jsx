import React, { useEffect, useState } from "react";

export default function DiscordStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

 // Lanyard WebSocket
  useEffect(() => {
    let ws;
    let heartbeat;
    let reconnectTimeout;

    const connect = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onopen = () => {
        console.log("Connected to Lanyard");
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        // HELLO (op 1)
        if (msg.op === 1) {
          const interval = msg.d.heartbeat_interval;

          clearInterval(heartbeat);
          heartbeat = setInterval(() => {
            ws.send(JSON.stringify({ op: 3 }));
          }, interval);

          // Subscribe AFTER HELLO
          ws.send(
            JSON.stringify({
              op: 2,
              d: { subscribe_to_id: "925248483135463454" }
            })
          );
        }

        // HEARTBEAT ACK (op 3)
        if (msg.op === 3) {
          // optional
        }

        // RECONNECT (op 4)
        if (msg.op === 4) {
          console.log("Lanyard requested reconnect");
          ws.close();
          return;
        }

        // INIT_STATE or PRESENCE_UPDATE
        if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
          if (msg.d?.activities) {
            setActivities(msg.d.activities);
          }
        }
      };

      ws.onclose = () => {
        console.log("Disconnected from Lanyard, retrying...");
        clearInterval(heartbeat);

        reconnectTimeout = setTimeout(() => {
          connect();
        }, 1000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      clearInterval(heartbeat);
      clearTimeout(reconnectTimeout);
      ws?.close();
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