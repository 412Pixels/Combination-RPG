import React, { useState, useEffect } from 'react';
import GameMenu from './components/GameMenu';
import Battle from './components/Battle';
import Inventory from './components/Inventory';
import { Player, Tool, Enemy } from './types';
import { generateRandomName, generateEnemyName } from './utils';

const initialPlayer: Player = {
  level: 1,
  xp: 0,
  health: 100,
  maxHealth: 100,
  armor: null,
  weapon: null,
  inventory: [
    { name: 'Wooden Armor', tier: 1, defense: 10 },
    { name: 'Wooden Sword', tier: 1, attack: 5 },
  ],
};

function App() {
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [gameState, setGameState] = useState<'menu' | 'battle' | 'inventory'>('menu');
  const [enemies, setEnemies] = useState<Enemy[]>([]);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = () => {
    const savedPlayer = localStorage.getItem('playerSave');
    if (savedPlayer) {
      setPlayer(JSON.parse(savedPlayer));
    }
  };

  const saveGame = () => {
    localStorage.setItem('playerSave', JSON.stringify(player));
  };

  const deleteSave = () => {
    localStorage.removeItem('playerSave');
    setPlayer(initialPlayer);
  };

  const startBattle = () => {
    const newEnemies: Enemy[] = Array(3).fill(null).map(() => {
      const level = player.level + Math.floor(Math.random() * 3) - 1;
      const maxHealth = 50 + level * 10;
      return {
        name: generateEnemyName(level),
        level,
        health: maxHealth,
        maxHealth,
        attack: 3 + level * 2,
        isDefeated: false,
      };
    });
    setEnemies(newEnemies);
    setGameState('battle');
  };

  const endBattle = (won: boolean) => {
    if (won) {
      const xpGained = enemies.reduce((sum, enemy) => sum + enemy.level * 10, 0);
      const newXp = player.xp + xpGained;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      const newTool: Tool = Math.random() > 0.5
        ? { name: generateRandomName('weapon'), tier: 1, attack: 5 }
        : { name: generateRandomName('armor'), tier: 1, defense: 10 };

      setPlayer(prev => ({
        ...prev,
        level: newLevel,
        xp: newXp,
        health: prev.maxHealth,
        inventory: [...prev.inventory, newTool],
      }));
    } else {
      setPlayer(prev => ({
        ...prev,
        health: prev.maxHealth,
      }));
    }
    setGameState('menu');
  };

  const combineTool = (tool1: Tool, tool2: Tool) => {
    if (tool1.tier === tool2.tier && tool1.tier < 3) {
      const newTool: Tool = {
        name: generateRandomName('armor'),
        tier: tool1.tier + 1,
        defense: (tool1.defense || 0) + (tool2.defense || 0),
        attack: (tool1.attack || 0) + (tool2.attack || 0),
      };
      setPlayer(prev => ({
        ...prev,
        inventory: [...prev.inventory.filter(t => t !== tool1 && t !== tool2), newTool],
      }));
    }
  };

  const destroyTool = (tool: Tool) => {
    setPlayer(prev => {
      const newPlayer = { ...prev };
      if (newPlayer.weapon === tool) {
        newPlayer.weapon = null;
      }
      if (newPlayer.armor === tool) {
        newPlayer.armor = null;
        newPlayer.maxHealth = initialPlayer.maxHealth;
      }
      newPlayer.xp += tool.tier * 50;
      newPlayer.inventory = newPlayer.inventory.filter(t => t !== tool);
      return newPlayer;
    });
  };

  const equipTool = (tool: Tool) => {
    setPlayer(prev => {
      const newPlayer = { ...prev };
      if (tool.attack !== undefined) {
        newPlayer.weapon = tool;
      } else {
        newPlayer.armor = tool;
        newPlayer.maxHealth = initialPlayer.maxHealth + tool.defense;
      }
      newPlayer.health = newPlayer.maxHealth;
      return newPlayer;
    });
  };

  const unequipTool = (type: 'armor' | 'weapon') => {
    setPlayer(prev => {
      const newPlayer = { ...prev };
      newPlayer[type] = null;
      if (type === 'armor') {
        newPlayer.maxHealth = initialPlayer.maxHealth;
      }
      newPlayer.health = newPlayer.maxHealth;
      return newPlayer;
    });
  };

  return (
    <div className="min-h-screen bg-stone-800 flex items-center justify-center">
      <div className="bg-stone-700 p-8 rounded-lg shadow-md w-full max-w-2xl text-amber-100">
        <h1 className="text-3xl font-bold mb-4 text-amber-300">Combination RPG</h1>
        {gameState === 'menu' && (
          <GameMenu
            onStartBattle={startBattle}
            onOpenInventory={() => setGameState('inventory')}
            onSaveGame={saveGame}
            onDeleteSave={deleteSave}
            player={player}
          />
        )}
        {gameState === 'battle' && (
          <Battle
            player={player}
            setPlayer={setPlayer}
            enemies={enemies}
            onEndBattle={endBattle}
          />
        )}
        {gameState === 'inventory' && (
          <Inventory
            player={player}
            onCombineTools={combineTool}
            onDestroyTool={destroyTool}
            onEquipTool={equipTool}
            onUnequipTool={unequipTool}
            onBack={() => setGameState('menu')}
          />
        )}
      </div>
    </div>
  );
}

export default App;