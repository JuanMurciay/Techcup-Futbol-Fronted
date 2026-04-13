import TeamService from '../services/team.service';
import { normalizeRole } from './roles';

const KEY = 'tc_pending_team_create';

export interface PendingTeamPayload {
  name: string;
  primaryColor: string;
  secondaryColor: string;
}

export function savePendingTeamCreate(p: PendingTeamPayload): void {
  sessionStorage.setItem(KEY, JSON.stringify(p));
}

export function readPendingTeamCreate(): PendingTeamPayload | null {
  try {
    const s = sessionStorage.getItem(KEY);
    return s ? (JSON.parse(s) as PendingTeamPayload) : null;
  } catch {
    return null;
  }
}

export function clearPendingTeamCreate(): void {
  sessionStorage.removeItem(KEY);
}

export type FlushPendingResult = 'none' | 'ok' | 'fail';

export async function flushPendingTeamCreate(): Promise<FlushPendingResult> {
  const p = readPendingTeamCreate();
  if (!p) return 'none';
  const raw = localStorage.getItem('tc_user');
  if (!raw) return 'fail';
  const u = JSON.parse(raw) as { role?: string };
  if (normalizeRole(u.role ?? '') !== 'CAPTAIN') {
    clearPendingTeamCreate();
    return 'none';
  }
  try {
    await TeamService.create({ name: p.name, colors: `${p.primaryColor},${p.secondaryColor}` });
    clearPendingTeamCreate();
    return 'ok';
  } catch {
    return 'fail';
  }
}
