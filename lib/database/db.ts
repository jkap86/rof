import fs from "fs";
import { League, Allplayer } from "../types";

/*
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:password123@localhost:5432/rof'

const pool = new Pool({
    connectionString: connectionString
})
*/

export const getStandings = async () => {
  const standings = fs.readFileSync(
    "./lib/database/tables/standings.json",
    "utf8"
  );

  return JSON.parse(standings);
};

export const saveUpdatedStandings = async (
  season: string,
  updatedLeagues: League[] = []
) => {
  const updatedLeague_ids = updatedLeagues.map((league) => league.league_id);
  const standings = fs.readFileSync(
    "./lib/database/tables/standings.json",
    "utf8"
  );

  const standings_parsed = JSON.parse(standings);

  fs.writeFileSync(
    "./lib/database/tables/standings.json",
    JSON.stringify({
      ...standings_parsed,
      [season]: [
        ...(standings_parsed[season] || [])?.filter(
          (league: League) => !updatedLeague_ids.includes(league.league_id)
        ),
        ...updatedLeagues,
      ],
    })
  );
};

export const getAllPlayers = async () => {
  const allplayers = fs.readFileSync(
    "./lib/database/tables/allplayers.json",
    "utf8"
  );

  return JSON.parse(allplayers);
};

export const saveAllPlayers = async (allplayers: Allplayer[]) => {
  fs.writeFileSync(
    "./lib/database/tables/allplayers.json",
    JSON.stringify({
      players: allplayers,
      updatedAt: new Date().getTime(),
    })
  );
};
