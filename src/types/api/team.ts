export interface TeamCreateRequestDTO {
  name: string;
  colors: string;
}

export interface TeamInvitationRequestDTO {
  playerId: number;
}

export interface UpdateTeamShieldRequestDTO {
  shieldUrl: string;
}
