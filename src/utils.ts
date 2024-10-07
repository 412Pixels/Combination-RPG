const weaponPrefixes = ['Sharp', 'Mighty', 'Swift', 'Blazing', 'Frozen'];
const weaponSuffixes = ['Blade', 'Sword', 'Axe', 'Mace', 'Dagger'];
const armorPrefixes = ['Sturdy', 'Reinforced', 'Enchanted', 'Gleaming', 'Shadowy'];
const armorSuffixes = ['Plate', 'Mail', 'Shield', 'Helm', 'Gauntlets'];

const enemyTitles = [
  'the Weak', 'the Novice', 'the Apprentice', 'the Adept', 'the Expert',
  'the Master', 'the Grandmaster', 'the Legendary', 'the Mythical', 'the Godlike'
];

const enemyPrefixes = [
  'Goblin', 'Orc', 'Troll', 'Ogre', 'Dragon',
  'Demon', 'Undead', 'Vampire', 'Werewolf', 'Chimera'
];

const enemySuffixes = [
  'Warrior', 'Mage', 'Archer', 'Berserker', 'Knight',
  'Assassin', 'Necromancer', 'Paladin', 'Shaman', 'Warlord'
];

export function generateRandomName(type: 'weapon' | 'armor'): string {
  const prefixes = type === 'weapon' ? weaponPrefixes : armorPrefixes;
  const suffixes = type === 'weapon' ? weaponSuffixes : armorSuffixes;
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${suffix}`;
}

export function generateEnemyName(level: number): string {
  const prefix = enemyPrefixes[Math.floor(Math.random() * enemyPrefixes.length)];
  const suffix = enemySuffixes[Math.floor(Math.random() * enemySuffixes.length)];
  const title = enemyTitles[Math.min(Math.max(0, level - 1), enemyTitles.length - 1)];
  
  return `${prefix} ${suffix} ${title}`;
}