"use client";

import React, { useEffect, useState } from "react";
import Styles from "./page.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import {
  fetchAllPlayers,
  fetchData,
  setActive,
  setSearched,
} from "../redux/StandingsActions";
import TableMain from "@/components/TableMain";
import Avatar from "@/components/Avatar";
import Team from "@/components/Team";
import Search from "@/components/Search";
import { Allplayer } from "@/lib/types";

interface StandingsProps {
  params: { season: string };
}

const Standings: React.FC<StandingsProps> = ({ params }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const {
    allplayers,
    isLoadingAllplayers,
    errorAllplayers,
    isLoadingLeagues,
    leagues,
    errorLeagues,
    standings,
    active,
    searched,
  } = useSelector((state: RootState) => state.standings);
  const [page, setPage] = useState(1);

  console.log({ searched });
  useEffect(() => {
    if (allplayers === false && !isLoadingAllplayers) {
      dispatch(fetchAllPlayers());
    }
  }, [allplayers, isLoadingAllplayers, dispatch, fetchAllPlayers]);

  useEffect(() => {
    !isLoadingLeagues &&
      !leagues[params.season] &&
      dispatch(fetchData(params.season));
  }, [dispatch, fetchData, params.season, isLoadingLeagues, leagues]);

  const standings_season = [...(standings?.[params.season] || [])].sort(
    (a, b) => b.wins - a.wins || a.losses - b.losses || b.fpts - a.fpts
  );

  const data = standings_season
    .filter(
      (team) =>
        (searched.manager.trim() === "" || team.user_id === searched.manager) &&
        (searched.player.trim() === "" ||
          [...team.starters, ...team.bench, ...team.ir, ...team.taxi].includes(
            searched.player
          )) &&
        (searched.league.trim() === "" ||
          team.league.league_id === searched.league)
    )
    .map((team, index) => {
      return {
        id: `${team?.league?.league_id}__${team.roster_id}`,
        columns: [
          {
            text: index + 1,
            colspan: 1,
          },
          {
            text: <Avatar id={team.avatar} type="U" text={team.username} />,
            colspan: 3,
            classname: "left",
          },
          {
            text: `${team.wins}-${team.losses}${
              team.ties > 0 ? `-${team.ties}` : ""
            }`,
            colspan: 2,
          },
          {
            text: `${team.fpts.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })} - ${team.fpts_against.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}`,
            colspan: 4,
          },
          {
            text: (
              <Avatar
                id={team.league?.avatar || "0"}
                type="L"
                text={team.league?.name?.replace("Ring of Fire:", "") || "-"}
              />
            ),
            colspan: 3,
          },
        ],
        secondaryTable: (
          <Team
            roster_id={team.roster_id}
            user_id={team.user_id}
            username={team.username}
            avatar={team.avatar}
            starters={team.starters}
            bench={team.bench}
            ir={team.ir}
            taxi={team.taxi}
            draftpicks={team.draftpicks}
            wins={team.wins}
            losses={team.losses}
            ties={team.ties}
            fpts={team.fpts}
            fpts_against={team.fpts_against}
            league={team.league}
          />
        ),
      };
    });

  const options_manager: {
    [key: string]: {
      id: string;
      text: string;
    };
  } = {};

  const options_player: {
    id: string;
    text: string;
  }[] = Object.values(allplayers).map((player_obj: Allplayer) => {
    return {
      id: player_obj.player_id,
      text: player_obj.full_name,
    };
  });

  const options_league: {
    [key: string]: {
      id: string;
      text: string;
    };
  } = {};

  standings_season.forEach((team) => {
    options_manager[team.user_id] = {
      id: team.user_id,
      text: team.username,
    };

    options_league[team.league.league_id] = {
      id: team.league.league_id,
      text: team.league.name.replace("Ring of Fire: ", ""),
    };
  });

  return (
    <div className={Styles.heading}>
      <h1>Standings</h1>
      <h3>
        <select
          value={params.season}
          onChange={(e) => router.push(`/standings/${e.target.value}`)}
          className={Styles.season}
          disabled={isLoadingLeagues}
        >
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
          <option>2021</option>
        </select>
      </h3>
      {isLoadingAllplayers || isLoadingLeagues ? (
        <h1>LOADING...</h1>
      ) : (
        <>
          <div className="searches">
            <Search
              searched={searched.manager}
              options={Object.values(options_manager)}
              setSearched={(value) => dispatch(setSearched("manager", value))}
              placeholder="Search Managers"
            />
            <Search
              searched={searched.player}
              options={options_player}
              setSearched={(value) => dispatch(setSearched("player", value))}
              placeholder="Search Players"
            />
            <Search
              searched={searched.league}
              options={Object.values(options_league)}
              setSearched={(value) => dispatch(setSearched("league", value))}
              placeholder="Search Leagues"
            />
          </div>
          <TableMain
            type={1}
            headers={[
              { text: "Rnk", colspan: 1 },
              { text: "Manager", colspan: 3 },
              { text: "Record", colspan: 2 },
              { text: "Fpts/Against", colspan: 4 },
              { text: "Division", colspan: 3 },
            ]}
            data={data}
            active={active}
            setActive={(value) => dispatch(setActive(value))}
            page={page}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
};

export default Standings;
