
export interface Participant {
  id: string;
  name: string;
}

export enum AppTab {
  NAMES = 'names',
  LUCKY_DRAW = 'lucky_draw',
  GROUPING = 'grouping'
}

export interface Group {
  id: number;
  members: Participant[];
}
