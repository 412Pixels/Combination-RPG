import React from 'react';
import { Player, Tool } from '../types';

interface InventoryProps {
  player: Player;
  onCombineTools: (tool1: Tool, tool2: Tool) => void;
  onDestroyTool: (tool: Tool) => void;
  onEquipTool: (tool: Tool) => void;
  onUnequipTool: (type: 'armor' | 'weapon') => void;
  onBack: () => void;
}

const Inventory: React.FC<InventoryProps> = ({
  player,
  onCombineTools,
  onDestroyTool,
  onEquipTool,
  onUnequipTool,
  onBack
}) => {
  const [selectedTools, setSelectedTools] = React.useState<Tool[]>([]);

  const toggleToolSelection = (tool: Tool) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else if (selectedTools.length < 2) {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleCombine = () => {
    if (selectedTools.length === 2) {
      onCombineTools(selectedTools[0], selectedTools[1]);
      setSelectedTools([]);
    }
  };

  return (
    <div className="text-amber-100">
      <h2 className="text-2xl font-semibold mb-4 text-amber-300">Inventory</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-amber-200">Equipped</h3>
        <p>
          Armor: {player.armor ? player.armor.name : 'None'}
          {player.armor && (
            <button
              className="ml-2 bg-red-700 text-amber-100 py-1 px-2 rounded text-sm hover:bg-red-600"
              onClick={() => onUnequipTool('armor')}
            >
              Unequip
            </button>
          )}
        </p>
        <p>
          Weapon: {player.weapon ? player.weapon.name : 'None'}
          {player.weapon && (
            <button
              className="ml-2 bg-red-700 text-amber-100 py-1 px-2 rounded text-sm hover:bg-red-600"
              onClick={() => onUnequipTool('weapon')}
            >
              Unequip
            </button>
          )}
        </p>
      </div>
      <div className="space-y-2">
        {player.inventory.map((tool, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>
              {tool.name} (Tier {tool.tier})
              {tool.attack !== undefined && ` - Attack: ${tool.attack}`}
              {tool.defense !== undefined && ` - Defense: ${tool.defense}`}
            </span>
            <div>
              <button
                className={`mr-2 px-2 py-1 rounded ${
                  selectedTools.includes(tool) ? 'bg-blue-700 text-amber-100' : 'bg-stone-600 text-amber-200'
                } hover:bg-blue-600`}
                onClick={() => toggleToolSelection(tool)}
              >
                Select
              </button>
              <button
                className="mr-2 bg-green-700 text-amber-100 px-2 py-1 rounded hover:bg-green-600"
                onClick={() => onEquipTool(tool)}
              >
                Equip
              </button>
              <button
                className="bg-red-700 text-amber-100 px-2 py-1 rounded hover:bg-red-600"
                onClick={() => onDestroyTool(tool)}
              >
                Destroy
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          className="bg-yellow-700 text-amber-100 py-2 px-4 rounded mr-2 hover:bg-yellow-600"
          onClick={handleCombine}
          disabled={selectedTools.length !== 2}
        >
          Combine Selected Tools
        </button>
        <button
          className="bg-stone-600 text-amber-100 py-2 px-4 rounded hover:bg-stone-500"
          onClick={onBack}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Inventory;