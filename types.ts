
export interface Word {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  category: string;
  mnemonic?: string;
}

export type ViewMode = 'grid' | 'list' | 'flashcard';

export interface UserStats {
  learnedIds: number[];
  favoriteIds: number[];
}
