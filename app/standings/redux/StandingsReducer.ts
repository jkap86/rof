import { produce, WritableDraft } from "immer";
import { League, Team, Allplayer } from "@/lib/types";
import { StandingsActionTypes } from "./StandingsActions";

export type StandingsState = {
  season: string;
  allplayers: { [key: string]: Allplayer } | false;
  isLoadingAllplayers: boolean;
  errorAllplayers: Error | null;
  isLoadingLeagues: boolean;
  leagues: { [key: string]: League[] };
  errorLeagues: { [key: string]: string };
  standings: { [key: string]: Team[] };
  active: string;
  page: number;
  searched: {
    manager: string;
    player: string;
    league: string;
  };
};

const initialState: StandingsState = {
  season: "2024",
  allplayers: false,
  isLoadingAllplayers: false,
  errorAllplayers: null,
  isLoadingLeagues: false,
  leagues: {},
  errorLeagues: {},
  standings: {
    "2024": [],
  },
  active: "",
  page: 1,
  searched: {
    manager: "",
    player: "",
    league: "",
  },
};

const StandingsReducer = (
  state = initialState,
  action: StandingsActionTypes
) => {
  return produce(state, (draft: WritableDraft<StandingsState>) => {
    switch (action.type) {
      case "FETCH_ALLPLAYERS_START":
        draft.isLoadingAllplayers = true;
        break;
      case "SET_STATE_ALLPLAYERS":
        draft.isLoadingAllplayers = false;
        draft.allplayers = action.payload;
        break;
      case "FETCH_ALLPLAYERS_ERROR":
        draft.isLoadingAllplayers = false;
        draft.errorAllplayers = action.payload;
        break;
      case "FETCH_LEAGUES_START":
        draft.isLoadingLeagues = true;
        break;
      case "SET_STATE_LEAGUES":
        draft.isLoadingLeagues = false;
        draft.leagues[action.payload.season] = action.payload.leagues;
        break;
      case "FETCH_LEAGUES_ERROR":
        draft.isLoadingLeagues = false;
        draft.errorLeagues[action.payload.season] = action.payload.message;
        break;
      case "SET_STATE_STANDINGS":
        draft.standings[action.payload.season] = action.payload.standings;
        break;
      case "SET_ACTIVE_STANDINGS":
        draft.active = action.payload;
        break;
      case "SET_SEARCHED_STANDINGS":
        draft.searched = {
          ...draft.searched,
          [action.payload.key]: action.payload.value,
        };
      default:
        break;
    }
  });
};

export default StandingsReducer;
