import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  isPlayer: boolean;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, isPlayer }) => {
  const percentage = (current / max) * 100;
  const barColor = isPlayer ? 'player-health' : 'enemy-health';

  return (
    <div className="health-bar">
      <div
        className={`health-bar-fill ${barColor}`}
        style={{ width: `${percentage}%` }}
      >
        {current}/{max}
      </div>
    </div>
  );
};

export default HealthBar;