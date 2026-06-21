import React, { useEffect, useState } from "react";

export default function DiscordStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // HELLO
        if (msg.op === 1) {
          const interval = msg.d.heartbeat_interval;

          clearInterval(heartbeat);

          heartbeat = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, interval);

          ws.send(
            JSON.stringify({
              op: 2,
              d: {
                subscribe_to_id: "925248483135463454",
              },
            }),
          );

          return;
        }

        // RECONNECT
        if (msg.op === 4) {
          ws.close();
          return;
        }

        // PRESENCE DATA
        if (
          msg.t === "INIT_STATE" ||
          msg.t === "PRESENCE_UPDATE"
        ) {
          setStatus(msg.d);
          setLoading(false);
        }
      };

      ws.onclose = () => {
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

  if (loading || !status) {
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