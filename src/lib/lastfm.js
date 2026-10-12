// src/lib/lastfm.js
const LASTFM_USERNAME = "ABUCKY0";

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

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
  const data = await response.json().catch(() => null);

  if (!response.ok || data?.error) {
    const detail = data?.message || `HTTP ${response.status}`;
    throw new Error(`Last.fm request failed: ${detail}`);
  }

  const recentTrack = data.recenttracks?.track?.[0];

  if (!recentTrack) {
    return null;
  }

  return {
    artist: recentTrack.artist?.["#text"] || "Unknown artist",
    album: recentTrack.album?.["#text"] || "Unknown album",
    name: recentTrack.name || "Unknown track",
    image:
      recentTrack.image?.find((item) => item.size === "extralarge")?.["#text"] ||
      recentTrack.image?.find((item) => item.size === "large")?.["#text"] ||
      "",
    nowPlaying: recentTrack["@attr"]?.nowplaying === "true",
  };
}