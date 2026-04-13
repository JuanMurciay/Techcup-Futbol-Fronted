export interface AuthUser {
  email: string;
  role: string;
  token: string;
}

export interface ProfileDTO {
  id: number;
  fullName: string;
  email: string;
  userType: string;
  profilePhoto?: string;
  jerseyNumber?: number;
  position?: string;
  identification?: string;
  gender?: string;
  birthDate?: string;
  program?: string;
  teamId?: number;
  semester?: number;
}

export interface Team {
  id: number;
  name: string;
  colors?: string;
  shieldUrl?: string;
  paymentStatus?: string;
  players?: ProfileDTO[];
}

export interface Tournament {
  id: number;
  startDate: string;
  endDate: string;
  teamCost: number;
  numberOfTeams: number;
  rules?: string;
  regulations?: string;
  status: string;
  matches?: Match[];
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  field?: string;
  status: string;
  homeGoals?: number;
  awayGoals?: number;
  tournamentId?: number;
  lineups?: unknown;
}

export interface MatchEvent {
  id: number;
  type: string;
  playerId: number;
  minute: number;
  matchId?: number;
}

export interface StandingDTO {
  teamId: number;
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PlayerRegistrationRequest {
  name: string;
  identification: string;
  email: string;
  password: string;
  userType: string;
  jerseyNumber: number;
  position: string;
  gender?: string;
  birthDate?: string;
  program?: string;
  semester?: number;
}

export interface PlayerStats {
  playerId: number;
  playerName: string;
  goals: number;
  yellowCards: number;
  redCards: number;
  teamId?: number;
  teamName?: string;
}

export interface Payment {
  id: number;
  teamId: number;
  status: string;
  receiptUrl?: string;
  approvedBy?: string;
  comments?: string;
}

export interface RefereeUser {
  id: number;
  fullName: string;
  email: string;
  licenseNumber?: string;
}
