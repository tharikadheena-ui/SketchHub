import type { Participant, Team } from '../types/domain';
import { notConnected } from './serviceResult';

export const participantService = {
  async listParticipants() {
    return notConnected<Participant[]>('Participant');
  },
  async getParticipant(_participantId: string) {
    return notConnected<Participant>('Participant');
  },
  async listTeams(_eventId?: string) {
    return notConnected<Team[]>('Team');
  },
  async createTeam(_payload: { eventId: string; name: string }) {
    return notConnected<Team>('Team');
  },
  async joinTeam(_code: string) {
    return notConnected<Team>('Team');
  },
  async createInviteLink(_teamId: string) {
    return notConnected<string>('Team invitation');
  },
  async updateTeamMembers(_teamId: string, _participantIds: string[]) {
    return notConnected<Team>('Team');
  },
};