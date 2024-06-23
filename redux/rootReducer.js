import { combineReducers } from "redux";
import StandingsReducer from "../app/standings/redux/StandingsReducer";

const rootReducer = combineReducers({
  standings: StandingsReducer,
});

export default rootReducer;
