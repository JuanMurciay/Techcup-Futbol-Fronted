export interface CreateTournamentRequestDTO {
  startDate: string;
  endDate: string;
  teamCost: number;
  numberOfTeams: number;
  rules: string;
}
