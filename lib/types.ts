export type SleeperLeague = {
  season: string;
  settings: {
    draft_rounds: number;
  };
};

export type SleeperRoster = {
  roster_id: number;
  owner_id: string;
  players: string[];
  reserve?: string[];
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_decimal?: number;
    fpts_against?: number;
    fpts_against_decimal?: number;
  };
  starters: string[];
  taxi?: string[];
};

export type SleeperUser = {
  user_id: string;
  display_name: string;
  avatar: string;
};

export type SleeperDraft = {
  season: string;
  draft_order: {
    [key: string]: number;
  };
  status: string;
  settings: {
    rounds: number;
  };
};

export type SleeperDraftpick = {
  season: string;
  owner_id: number;
  roster_id: number;
  previous_owner_id: number;
  round: number;
};

export type League = {
  league_id: string;
  name: string;
  avatar: string;
  season: string;
  roster_positions: string[];
  settings: {
    draft_rounds: number;
  };
  teams: LeagueTeam[];
  updatedAt: number;
};

export type LeagueTeam = {
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
};

export type Team = {
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
};

export type Draftpick = {
  season: number;
  round: number;
  roster_id: number;
  original_user: {
    avatar: string;
    user_id: string;
    username: string;
  };
  order?: number | null;
};

export type Allplayer = {
  player_id: string;
  position: string;
  team: string;
  full_name: string;
};
