export interface RegisterResultRequestDTO {
  homeGoals: number;
  awayGoals: number;
}

export interface RegisterEventRequestDTO {
  type: string;
  playerId: number;
  minute: number;
}

export interface UpdateMatchStatusRequestDTO {
  status: string;
}
