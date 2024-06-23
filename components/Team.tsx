import React from "react";
import { Draftpick } from "@/lib/types";
import TableMain from "./TableMain";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface TeamProps {
  roster_id: number;
  user_id: string;
  username: string;
  avatar: string;
  starters: string[];
  bench: string[];
  ir: string[];
  taxi: string[];
  draftpicks: Draftpick[];
  wins: number;
  losses: number;
  ties: number;
  fpts: number;
  fpts_against: number;
  league: {
    league_id: string;
    name: string;
    avatar: string;
    roster_positions: string[];
  };
}

const Team: React.FC<TeamProps> = ({
  roster_id,
  user_id,
  username,
  avatar,
  starters,
  bench,
  ir,
  taxi,
  draftpicks,
  wins,
  losses,
  ties,
  fpts,
  fpts_against,
  league,
}) => {
  const { allplayers } = useSelector((state: RootState) => state.standings);

  return (
    <div>
      <TableMain
        caption={<>Lineup</>}
        type={2}
        headers={[
          { text: "Slot", colspan: 1 },
          { text: "Player", colspan: 3 },
        ]}
        data={league.roster_positions
          .filter((s) => s !== "BN")
          .map((slot, index) => {
            return {
              id: `${slot}_${index}`,
              columns: [
                {
                  text: slot.replace("SUPER_FLEX", "SF").replace("FLEX", "WRT"),
                  colspan: 1,
                },
                {
                  text:
                    starters[index] === "0"
                      ? "Empty"
                      : (allplayers || {})[starters[index]].full_name +
                        " " +
                        (allplayers || {})[starters[index]].team,
                  colspan: 3,
                },
              ],
            };
          })}
        half={true}
      />
      <TableMain
        caption={<>Bench</>}
        type={2}
        headers={[
          { text: "Pos", colspan: 1 },
          { text: "Player", colspan: 3 },
        ]}
        data={[
          ...bench.map((player_id, index) => {
            return {
              id: `${player_id}_${index}_${user_id}`,
              columns: [
                {
                  text: (allplayers || {})[player_id].position,
                  colspan: 1,
                },
                {
                  text:
                    (allplayers || {})[player_id].full_name +
                    " " +
                    (allplayers || {})[player_id].team,
                  colspan: 3,
                },
              ],
            };
          }),
          ...[...draftpicks]
            .sort(
              (a, b) =>
                a.season - b.season ||
                a.round - b.round ||
                (a.order || 99) - (b.order || 99)
            )
            .map((pick, index) => {
              return {
                id: `${pick.season}_${pick.round}_${pick.original_user.user_id}`,
                columns: [
                  {
                    text:
                      pick.season +
                      " " +
                      (pick.order
                        ? pick.round +
                          "." +
                          pick.order.toLocaleString("en-US", {
                            minimumIntegerDigits: 2,
                          })
                        : `Round ${pick.round}` +
                          (pick.original_user.user_id !== user_id
                            ? `(${pick.original_user.username})`
                            : "")),
                    colspan: 4,
                  },
                ],
              };
            }),
        ]}
        half={true}
      />
    </div>
  );
};
export default Team;
