"use client";

import React, { useEffect } from "react";
import Styles from "./page.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchData } from "./redux/StandingsActions";
import TableMain from "@/components/TableMain";
import Avatar from "@/components/Avatar";

const Standings: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isLoadingLeagues, leagues, errorLeagues, standings } = useSelector(
    (state: RootState) => state.standings
  );

  console.log({ isLoadingLeagues, leagues, errorLeagues, standings });

  useEffect(() => {
    !isLoadingLeagues && dispatch(fetchData());
  }, [dispatch, fetchData]);

  const data = standings.map((team, index) => {
    return {
      id: `${team?.league?.league_id}__${team.roster_id}`,
      columns: [
        {
          text: index + 1,
          colspan: 1,
        },
        {
          text: (
            <>
              <Avatar id={team.avatar} type="U" text={team.username} />
            </>
          ),
          colspan: 3,
        },
        {
          text: `${team.wins}-${team.losses}${
            team.ties > 0 ? `-${team.ties}` : ""
          }`,
          colspan: 3,
        },
        {
          text: `${team.fpts} - ${team.fpts_against}`,
          colspan: 3,
        },
        {
          text: team.league?.name?.replace("Ring of Fire:", "") || "-",
          colspan: 2,
        },
      ],
    };
  });

  return (
    <div className={Styles.heading}>
      <h1>Standings</h1>

      <TableMain
        headers={[
          { text: "Rnk", colspan: 1 },
          { text: "Manager", colspan: 3 },
          { text: "Record", colspan: 3 },
          { text: "Fpts/Against", colspan: 3 },
          { text: "Division", colspan: 2 },
        ]}
        data={data}
      />
    </div>
  );
};

export default Standings;
