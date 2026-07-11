export interface JmapVacationResponse {
  id: string;
  isEnabled: boolean;
  fromDate?: string;
  toDate?: string;
  subject?: string;
  textBody?: string;
  htmlBody?: string;
}
