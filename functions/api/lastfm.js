const LASTFM_USERNAME = "ABUCKY0";

export async function onRequestGet({ env }) {
  const apiKey = env.LASTFM_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "LASTFM_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    format: "json",
    limit: "1",
    method: "user.getrecenttracks",
    user: LASTFM_USERNAME,
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);

  if (!response.ok) {
    return Response.json(
      { error: "Last.fm returned an unsuccessful response" },
      { status: 502 }
    );
  }

  const data = await response.json();
  const recentTrack = data.recenttracks?.track?.[0];

  if (!recentTrack) {
    return Response.json(
      { track: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return Response.json(
    {
      track: {
        artist: recentTrack.artist?.["#text"] || "Unknown artist",
        name: recentTrack.name || "Unknown track",
        nowPlaying: recentTrack["@attr"]?.nowplaying === "true",
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
