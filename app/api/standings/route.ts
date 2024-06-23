import { getStandings, saveUpdatedStandings } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { league_ids } from "../LEAGUE_IDS";
import axiosInstance from "@/lib/axiosInstance";
import {
  SleeperLeague,
  SleeperRoster,
  SleeperUser,
  SleeperDraft,
  SleeperDraftpick,
  League,
  Draftpick,
  LeagueTeam,
} from "@/lib/types";
import fs from "fs";

const getTeamDraftPicks = (
  league: SleeperLeague,
  rosters: SleeperRoster[],
  users: SleeperUser[],
  drafts: SleeperDraft[],
  traded_picks: SleeperDraftpick[]
) => {
  const upcoming_draft = drafts.find(
    (x) =>
      x.status !== "complete" &&
      x.settings.rounds === league.settings.draft_rounds
  );

  const draft_season = upcoming_draft
    ? parseInt(league.season)
    : parseInt(league.season) + 1;

  const draft_order = upcoming_draft?.draft_order;

  const draft_picks_league: {
    [key: number]: Draftpick[];
  } = {};

  rosters.forEach((roster) => {
    const draft_picks_team: Draftpick[] = [];

    const user = users.find((u) => u.user_id === roster.owner_id);

    // loop through seasons (draft season and next two seasons)

    for (let j = draft_season; j <= draft_season + 2; j++) {
      // loop through rookie draft rounds

      for (let k = 1; k <= league.settings.draft_rounds; k++) {
        // check if each rookie pick is in traded picks

        const isTraded = traded_picks.find(
          (pick: SleeperDraftpick) =>
            parseInt(pick.season) === j &&
            pick.round === k &&
            pick.roster_id === roster.roster_id
        );

        // if it is not in traded picks, add to original manager

        if (!isTraded) {
          draft_picks_team.push({
            season: j,
            round: k,
            roster_id: roster.roster_id,
            original_user: {
              avatar: user?.avatar || "",
              user_id: roster.owner_id,
              username: user?.display_name || "Orphan",
            },
            order:
              (draft_order &&
                j === parseInt(upcoming_draft.season) &&
                draft_order[roster?.owner_id]) ||
              null,
          });
        }
      }
    }

    traded_picks
      .filter(
        (x) =>
          x.owner_id === roster.roster_id && parseInt(x.season) >= draft_season
      )
      .forEach((pick) => {
        const original_roster = rosters.find(
          (t) => t.roster_id === pick.roster_id
        );

        const original_user = users.find(
          (u) => u.user_id === original_roster?.owner_id
        );

        original_roster &&
          draft_picks_team.push({
            season: parseInt(pick.season),
            round: pick.round,
            roster_id: pick.roster_id,
            original_user: {
              avatar: original_user?.avatar || "",
              user_id: original_user?.user_id || "",
              username: original_user?.display_name || "Orphan",
            },
            order:
              (original_user &&
                draft_order &&
                parseInt(pick.season) === parseInt(upcoming_draft.season) &&
                draft_order[original_user?.user_id]) ||
              null,
          });
      });

    traded_picks
      .filter(
        (x) =>
          x.previous_owner_id === roster.roster_id &&
          parseInt(x.season) >= draft_season
      )
      .forEach((pick) => {
        const index = draft_picks_team.findIndex((obj) => {
          return (
            obj.season === parseInt(pick.season) &&
            obj.round === pick.round &&
            obj.roster_id === pick.roster_id
          );
        });

        if (index !== -1) {
          draft_picks_league[roster.roster_id].splice(index, 1);
        }
      });

    draft_picks_league[roster.roster_id] = draft_picks_team;
  });

  return draft_picks_league;
};

