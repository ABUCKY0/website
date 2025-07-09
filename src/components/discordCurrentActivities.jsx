import React, { useEffect, useState } from "react";

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

  // Map activity types to verbs
  const getActivityVerb = (activity) => {
    if (activity.type === 2) return "Listening to"; // Spotify
    if (activity.type === 0) return "Playing";      // Games
    if (activity.type === 1) return "Streaming";
    if (activity.type === 3) return "Watching";
    return "using";
  };

  return (
    <p className="footer-text">
      &middot;{" "}
      {activities
        .map((a) => `${getActivityVerb(a)} ${a.name}`)
        .join(" · ")}
    </p>
  );
}