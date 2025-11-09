import { TrendingUp, TrendingDown, Activity, Brain, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import type { AIModel } from '../../utils/stockData';

interface AIModelCardProps {
  model: AIModel;
  onClick: () => void;
}

export function AIModelCard({ model, onClick }: AIModelCardProps) {
  const isProfit = model.totalReturn >= 0;

  const getStatusConfig = () => {
    switch (model.status) {
      case 'active':
        return {
          label: '运行中',
          color: 'bg-green-600',
          icon: Activity,
          animate: true,
        };
      case 'deciding':
        return {
          label: '决策中',
          color: 'bg-yellow-600',
          icon: Loader2,
          animate: true,
        };
      case 'idle':
        return {
          label: '空闲',
          color: 'bg-gray-600',
          icon: Brain,
          animate: false,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-all hover:scale-[1.02] border border-gray-700 hover:border-[#1E40AF]"
      style={{ borderTopColor: model.color, borderTopWidth: '3px' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white">{model.name}</h4>
            <Badge className={`${statusConfig.color} text-white text-xs`}>
              <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.animate ? 'animate-spin' : ''}`} />
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-xs text-gray-400">{model.config.baseModel}</p>
        </div>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: model.color }}
        />
      </div>

      {/* Total Return */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-1">总收益率</div>
        <div className={`text-2xl flex items-center gap-2 ${isProfit ? 'price-up' : 'price-down'}`}>
          {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span>{isProfit ? '+' : ''}{model.totalReturn.toFixed(2)}%</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">夏普比率</span>
          <span className="text-white">{model.sharpeRatio.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">最大回撤</span>
          <span className="price-down">{model.maxDrawdown.toFixed(2)}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">胜率</span>
          <span className="text-white">{model.winRate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Win Rate Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>胜率分布</span>
          <span>{model.winRate.toFixed(1)}%</span>
        </div>
        <Progress value={model.winRate} className="h-2" />
      </div>

      {/* Position Count */}
      <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-400">持仓股票数</span>
        <div className="flex items-center gap-2">
          <span className="text-white text-lg">{model.positionCount}</span>
          <span className="text-xs text-gray-400">/ 10</span>
        </div>
      </div>
    </div>
  );
}
