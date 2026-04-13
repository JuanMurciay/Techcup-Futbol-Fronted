export type NormalizedRole = 'ADMIN' | 'ORGANIZER' | 'CAPTAIN' | 'PLAYER' | 'REFEREE';

export function normalizeRole(raw: string): NormalizedRole {
  const r = raw.toUpperCase().replace(/^ROLE_/, '');
  const map: Record<string, NormalizedRole> = {
    ADMIN: 'ADMIN',
    ORGANIZER: 'ORGANIZER',
    ORGANIZADOR: 'ORGANIZER',
    CAPTAIN: 'CAPTAIN',
    CAPITAN: 'CAPTAIN',
    PLAYER: 'PLAYER',
    JUGADOR: 'PLAYER',
    REFEREE: 'REFEREE',
    ARBITRO: 'REFEREE',
  };
  return map[r] ?? 'PLAYER';
}

export function dashboardPath(role: NormalizedRole): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'ORGANIZER':
      return '/organizer/dashboard';
    case 'CAPTAIN':
      return '/captain/dashboard';
    case 'REFEREE':
      return '/referee/dashboard';
    default:
      return '/player/dashboard';
  }
}

export function homePathFromStoredRole(roleRaw: string | undefined): string {
  if (!roleRaw) return '/player/dashboard';
  return dashboardPath(normalizeRole(roleRaw));
}
