// src/pages/api/lastfm.js
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getLastFmTrack } from "../../lib/lastfm.js";

function getDevVar(name) {
  const varsPath = fileURLToPath(new URL("../../../.dev.vars", import.meta.url));
  if (!existsSync(varsPath)) {
    return undefined;
  }

  const line = readFileSync(varsPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${name}=`));

  return line?.slice(name.length + 1).trim();
}

export async function GET() {
  try {
    const apiKey = process.env.LASTFM_API_KEY || getDevVar("LASTFM_API_KEY");

    return Response.json(
      { track: await getLastFmTrack(apiKey) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}