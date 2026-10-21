// src/lib/lastfm.js
const LASTFM_USERNAME = "ABUCKY0";
const REQUEST_TIMEOUT_MS = 5_000;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function textOr(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export async function getLastFmTrack(apiKey) {
  if (!apiKey) {
    throw new Error("LASTFM_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    format: "json",
    limit: "1",
    method: "user.getrecenttracks",
    user: LASTFM_USERNAME,
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Last.fm request failed: HTTP ${response.status}`);
  }

  // Let invalid JSON and body-read timeouts propagate to the endpoint's handler.
  const data = await response.json();
  if (!isObject(data)) {
    throw new Error("Last.fm returned an invalid response");
  }

  if (data.error) {
    const detail = textOr(data.message, "Unknown API error");
    throw new Error(`Last.fm request failed: ${detail}`);
  }

  if (!isObject(data.recenttracks) || !Array.isArray(data.recenttracks.track)) {
    throw new Error("Last.fm returned an invalid track list");
  }

  if (data.recenttracks.track.length === 0) {
    return null;
  }

  const recentTrack = data.recenttracks.track[0];
  if (!isObject(recentTrack) || typeof recentTrack.name !== "string") {
    throw new Error("Last.fm returned an invalid track");
  }

  const images = Array.isArray(recentTrack.image) ? recentTrack.image : [];
  const imageFor = (size) => images.find(
    (item) => isObject(item) && item.size === size && textOr(item["#text"], "")
  )?.["#text"];

  return {
    artist: textOr(recentTrack.artist?.["#text"], "Unknown artist"),
    album: textOr(recentTrack.album?.["#text"], "Unknown album"),
    name: textOr(recentTrack.name, "Unknown track"),
    image: imageFor("extralarge") || imageFor("large") || "",
    nowPlaying: recentTrack["@attr"]?.nowplaying === "true",
  };
}
