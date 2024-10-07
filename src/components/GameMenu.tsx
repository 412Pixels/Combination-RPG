import React from 'react';
import { Player } from '../types';

interface GameMenuProps {
  onStartBattle: () => void;
  onOpenInventory: () => void;
  onSaveGame: () => void;
  onDeleteSave: () => void;
  player: Player;
}

const GameMenu: React.FC<GameMenuProps> = ({ onStartBattle, onOpenInventory, onSaveGame, onDeleteSave, player }) => {
  return (
    <div className="text-amber-100">
      <h2 className="text-2xl font-semibold mb-4 text-amber-300">Game Menu</h2>
      <div className="mb-4">
        <p>Level: {player.level}</p>
        <p>XP: {player.xp}</p>
        <p>Health: {player.health}/{player.maxHealth}</p>
        <p>Armor: {player.armor ? `${player.armor.name} (Tier ${player.armor.tier})` : 'None'}</p>
        <p>Weapon: {player.weapon ? `${player.weapon.name} (Tier ${player.weapon.tier})` : 'None'}</p>
      </div>
      <div className="space-y-2">
        <button
          className="w-full bg-red-700 text-amber-100 py-2 px-4 rounded hover:bg-red-600"
          onClick={onStartBattle}
        >
          Battle
        </button>
        <button
          className="w-full bg-green-700 text-amber-100 py-2 px-4 rounded hover:bg-green-600"
          onClick={onOpenInventory}
        >
          Inventory
        </button>
        <button
          className="w-full bg-yellow-700 text-amber-100 py-2 px-4 rounded hover:bg-yellow-600"
          onClick={onSaveGame}
        >
          Save Game
        </button>
        <button
          className="w-full bg-red-800 text-amber-100 py-2 px-4 rounded hover:bg-red-700"
          onClick={onDeleteSave}
        >
          Delete Save
        </button>
      </div>
    </div>
  );
};

export default GameMenu;