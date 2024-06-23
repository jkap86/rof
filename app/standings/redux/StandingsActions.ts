import { AppDispatch } from "@/redux/store";
import { League, Allplayer } from "@/lib/types";
import axios from "axios";

export interface fetchAllplayersStartAction {
  type: "FETCH_ALLPLAYERS_START";
}

export interface setStateAllplayersAction {
  type: "SET_STATE_ALLPLAYERS";
  payload: { [key: string]: Allplayer };
}

export interface setAllplayersErrorAction {
  type: "FETCH_ALLPLAYERS_ERROR";
  payload: Error;
}

export interface fetchLeaguesStartAction {
  type: "FETCH_LEAGUES_START";
}

export interface SetStateLeaguesAction {
  type: "SET_STATE_LEAGUES";
  payload: {
    season: string;
    leagues: League[];
  };
}

export interface setLeaguesErrorAction {
  type: "FETCH_LEAGUES_ERROR";
  payload: {
    season: string;
    message: string;
  };
}

export interface setStateStandingsAction {
  type: "SET_STATE_STANDINGS";
  payload: {
    season: string;
    standings: [];
  };
}

export interface setActiveAction {
  type: "SET_ACTIVE_STANDINGS";
  payload: string;
}

export interface setSearchedAction {
  type: "SET_SEARCHED_STANDINGS";
  payload: {
    key: string;
    value: string;
  };
}
export type StandingsActionTypes =
  | fetchAllplayersStartAction
  | setStateAllplayersAction
  | setAllplayersErrorAction
  | fetchLeaguesStartAction
  | SetStateLeaguesAction
  | setLeaguesErrorAction
  | setStateStandingsAction
  | setActiveAction
  | setSearchedAction;

export const fetchAllplayersStart = (): fetchAllplayersStartAction => ({
  type: "FETCH_ALLPLAYERS_START",
});

export const setStateAllplayers = (allplayers: {
  [key: string]: Allplayer;
}): setStateAllplayersAction => ({
  type: "SET_STATE_ALLPLAYERS",
  payload: allplayers,
});

export const setAllplayersError = (error: Error): setAllplayersErrorAction => ({
  type: "FETCH_ALLPLAYERS_ERROR",
  payload: error,
});

export const fetchLeaguesStart = (): fetchLeaguesStartAction => ({
  type: "FETCH_LEAGUES_START",
});

export const setStateLeagues = (
  season: string,
  leagues: []
): SetStateLeaguesAction => ({
  type: "SET_STATE_LEAGUES",
  payload: {
    season: season,
    leagues: leagues,
  },
});

export const setLeaguesError = (
  season: string,
  error_message: string
): setLeaguesErrorAction => ({
  type: "FETCH_LEAGUES_ERROR",
  payload: {
    season: season.toString(),
    message: error_message,
  },
});

export const setStateStandings = (
  season: string,
  standings: []
): setStateStandingsAction => ({
  type: "SET_STATE_STANDINGS",
  payload: {
    season: season,
    standings: standings,
  },
});

export const fetchAllPlayers = () => async (dispatch: AppDispatch) => {
  dispatch(fetchAllplayersStart());

  try {
    const response: { data: Allplayer[] } = await axios.get("/api/allplayers");

    const ap: { [key: string]: Allplayer } = {};

    response.data.forEach((player_obj: Allplayer) => {
      ap[player_obj.player_id] = player_obj;
    });

    dispatch(setStateAllplayers(ap));
  } catch (err: any) {
    console.log(err);

    dispatch(setAllplayersError(err));
  }
};

export const fetchData = (season: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchLeaguesStart());

  try {
    const response = await axios.get("/api/standings", {
      params: { season: season },
    });

    dispatch(setStateLeagues(season, response.data));

    const standings = response.data;

    dispatch(setStateStandings(season, standings));
  } catch (err: any) {
    console.log(err);

    dispatch(setLeaguesError(season, err.message));
  }
};

export const setActive = (id: string): setActiveAction => ({
  type: "SET_ACTIVE_STANDINGS",
  payload: id,
});

export const setSearched = (key: string, value: string): setSearchedAction => ({
  type: "SET_SEARCHED_STANDINGS",
  payload: {
    key: key,
    value: value,
  },
});
