import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react';
import type { Stock } from '../../utils/stockData';
import { AI_MODELS } from '../../utils/stockData';

interface StockDetailViewProps {
  stock: Stock;
  onBack: () => void;
}

export function StockDetailView({ stock, onBack }: StockDetailViewProps) {
  const [priceData, setPriceData] = useState<Array<any>>([]);
  const [aiTradeMarks, setAiTradeMarks] = useState<Array<any>>([]);

  useEffect(() => {
    // 生成K线数据
    const generatePriceData = () => {
      const data = [];
      const basePrice = stock.price;
      
      for (let i = 0; i < 48; i++) {
        const hour = Math.floor(i / 2);
        const minute = (i % 2) * 30;
        const volatility = basePrice * 0.02;
        const change = (Math.random() - 0.5) * volatility;
        const price = basePrice + change;
        
        data.push({
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          price: parseFloat(price.toFixed(2)),
          volume: Math.floor(Math.random() * 10000 + 5000),
        });
      }
      
      return data;
    };

    // 生成AI买卖标记
    const generateAIMarks = () => {
      const marks = [];
      const data = generatePriceData();
      
      AI_MODELS.forEach(model => {
        // 每个AI随机生成2-4个交易点
        const tradeCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < tradeCount; i++) {
          const index = Math.floor(Math.random() * data.length);
          marks.push({
            time: data[index].time,
            price: data[index].price,
            action: Math.random() > 0.5 ? 'buy' : 'sell',
            aiModel: model,
          });
        }
      });
      
      return marks;
    };

    setPriceData(generatePriceData());
    setAiTradeMarks(generateAIMarks());
  }, [stock]);

  const isPositive = stock.changePercent >= 0;
  const sectorColor = stock.sector === 'semiconductor' ? '#3B82F6' : 
                       stock.sector === 'solar' ? '#10B981' : '#8B5CF6';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            ← 返回
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-white text-3xl">{stock.name}</h1>
              <span className="text-gray-400 text-xl">{stock.code}</span>
              <Badge style={{ backgroundColor: sectorColor }} className="text-white">
                {stock.sectorName}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white text-2xl">¥{stock.price.toFixed(2)}</span>
              <div className={`flex items-center gap-2 text-xl ${isPositive ? 'price-up' : 'price-down'}`}>
                {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">AI关注度</div>
          <div className="flex items-center gap-3">
            <div className="flex-1 w-32">
              <div className="h-2 bg-gray-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]"
                  style={{ width: `${stock.aiAttention}%` }}
                />
              </div>
            </div>
            <span className="text-2xl text-white">{stock.aiAttention}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList className="glass-card">
          <TabsTrigger value="chart">价格走势</TabsTrigger>
          <TabsTrigger value="technical">技术指标</TabsTrigger>
          <TabsTrigger value="ai-positions">AI持仓</TabsTrigger>
          <TabsTrigger value="news">相关新闻</TabsTrigger>
        </TabsList>

        {/* Price Chart Tab */}
        <TabsContent value="chart" className="space-y-4">
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-white mb-4">日内分时图（叠加AI买卖点）</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickFormatter={(value) => `¥${value.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`¥${value.toFixed(2)}`, '价格']}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? '#EF4444' : '#10B981'}
                  strokeWidth={2}
                  dot={false}
                />
                {/* AI Trade Marks */}
                {aiTradeMarks.map((mark, idx) => (
                  <ReferenceDot
                    key={idx}
                    x={mark.time}
                    y={mark.price}
                    r={6}
                    fill={mark.aiModel.color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            {/* AI Legend */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {AI_MODELS.map(model => (
                <div key={model.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  <span className="text-sm text-gray-400">{model.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Volume Chart */}
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-white mb-4">成交量</h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="volume" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Technical Indicators Tab */}
        <TabsContent value="technical">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                技术指标
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                  <span className="text-gray-400">MACD</span>
                  <Badge className="bg-green-600 text-white">金叉</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                  <span className="text-gray-400">RSI(14)</span>
                  <span className="text-white">64.5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                  <span className="text-gray-400">KDJ</span>
                  <span className="text-white">K:78 D:72 J:85</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                  <span className="text-gray-400">BOLL</span>
                  <span className="text-white">上:{(stock.price * 1.05).toFixed(2)} 中:{stock.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-lg p-6">
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                市场数据
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                  <span className="text-gray-400">总市值</span>
                  <span className="text-white">523.8亿</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                  <span className="text-gray-400">流通市值</span>
                  <span className="text-white">421.6亿</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                  <span className="text-gray-400">市盈率TTM</span>
                  <span className="text-white">45.6</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                  <span className="text-gray-400">市净率</span>
                  <span className="text-white">6.8</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* AI Positions Tab */}
        <TabsContent value="ai-positions">
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-white mb-4">AI持仓情况</h3>
            <div className="space-y-3">
              {AI_MODELS.map(model => {
                const hasPosition = Math.random() > 0.3;
                const shares = hasPosition ? Math.floor(Math.random() * 5000) + 1000 : 0;
                const cost = hasPosition ? stock.price * (0.9 + Math.random() * 0.2) : 0;
                const profit = hasPosition ? ((stock.price - cost) / cost) * 100 : 0;

                return (
                  <div key={model.id} className="p-4 bg-gray-700 bg-opacity-30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: model.color }}
                        />
                        <span className="text-white">{model.name}</span>
                      </div>
                      {hasPosition ? (
                        <Badge className="bg-blue-600 text-white">持仓中</Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white">未持仓</Badge>
                      )}
                    </div>
                    {hasPosition && (
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400 mb-1">持仓股数</div>
                          <div className="text-white">{shares.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">成本价</div>
                          <div className="text-white">¥{cost.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">当前价</div>
                          <div className="text-white">¥{stock.price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">盈亏</div>
                          <div className={profit >= 0 ? 'price-up' : 'price-down'}>
                            {profit >= 0 ? '+' : ''}{profit.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news">
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-white mb-4">相关新闻时间线</h3>
            <div className="space-y-4">
              {[
                { title: `${stock.name}发布2024年业绩预告`, time: '2小时前', sentiment: 'positive' },
                { title: `${stock.sectorName}板块受政策支持`, time: '5小时前', sentiment: 'positive' },
                { title: `${stock.name}获多家机构调研`, time: '1天前', sentiment: 'positive' },
                { title: `${stock.name}新产品通过认证`, time: '2天前', sentiment: 'positive' },
              ].map((news, idx) => (
                <div key={idx} className="p-4 bg-gray-700 bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white flex-1">{news.title}</h4>
                    <Badge className="bg-green-600 text-white ml-3">利好</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{news.time}</span>
                    <span className="text-blue-400 cursor-pointer hover:underline">查看详情 →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
