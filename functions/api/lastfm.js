// functions/api/lastfm.js
import { getLastFmTrack } from "../../src/lib/lastfm.js";

const CACHE_TTL_SECONDS = 15;

export async function onRequestGet({ request, env }) {
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/lastfm", request.url), request);
  try {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  } catch (error) {
    console.warn("Last.fm cache read failed:", error);
  }

  try {
    const response = Response.json(
      { track: await getLastFmTrack(env.LASTFM_API_KEY) },
      {
        headers: {
          "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`,
        },
      }
    );

    try {
      await cache.put(cacheKey, response.clone());
    } catch (error) {
      console.warn("Last.fm cache write failed:", error);
    }
    return response;
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
