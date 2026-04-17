export interface UpdatePositionRequestDTO {
  position: string;
}

export interface UpdateAvailabilityRequestDTO {
  available: boolean;
}

export interface UpdateJerseyRequestDTO {
  jerseyNumber: number;
}

export interface InvitationActionRequestDTO {
  action: 'ACCEPT' | 'REJECT';
}

export interface PlayerRegistrationApiBodyDTO {
  userType: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  identification: string;
  age: number;
  position: string;
  skillLevel: string;
}
