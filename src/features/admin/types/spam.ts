export interface StalwartSpamSettings {
  enabled: boolean;
  killScore: number;
  tagScore: number;
}

export interface StalwartSpamRule {
  id: string;
  name: string;
  expression: string;
  score: number;
  enabled: boolean;
}
