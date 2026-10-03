import type { Registration, RegistrationForm, RegistrationSubmission } from '../types/domain';
import { notConnected } from './serviceResult';

export const registrationService = {
  async listRegistrations(_eventId?: string) {
    return notConnected<Registration[]>('Registration');
  },
  async getPublicForm(_eventId: string) {
    return notConnected<RegistrationForm>('Registration form');
  },
  async submitRegistration(_eventId: string, _submission: RegistrationSubmission) {
    return notConnected<Registration>('Registration');
  },
  async saveForm(_form: RegistrationForm) {
    return notConnected<RegistrationForm>('Registration form');
  },
  async publishForm(_eventId: string) {
    return notConnected<RegistrationForm>('Registration form');
  },
};