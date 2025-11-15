import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export function PositionsPanel() {
  const [positions, setPositions] = useState<Position[]>([
    { symbol: 'AAPL', quantity: 50, entryPrice: 178.25, currentPrice: 182.40, pnl: 207.50, pnlPercent: 2.33 },
    { symbol: 'TSLA', quantity: 25, entryPrice: 242.80, currentPrice: 238.15, pnl: -116.25, pnlPercent: -1.91 },
    { symbol: 'NVDA', quantity: 30, entryPrice: 495.30, currentPrice: 502.75, pnl: 223.50, pnlPercent: 1.50 },
    { symbol: 'MSFT', quantity: 40, entryPrice: 378.90, currentPrice: 384.20, pnl: 212.00, pnlPercent: 1.40 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        const priceChange = (Math.random() - 0.5) * 2;
        const newPrice = pos.currentPrice + priceChange;
        const newPnl = (newPrice - pos.entryPrice) * pos.quantity;
        const newPnlPercent = ((newPrice - pos.entryPrice) / pos.entryPrice) * 100;
        
        return {
          ...pos,
          currentPrice: parseFloat(newPrice.toFixed(2)),
          pnl: parseFloat(newPnl.toFixed(2)),
          pnlPercent: parseFloat(newPnlPercent.toFixed(2)),
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalValue = positions.reduce((sum, pos) => sum + (pos.currentPrice * pos.quantity), 0);

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">Current Positions</h3>
        <div className={`flex items-center gap-2 ${totalPnL >= 0 ? 'price-up' : 'price-down'}`}>
          {totalPnL >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span className="text-xl">${Math.abs(totalPnL).toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {positions.map((position) => (
          <div 
            key={position.symbol} 
            className="bg-[#0F1420] rounded-lg p-3 hover:bg-[#1A1F2E] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#4361EE] flex items-center justify-center">
                  <span className="text-xs">{position.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <div className="text-white">{position.symbol}</div>
                  <div className="text-xs text-gray-400">{position.quantity} shares</div>
                </div>
              </div>
              
              <div className={`text-right ${position.pnl >= 0 ? 'price-up' : 'price-down'}`}>
                <div className="flex items-center gap-1 justify-end">
                  {position.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}</span>
                </div>
                <div className="text-xs">
                  {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <div>
                <span>Entry: ${position.entryPrice.toFixed(2)}</span>
              </div>
              <div>
                <span>Current: ${position.currentPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Position size visualization */}
            <div className="mt-2 h-1 bg-[#1A1F2E] rounded overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  position.pnl >= 0 ? 'bg-[#00C805]' : 'bg-[#FF2E2E]'
                }`}
                style={{ width: `${Math.min(Math.abs(position.pnlPercent) * 10, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Portfolio Value</span>
          <span className="text-white">${totalValue.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