const updateStandings = async (league_ids_to_update: string[]) => {
  const updatedLeagues: League[] = [];

  const batchSize = 10;

  for (let i = 0; i < league_ids_to_update.length; i += batchSize) {
    const leagues_batch = await Promise.all(
      league_ids_to_update.slice(i, i + batchSize).map(async (league_id) => {
        const league = await axiosInstance.get(
          `https://api.sleeper.app/v1/league/${league_id}`
        );
        const rosters = await axiosInstance.get(
          `https://api.sleeper.app/v1/league/${league_id}/rosters`
        );
        const users = await axiosInstance.get(
          `https://api.sleeper.app/v1/league/${league_id}/users`
        );
        const drafts = await axiosInstance.get(
          `https://api.sleeper.app/v1/league/${league_id}/drafts`
        );
        const traded_picks = await axiosInstance.get(
          `https://api.sleeper.app/v1/league/${league_id}/traded_picks`
        );

        const teams_draftpicks = getTeamDraftPicks(
          league.data,
          rosters.data,
          users.data,
          drafts.data,
          traded_picks.data
        );
        const rosters_userinfo: LeagueTeam[] = [];

        rosters.data.forEach((roster: SleeperRoster) => {
          const user = users.data.find(
            (user: SleeperUser) => user.user_id === roster.owner_id
          );

          rosters_userinfo.push({
            user_id: user?.user_id || "0",
            username: user?.display_name || "Orphan",
            avatar: user?.avatar,
            roster_id: roster.roster_id,
            starters: roster.starters,
            bench: roster.players.filter(
              (player_id: string) =>
                ![
                  ...roster.starters,
                  roster.taxi || [],
                  roster.reserve || [],
                ].includes(player_id)
            ),
            ir: roster.reserve || [],
            taxi: roster.taxi || [],
            draftpicks: teams_draftpicks[roster.roster_id],
            wins: roster.settings.wins,
            losses: roster.settings.losses,
            ties: roster.settings.ties,
            fpts: parseFloat(
              `${roster.settings.fpts || 0}.${
                roster.settings.fpts_decimal || 0
              }`
            ),
            fpts_against: parseFloat(
              `${roster.settings.fpts_against || 0}.${
                roster.settings.fpts_against_decimal || 0
              }`
            ),
          });
        });

        return {
          league_id: league.data.league_id,
          name: league.data.name,
          avatar: league.data.avatar,
          season: league.data.season,
          settings: league.data.settings,
          teams: rosters_userinfo,
          roster_positions: league.data.roster_positions,
          updatedAt: new Date().getTime(),
        };
      })
    );

    updatedLeagues.push(...leagues_batch);
  }

  return updatedLeagues;
};

export async function GET(req: NextRequest) {
  const cutoff = 1 * 60 * 60 * 1000;

  const { searchParams } = new URL(req.url);

  const season: string = searchParams.get("season")?.toString() || "";

  try {
    const standings = await getStandings();

    const leagues_up_to_date = (standings?.[season] || []).filter(
      (league: League) =>
        league.updatedAt > new Date(new Date().getTime() - cutoff).getTime()
    );

    const league_ids_to_update = league_ids[season].filter(
      (league_id) =>
        !(
          (standings?.[season] || []).find(
            (league: League) => league.league_id === league_id
          )?.updatedAt > new Date(new Date().getTime() - cutoff).getTime()
        )
    );

    let leagues_updated: League[] = [];

    if (league_ids_to_update.length > 0) {
      leagues_updated = await updateStandings(league_ids_to_update);

      await saveUpdatedStandings(season, leagues_updated);
    }

    const standings_updated = [...leagues_up_to_date, ...leagues_updated]
      .map((league: League) =>
        league.teams.map((team) => {
          return {
            ...team,
            league: {
              league_id: league.league_id,
              name: league.name,
              avatar: league.avatar,
              roster_positions: league.roster_positions,
            },
          };
        })
      )
      .flat();

    return NextResponse.json(standings_updated, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching standings: ", error);

    return NextResponse.json(
      { error: "Failed to fetch standings" },
      { status: 500 }
    );
  }
}

const getPrevLEAGUE_IDS = async (season: string) => {
  const league_ids_season = league_ids[season];

  const prev: string[] = [];

  await Promise.all(
    league_ids_season.map(async (league_id: string) => {
      const league = await axiosInstance.get(
        `https://api.sleeper.app/v1/league/${league_id}`
      );

      if (league.data.previous_league_id) {
        prev.push(league.data.previous_league_id);
      }
    })
  );

  console.log({ [parseInt(season) - 1]: { length: prev.length, ids: prev } });
};
