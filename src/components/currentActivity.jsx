import React, { useEffect, useState } from "react";
import styles from "../styles/discordCurrentActivities.module.css";

export const ACTIVITY_TYPES = Object.freeze({
  GAME: 0,
  MUSIC: 1
});

export default function CurrentActivity(activityType) {
  const [activities, setActivities] = useState([]);
  
  
};