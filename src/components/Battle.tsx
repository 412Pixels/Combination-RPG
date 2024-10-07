import React, { useState, useEffect } from 'react';
import { Player, Enemy } from '../types';
import HealthBar from './HealthBar';

interface BattleProps {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  enemies: Enemy[];
  onEndBattle: (won: boolean) => void;
}

const Battle: React.FC<BattleProps> = ({ player, setPlayer, enemies, onEndBattle }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>({ ...player });
  const [currentEnemies, setCurrentEnemies] = useState<Enemy[]>(enemies);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [log, setLog] = useState<string[]>([]);
  const [healCooldown, setHealCooldown] = useState(0);
  const [deathMessage, setDeathMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentPlayer.health <= 0) {
      // Don't call onEndBattle here, let the player see the death message first
      return;
    } else if (currentEnemies.every(e => e.isDefeated)) {
      setPlayer(currentPlayer);
      onEndBattle(true);
    } else if (turn === 'enemy') {
      enemyTurn();
    }
  }, [currentPlayer, currentEnemies, turn]);

  const attackEnemy = (enemyIndex: number) => {
    const damage = player.weapon ? player.weapon.attack : 1;
    const newEnemies = [...currentEnemies];
    newEnemies[enemyIndex].health = Math.max(0, newEnemies[enemyIndex].health - damage);
    if (newEnemies[enemyIndex].health === 0) {
      newEnemies[enemyIndex].isDefeated = true;
      setLog([...log, `${newEnemies[enemyIndex].name} has been defeated!`]);
    } else {
      setLog([...log, `Player dealt ${damage} damage to ${enemies[enemyIndex].name}`]);
    }
    setCurrentEnemies(newEnemies);
    setTurn('enemy');
    if (healCooldown > 0) {
      setHealCooldown(healCooldown - 1);
    }
  };

  const healPlayer = () => {
    const healAmount = currentPlayer.level * 10;
    const newHealth = Math.min(currentPlayer.health + healAmount, currentPlayer.maxHealth);
    setCurrentPlayer(prev => ({
      ...prev,
      health: newHealth,
    }));
    setLog([...log, `Player healed for ${healAmount} health`]);
    setTurn('enemy');
    setHealCooldown(2);
  };

  const enemyTurn = () => {
    const aliveEnemies = currentEnemies.filter(e => !e.isDefeated);
    const attackingEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    const damage = attackingEnemy.attack + attackingEnemy.level;
    let damageTaken = damage;
    
    if (currentPlayer.armor && currentPlayer.armor.attack) {
      const counterDamage = currentPlayer.armor.attack;
      attackingEnemy.health = Math.max(0, attackingEnemy.health - counterDamage);
      setLog([...log, `${attackingEnemy.name} took ${counterDamage} counter-damage from player's armor`]);
      if (attackingEnemy.health === 0) {
        attackingEnemy.isDefeated = true;
        damageTaken = 0;
        setLog([...log, `${attackingEnemy.name} was defeated by the counter-attack!`]);
      }
    }
    
    const newHealth = Math.max(0, currentPlayer.health - damageTaken);
    setCurrentPlayer(prev => ({
      ...prev,
      health: newHealth,
    }));
    
    if (damageTaken > 0) {
      setLog([...log, `${attackingEnemy.name} dealt ${damageTaken} damage to Player`]);
    }

    if (newHealth <= 0) {
      const deathMessages = [
        `${attackingEnemy.name} has dealt you a final blow... and you are now flatter than a pancake made by a drunk dwarf.`,
        `${attackingEnemy.name}'s fiery breath has roasted you... congratulations, you're now medium-well. Just a few more minutes and you'd be a feast.`,
        `${attackingEnemy.name}'s spear pierces your heart... and your last thought is regretting not reading that 'Swordplay for Dummies' book.`,
        `${attackingEnemy.name}'s club lands with a thud... and now you're a permanent resident of the ground. The worms thank you for the free housing.`,
        `${attackingEnemy.name} drains your life essence... and your ghost floats away, regretting not asking for that extra health potion.`,
        `${attackingEnemy.name}'s sword slices through you... and as your vision fades, you remember that ducking is usually a good strategy.`,
        `${attackingEnemy.name}'s enchanted arrow strikes true... and you become a pin-cushion for local archery practice. Nice grouping!`,
        `${attackingEnemy.name} slashes you... and now you'll finally know what it feels like to skip lunch for eternity.`,
        `${attackingEnemy.name}'s claws tear through your armor... but hey, look on the bright side, at least you'll save on barber costs from now on!`,
        `${attackingEnemy.name} sucks your last drop of blood... and you realize that garlic breath might have been a better strategy after all.`,
      ];
      setDeathMessage(deathMessages[Math.floor(Math.random() * deathMessages.length)]);
    } else {
      setTurn('player');
      if (healCooldown > 0) {
        setHealCooldown(healCooldown - 1);
      }
    }
  };

  if (deathMessage) {
    return (
      <div className="text-amber-100">
        <h2 className="text-2xl font-semibold mb-4 text-amber-300">Game Over</h2>
        <p className="mb-4">{deathMessage}</p>
        <button
          className="bg-red-700 text-amber-100 py-2 px-4 rounded hover:bg-red-600"
          onClick={() => onEndBattle(false)}
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="text-amber-100">
      <h2 className="text-2xl font-semibold mb-4 text-amber-300">Battle</h2>
      <div className="mb-4">
        <p className="mb-2">Player Health:</p>
        <HealthBar current={currentPlayer.health} max={currentPlayer.maxHealth} isPlayer={true} />
        {currentEnemies.map((enemy, index) => (
          <div key={index} className="mt-4">
            <p>{enemy.name} (Level {enemy.level})</p>
            <HealthBar current={enemy.health} max={enemy.maxHealth} isPlayer={false} />
            {turn === 'player' && !enemy.isDefeated && (
              <button
                className="mt-2 bg-red-700 text-amber-100 py-1 px-2 rounded text-sm hover:bg-red-600"
                onClick={() => attackEnemy(index)}
              >
                Attack
              </button>
            )}
            {enemy.isDefeated && (
              <p className="mt-2 text-red-500 font-bold">Defeated</p>
            )}
          </div>
        ))}
      </div>
      {turn === 'player' && (
        <button
          className={`mb-4 ${
            healCooldown === 0
              ? 'bg-green-700 hover:bg-green-600'
              : 'bg-gray-600 cursor-not-allowed'
          } text-amber-100 py-2 px-4 rounded`}
          onClick={healPlayer}
          disabled={healCooldown > 0}
        >
          Heal {healCooldown > 0 ? `(${healCooldown})` : ''}
        </button>
      )}
      <div className="h-40 overflow-y-auto border border-amber-700 p-2 bg-stone-800">
        {log.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))}
      </div>
    </div>
  );
};

export default Battle;