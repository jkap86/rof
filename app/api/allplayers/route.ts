import { NextRequest, NextResponse } from "next/server";
import { getAllPlayers, saveAllPlayers } from "@/lib/database/db";
import axiosInstance from "@/lib/axiosInstance";
import { Allplayer } from "@/lib/types";

export async function GET(req: NextRequest) {
  const cutoff = 24 * 60 * 60 * 1000;

  try {
    const allplayers = await getAllPlayers();

    if (
      allplayers.updatedAt < new Date(new Date().getTime() - cutoff).getTime()
    ) {
      const allplayers_updated = await axiosInstance.get(
        "https://api.sleeper.app/v1/players/nfl"
      );

      console.log({
        allplayers_updated: Object.keys(allplayers_updated.data).length,
      });
      const allplayers_updated_array: Allplayer[] = [];

      Object.values(allplayers_updated.data).forEach((value) => {
        const player_obj = value as Allplayer;

        if (["QB", "RB", "FB", "WR", "TE"].includes(player_obj.position)) {
          allplayers_updated_array.push({
            player_id: player_obj.player_id,
            position: player_obj.position,
            team: player_obj.team || "FA",
            full_name: player_obj.full_name,
          });
        }
      });

      console.log({
        allplayers_updated_array: allplayers_updated_array.length,
      });

      await saveAllPlayers(allplayers_updated_array);

      return NextResponse.json(allplayers_updated_array, { status: 200 });
    } else {
      return NextResponse.json(allplayers.players, {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error fetching players: ", error);

    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
