import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TrendingUp, TrendingDown, Activity, Target, Brain, DollarSign } from 'lucide-react';
import type { AIModel } from '../../utils/stockData';
import { DEFAULT_STOCK_SYMBOLS } from '../../utils/stockData';

interface AIModelDetailViewProps {
  model: AIModel;
  onBack: () => void;
}

export function AIModelDetailView({ model, onBack }: AIModelDetailViewProps) {
  const [equityCurve, setEquityCurve] = useState<Array<any>>([]);
  const [positionData, setPositionData] = useState<Array<any>>([]);
  const [tradeHistory, setTradeHistory] = useState<Array<any>>([]);

  useEffect(() => {
    // 生成权益曲线数据
    const generateEquityCurve = () => {
      const data = [];
      let equity = 1000000; // 初始资金100万
      
      for (let i = 0; i < 30; i++) {
        const dailyReturn = (Math.random() - 0.4) * 2; // 模拟每日收益
        equity *= (1 + dailyReturn / 100);
        
        data.push({
          day: `第${i + 1}天`,
          equity: parseFloat(equity.toFixed(2)),
          benchmark: 1000000 * (1 + 0.05 * i / 30), // 基准5%
        });
      }
      
      return data;
    };

    // 生成持仓分布数据
    const generatePositionData = () => {
      const positions = DEFAULT_STOCK_SYMBOLS
        .slice(0, model.positionCount)
        .map(stock => ({
          name: stock.name,
          value: Math.floor(Math.random() * 200000) + 50000,
          shares: Math.floor(Math.random() * 10000) + 1000,
          cost: stock.price * (0.9 + Math.random() * 0.2),
          currentPrice: stock.price,
        }));
      
      return positions;
    };

    // 生成交易历史
    const generateTradeHistory = () => {
      const trades = [];
      const now = new Date();
      
      for (let i = 0; i < 20; i++) {
        const stock = DEFAULT_STOCK_SYMBOLS[Math.floor(Math.random() * DEFAULT_STOCK_SYMBOLS.length)];
        const action = Math.random() > 0.5 ? 'buy' : 'sell';
        const price = stock.price * (0.9 + Math.random() * 0.2);
        const shares = Math.floor(Math.random() * 5000) + 500;
        
        trades.push({
          date: new Date(now.getTime() - i * 3600000 * 24),
          stock: stock.name,
          stockCode: stock.code,
          action,
          price: parseFloat(price.toFixed(2)),
          shares,
          amount: parseFloat((price * shares).toFixed(2)),
        });
      }
      
      return trades;
    };

    setEquityCurve(generateEquityCurve());
    setPositionData(generatePositionData());
    setTradeHistory(generateTradeHistory());
  }, [model]);

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'];

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
              <h1 className="text-white text-3xl">{model.name}</h1>
              <Badge 
                className="text-white"
                style={{ backgroundColor: model.color }}
              >
                {model.config.baseModel}
              </Badge>
              <Badge className={
                model.status === 'active' ? 'bg-green-600' :
                model.status === 'deciding' ? 'bg-yellow-600' : 'bg-gray-600'
              }>
                {model.status === 'active' ? '运行中' :
                 model.status === 'deciding' ? '决策中' : '空闲'}
              </Badge>
            </div>
            <p className="text-gray-400">
              {model.config.signature} · 风险等级: {
                model.config.riskLevel === 'high' ? '高' :
                model.config.riskLevel === 'medium' ? '中' : '低'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass-card rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">总收益率</div>
            <div className={`text-3xl ${model.totalReturn >= 0 ? 'price-up' : 'price-down'}`}>
              {model.totalReturn >= 0 ? '+' : ''}{model.totalReturn.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">夏普比率</span>
          </div>
          <div className="text-2xl text-white">{model.sharpeRatio.toFixed(2)}</div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm">最大回撤</span>
          </div>
          <div className="text-2xl price-down">{model.maxDrawdown.toFixed(2)}%</div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">胜率</span>
          </div>
          <div className="text-2xl text-white">{model.winRate.toFixed(1)}%</div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">总交易</span>
          </div>
          <div className="text-2xl text-white">127笔</div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Brain className="w-4 h-4" />
            <span className="text-sm">持仓数</span>
          </div>
          <div className="text-2xl text-white">{model.positionCount} / 10</div>
        </div>
      </div>

      <Tabs defaultValue="equity" className="space-y-4">
        <TabsList className="glass-card">
          <TabsTrigger value="equity">权益曲线</TabsTrigger>
          <TabsTrigger value="positions">持仓明细</TabsTrigger>
          <TabsTrigger value="trades">交易历史</TabsTrigger>
          <TabsTrigger value="analysis">绩效分析</TabsTrigger>
        </TabsList>

        {/* Equity Curve Tab */}
        <TabsContent value="equity">
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-white mb-4">权益曲线 vs 基准</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={equityCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="day" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`¥${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="equity" 
                  stroke={model.color}
                  strokeWidth={3}
                  dot={false}
                  name="模型权益"
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#6B7280"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="基准(5%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-white mb-4">持仓分布</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={positionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {positionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: any) => [`¥${value.toLocaleString()}`, '市值']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-lg p-6">
              <h3 className="text-white mb-4">持仓详情</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                {positionData.map((pos, idx) => {
                  const profit = ((pos.currentPrice - pos.cost) / pos.cost) * 100;
                  return (
                    <div key={idx} className="p-3 bg-gray-700 bg-opacity-30 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white">{pos.name}</span>
                        <span className={profit >= 0 ? 'price-up' : 'price-down'}>
                          {profit >= 0 ? '+' : ''}{profit.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        持仓: {pos.shares.toLocaleString()}股 · 成本: ¥{pos.cost.toFixed(2)} · 现价: ¥{pos.currentPrice.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Trade History Tab */}
        <TabsContent value="trades">
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-white mb-4">交易历史记录</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">日期时间</TableHead>
                    <TableHead className="text-gray-400">股票</TableHead>
                    <TableHead className="text-gray-400">操作</TableHead>
                    <TableHead className="text-gray-400">价格</TableHead>
                    <TableHead className="text-gray-400">数量</TableHead>
                    <TableHead className="text-gray-400">金额</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeHistory.map((trade, idx) => (
                    <TableRow key={idx} className="border-gray-700">
                      <TableCell className="text-white">
                        {trade.date.toLocaleDateString('zh-CN')} {trade.date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-white">
                        {trade.stock}
                        <span className="text-gray-400 text-xs ml-2">{trade.stockCode}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={trade.action === 'buy' ? 'bg-red-600' : 'bg-green-600'}>
                          {trade.action === 'buy' ? '买入' : '卖出'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">¥{trade.price.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{trade.shares.toLocaleString()}</TableCell>
                      <TableCell className="text-white">¥{trade.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-white mb-4">月度收益分布</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { month: '1月', return: 5.2 },
                  { month: '2月', return: -2.1 },
                  { month: '3月', return: 8.5 },
                  { month: '4月', return: 3.7 },
                  { month: '5月', return: -1.5 },
                  { month: '6月', return: 12.3 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => [`${value.toFixed(2)}%`, '收益']}
                  />
                  <Bar dataKey="return" fill={model.color} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-lg p-6">
              <h3 className="text-white mb-4">风险指标</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 bg-opacity-30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">年化收益率</span>
                    <span className="text-white text-xl">{(model.totalReturn * 2.5).toFixed(2)}%</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-700 bg-opacity-30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">年化波动率</span>
                    <span className="text-white text-xl">18.5%</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-700 bg-opacity-30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">盈亏比</span>
                    <span className="text-white text-xl">2.3</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-700 bg-opacity-30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">平均持仓天数</span>
                    <span className="text-white text-xl">5.2天</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
