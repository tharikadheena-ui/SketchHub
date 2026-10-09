import type { ServiceResult } from './serviceResult';
import { notConnected } from './serviceResult';

export type GoogleFormQuestionType =
  | 'short_answer'
  | 'paragraph'
  | 'multiple_choice'
  | 'checkboxes'
  | 'dropdown';

export interface GoogleFormQuestionOption {
  id: string;
  text: string;
}

export interface GoogleFormQuestion {
  id: string;
  title: string;
  type: GoogleFormQuestionType;
  required: boolean;
  options: GoogleFormQuestionOption[];
}

export interface GoogleFormData {
  id?: string;
  title: string;
  description: string;
  eventId: string | null;
  status: 'draft' | 'ready';
  questions: GoogleFormQuestion[];
}

export interface GeneratedGoogleFormResult {
  formId: string;
  formUrl: string;
  editUrl: string;
}

export const formGeneratorService = {
  /**
   * Save draft in backend when connected.
   */
  async saveDraft(_formData: GoogleFormData): Promise<ServiceResult<GoogleFormData>> {
    return notConnected<GoogleFormData>('Form generator');
  },

  /**
   * Create Google Form via backend API when connected.
   */
  async generateGoogleForm(_formData: GoogleFormData): Promise<ServiceResult<GeneratedGoogleFormResult>> {
    return notConnected<GeneratedGoogleFormResult>('Google Form generation');
  },
};
