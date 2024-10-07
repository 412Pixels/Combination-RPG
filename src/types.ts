export interface Tool {
  name: string;
  tier: number;
  attack?: number;
  defense?: number;
}

export interface Player {
  level: number;
  xp: number;
  health: number;
  maxHealth: number;
  armor: Tool | null;
  weapon: Tool | null;
  inventory: Tool[];
}

export interface Enemy {
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  isDefeated: boolean;
}