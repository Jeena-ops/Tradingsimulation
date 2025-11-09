import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AIModelCard } from './AIModelCard';
import { AI_MODELS, type AIModel } from '../../utils/stockData';
import { TrendingUp } from 'lucide-react';

interface DashboardViewProps {
  onAIModelClick: (model: AIModel) => void;
}

export function DashboardView({ onAIModelClick }: DashboardViewProps) {
  const [performanceData, setPerformanceData] = useState<Array<any>>([]);

  useEffect(() => {
    // 生成模拟收益曲线数据
    const generatePerformanceData = () => {
      const data = [];
      const hours = 24;
      
      for (let i = 0; i < hours; i++) {
        const point: any = { 
          time: `${i}:00`,
        };
        
        AI_MODELS.forEach(model => {
          // 基于模型收益率生成波动曲线
          const base = model.totalReturn;
          const volatility = model.config.riskLevel === 'high' ? 5 : model.config.riskLevel === 'medium' ? 3 : 2;
          point[model.id] = base + (Math.random() - 0.5) * volatility;
        });
        
        data.push(point);
      }
      
      return data;
    };

    setPerformanceData(generatePerformanceData());

    // 实时更新数据
    const interval = setInterval(() => {
      setPerformanceData(generatePerformanceData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Performance Chart */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-xl mb-1">AI模型收益对比</h2>
            <p className="text-sm text-gray-400">实时收益率走势（过去24小时）</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-white">实时更新</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <defs>
              {AI_MODELS.map(model => (
                <linearGradient key={model.id} id={`gradient-${model.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={model.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={model.color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: any) => [`${value.toFixed(2)}%`, '']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const model = AI_MODELS.find(m => m.id === value);
                return model?.name || value;
              }}
            />
            {AI_MODELS.map(model => (
              <Area
                key={model.id}
                type="monotone"
                dataKey={model.id}
                stroke={model.color}
                strokeWidth={2}
                fill={`url(#gradient-${model.id})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Model Cards Grid */}
      <div>
        <h2 className="text-white text-xl mb-4">AI模型监控面板</h2>
        <div className="grid grid-cols-3 gap-4">
          {AI_MODELS.map(model => (
            <AIModelCard
              key={model.id}
              model={model}
              onClick={() => onAIModelClick(model)}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">平均收益率</div>
          <div className="text-2xl text-white">
            +{(AI_MODELS.reduce((sum, m) => sum + m.totalReturn, 0) / AI_MODELS.length).toFixed(2)}%
          </div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">最佳模型</div>
          <div className="text-2xl text-white">
            {AI_MODELS.reduce((best, m) => m.totalReturn > best.totalReturn ? m : best).name.split(/[A-Z]/)[0]}
          </div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">运行中模型</div>
          <div className="text-2xl text-white">
            {AI_MODELS.filter(m => m.status === 'active').length} / {AI_MODELS.length}
          </div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">总持仓数</div>
          <div className="text-2xl text-white">
            {AI_MODELS.reduce((sum, m) => sum + m.positionCount, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
