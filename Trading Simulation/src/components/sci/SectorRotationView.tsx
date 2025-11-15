import { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';
import { getSectorColor, getStocksBySector } from '../../utils/stockData';
import { useLanguage } from '../../utils/language';

export function SectorRotationView() {
  const { language } = useLanguage();
  const [radarData, setRadarData] = useState<Array<any>>([]);
  const [flowData, setFlowData] = useState<Array<any>>([]);

  useEffect(() => {
    // 生成板块强度雷达图数据
    const generateRadarData = () => {
      return [
        { 
          metric: language === 'zh' ? '资金流入' : 'Money Inflow',
          semiconductor: 85, solar: 72, tech: 68 
        },
        { 
          metric: language === 'zh' ? '涨跌幅度' : 'Price Change',
          semiconductor: 78, solar: 65, tech: 82 
        },
        { 
          metric: language === 'zh' ? 'AI关注度' : 'AI Attention',
          semiconductor: 92, solar: 68, tech: 75 
        },
        { 
          metric: language === 'zh' ? '成交活跃' : 'Trading Volume',
          semiconductor: 88, solar: 71, tech: 79 
        },
        { 
          metric: language === 'zh' ? '技术强度' : 'Technical Strength',
          semiconductor: 81, solar: 74, tech: 85 
        },
      ];
    };

    // 生成资金流向数据
    const generateFlowData = () => {
      const data = [];
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          semiconductor: 50 + Math.random() * 30,
          solar: 30 + Math.random() * 25,
          tech: 40 + Math.random() * 28,
        });
      }
      return data;
    };

    setRadarData(generateRadarData());
    setFlowData(generateFlowData());
  }, [language]);

  const semiconductorStocks = getStocksBySector('semiconductor');
  const solarStocks = getStocksBySector('solar');
  const techStocks = getStocksBySector('tech');

  const getSectorName = (sector: 'semiconductor' | 'solar' | 'tech') => {
    const names = {
      semiconductor: { zh: '半导体板块', en: 'Semiconductor' },
      solar: { zh: '光伏板块', en: 'Solar Energy' },
      tech: { zh: '科技其他', en: 'Technology' }
    };
    return names[sector][language];
  };

  const sectorStats = [
    {
      id: 'semiconductor',
      name: getSectorName('semiconductor'),
      color: getSectorColor('semiconductor'),
      stocks: semiconductorStocks,
      avgChange: semiconductorStocks.reduce((sum, s) => sum + s.changePercent, 0) / semiconductorStocks.length,
      totalVolume: semiconductorStocks.reduce((sum, s) => sum + s.volume, 0),
      leaders: semiconductorStocks.sort((a, b) => b.changePercent - a.changePercent).slice(0, 3),
    },
    {
      id: 'solar',
      name: getSectorName('solar'),
      color: getSectorColor('solar'),
      stocks: solarStocks,
      avgChange: solarStocks.reduce((sum, s) => sum + s.changePercent, 0) / solarStocks.length,
      totalVolume: solarStocks.reduce((sum, s) => sum + s.volume, 0),
      leaders: solarStocks.sort((a, b) => b.changePercent - a.changePercent).slice(0, 3),
    },
    {
      id: 'tech',
      name: getSectorName('tech'),
      color: getSectorColor('tech'),
      stocks: techStocks,
      avgChange: techStocks.reduce((sum, s) => sum + s.changePercent, 0) / techStocks.length,
      totalVolume: techStocks.reduce((sum, s) => sum + s.volume, 0),
      leaders: techStocks.sort((a, b) => b.changePercent - a.changePercent).slice(0, 3),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl mb-2">
          {language === 'zh' ? '板块轮动分析' : 'Sector Rotation Analysis'}
        </h1>
        <p className="text-gray-400">
          {language === 'zh' ? '实时监控三大板块的资金流向和强弱变化' : 'Real-time monitoring of sector money flow and strength'}
        </p>
      </div>

      {/* Sector Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {sectorStats.map((sector) => (
          <div
            key={sector.id}
            className="glass-card rounded-lg p-6 border-l-4"
            style={{ borderLeftColor: sector.color }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg">{sector.name}</h3>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: sector.color }}
              />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {language === 'zh' ? '平均涨跌' : 'Avg Change'}
                </span>
                <span className={`text-xl ${sector.avgChange >= 0 ? 'price-up' : 'price-down'}`}>
                  {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {language === 'zh' ? '总成交量' : 'Total Volume'}
                </span>
                <span className="text-white">
                  {(sector.totalVolume / 100000000).toFixed(2)}{language === 'zh' ? '亿' : 'B'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {language === 'zh' ? '成份股数' : 'Constituents'}
                </span>
                <span className="text-white">
                  {sector.stocks.length}{language === 'zh' ? '只' : ''}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-2">
                {language === 'zh' ? '板块龙头' : 'Leading Stocks'}
              </div>
              <div className="space-y-1">
                {sector.leaders.map((stock) => (
                  <div key={stock.code} className="flex items-center justify-between text-sm">
                    <span className="text-white">{stock.name}</span>
                    <span className={stock.changePercent >= 0 ? 'price-up' : 'price-down'}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-white text-lg mb-4">
          {language === 'zh' ? '三大板块强度对比雷达图' : 'Sector Strength Comparison Radar'}
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis 
              dataKey="metric" 
              stroke="#9CA3AF"
              style={{ fontSize: '14px' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              stroke="#9CA3AF"
            />
            <Radar
              name={getSectorName('semiconductor')}
              dataKey="semiconductor"
              stroke={getSectorColor('semiconductor')}
              fill={getSectorColor('semiconductor')}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name={getSectorName('solar')}
              dataKey="solar"
              stroke={getSectorColor('solar')}
              fill={getSectorColor('solar')}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name={getSectorName('tech')}
              dataKey="tech"
              stroke={getSectorColor('tech')}
              fill={getSectorColor('tech')}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Money Flow Chart */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-white text-lg mb-4">
          {language === 'zh' ? '板块资金流向趋势（24小时）' : 'Sector Money Flow Trend (24h)'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={flowData}>
            <defs>
              <linearGradient id="semiconductorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getSectorColor('semiconductor')} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={getSectorColor('semiconductor')} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getSectorColor('solar')} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={getSectorColor('solar')} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="techGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getSectorColor('tech')} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={getSectorColor('tech')} stopOpacity={0}/>
              </linearGradient>
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
              tickFormatter={(value) => language === 'zh' ? `${value}亿` : `${value}B`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: any) => [language === 'zh' ? `${value.toFixed(2)}亿` : `${value.toFixed(2)}B`, '']}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="semiconductor"
              stroke={getSectorColor('semiconductor')}
              fill="url(#semiconductorGradient)"
              name={language === 'zh' ? '半导体' : 'Semiconductor'}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="solar"
              stroke={getSectorColor('solar')}
              fill="url(#solarGradient)"
              name={language === 'zh' ? '光伏' : 'Solar'}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="tech"
              stroke={getSectorColor('tech')}
              fill="url(#techGradient)"
              name={language === 'zh' ? '科技其他' : 'Technology'}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rotation Signals */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-white text-lg mb-4">
          {language === 'zh' ? '板块轮动信号' : 'Sector Rotation Signals'}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-600 bg-opacity-10 border border-green-600 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-white">
                {language === 'zh' ? '做多信号' : 'Long Signal'}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              {language === 'zh' 
                ? '半导体板块资金持续流入，技术面强势' 
                : 'Semiconductor sector seeing capital inflow, strong technicals'}
            </p>
            <Badge className="bg-green-600 text-white">
              {language === 'zh' ? '强烈推荐' : 'Highly Recommended'}
            </Badge>
          </div>

          <div className="p-4 bg-yellow-600 bg-opacity-10 border border-yellow-600 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-yellow-500" />
              <span className="text-white">
                {language === 'zh' ? '观望信号' : 'Watch Signal'}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              {language === 'zh' 
                ? '光伏板块震荡整理，等待方向选择' 
                : 'Solar sector consolidating, awaiting direction'}
            </p>
            <Badge className="bg-yellow-600 text-white">
              {language === 'zh' ? '谨慎观望' : 'Cautious'}
            </Badge>
          </div>

          <div className="p-4 bg-gray-600 bg-opacity-10 border border-gray-600 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-gray-500" />
              <span className="text-white">
                {language === 'zh' ? '弱势信号' : 'Weak Signal'}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              {language === 'zh' 
                ? '科技其他板块资金流出，短期承压' 
                : 'Tech sector seeing outflow, short-term pressure'}
            </p>
            <Badge className="bg-gray-600 text-white">
              {language === 'zh' ? '规避风险' : 'Avoid Risk'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}