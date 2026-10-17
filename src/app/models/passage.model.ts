export interface PassageLine {
  jp: string;
  sp: string;
  ro: string;
  cloze: string;
}

export interface Passage {
  id: number;
  title: string;
  subtitle: string;
  lines: PassageLine[];
  youtubeId?: string;
}

export type MemorizationMode = 1 | 2 | 3 | 4;
