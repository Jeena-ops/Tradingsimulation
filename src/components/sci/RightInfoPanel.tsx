import { useState, useEffect } from 'react';
import { Newspaper, Activity, Bell, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { generateMockDecisions, AI_MODELS, type Decision } from '../../utils/stockData';

export function RightInfoPanel() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [systemLogs, setSystemLogs] = useState<Array<{ time: Date; message: string; type: 'info' | 'warning' | 'success' }>>([]);

  useEffect(() => {
    // 初始化决策数据
    setDecisions(generateMockDecisions(15));

    // 初始化系统日志
    setSystemLogs([
      { time: new Date(), message: '数据源连接正常', type: 'success' },
      { time: new Date(Date.now() - 60000), message: 'AI模型同步完成', type: 'success' },
      { time: new Date(Date.now() - 120000), message: '市场数据更新延迟', type: 'warning' },
    ]);

    // 模拟新决策
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newDecisions = generateMockDecisions(1);
        setDecisions(prev => [newDecisions[0], ...prev].slice(0, 15));
        
        const aiModel = AI_MODELS.find(m => m.id === newDecisions[0].aiModelId);
        setSystemLogs(prev => [{
          time: new Date(),
          message: `${aiModel?.name} 发出 ${newDecisions[0].action.toUpperCase()} 信号`,
          type: 'info'
        }, ...prev].slice(0, 10));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getActionConfig = (action: Decision['action']) => {
    switch (action) {
      case 'buy':
        return { label: '买入', color: 'bg-red-600', icon: TrendingUp };
      case 'sell':
        return { label: '卖出', color: 'bg-green-600', icon: TrendingDown };
      case 'hold':
        return { label: '持有', color: 'bg-gray-600', icon: Activity };
    }
  };

  const getTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    return `${hours}小时前`;
  };

  return (
    <div className="w-96 bg-[#111827] border-l border-gray-700 h-screen flex flex-col overflow-hidden">
      <Tabs defaultValue="decisions" className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="decisions" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              决策流
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs">
              <Newspaper className="w-3 h-3 mr-1" />
              新闻
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs">
              <Bell className="w-3 h-3 mr-1" />
              系统
            </TabsTrigger>
          </TabsList>
        </div>

        {/* AI Decisions Tab */}
        <TabsContent value="decisions" className="flex-1 overflow-hidden m-0">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-sm">最近决策</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">实时更新</span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4 scrollbar-thin">
            <div className="space-y-3">
              {decisions.map((decision, idx) => {
                const aiModel = AI_MODELS.find(m => m.id === decision.aiModelId);
                const actionConfig = getActionConfig(decision.action);
                const ActionIcon = actionConfig.icon;

                return (
                  <div
                    key={idx}
                    className="glass-card rounded-lg p-3 hover:bg-gray-700 hover:bg-opacity-30 transition-all cursor-pointer group"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: aiModel?.color }}
                        />
                        <span className="text-white text-sm">{aiModel?.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{getTimeAgo(decision.timestamp)}</span>
                    </div>

                    {/* Stock and Action */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${actionConfig.color} text-white`}>
                        <ActionIcon className="w-3 h-3 mr-1" />
                        {actionConfig.label}
                      </Badge>
                      <span className="text-white">{decision.stockCode}</span>
                      <span className="text-gray-400 text-sm">@ ¥{decision.price.toFixed(2)}</span>
                    </div>

                    {/* Confidence */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">置信度</span>
                        <span className="text-white">{decision.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-gray-700 rounded overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] transition-all"
                          style={{ width: `${decision.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Reasoning */}
                    <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {decision.reasoning}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="flex-1 overflow-hidden m-0">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white text-sm">市场新闻</h3>
          </div>

          <ScrollArea className="flex-1 p-4 scrollbar-thin">
            <div className="space-y-3">
              {[
                { title: '科创板芯片股集体上涨，中芯国际领涨', time: '10分钟前', sentiment: 'positive' },
                { title: '光伏行业政策利好，概念股午后拉升', time: '25分钟前', sentiment: 'positive' },
                { title: '金山办公发布AI办公新品', time: '1小时前', sentiment: 'positive' },
                { title: '传音控股海外市场份额持续增长', time: '2小时前', sentiment: 'positive' },
                { title: '半导体设备国产化进程加速', time: '3小时前', sentiment: 'positive' },
              ].map((news, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-lg p-3 hover:bg-gray-700 hover:bg-opacity-30 transition-all cursor-pointer"
                >
                  <h4 className="text-white text-sm mb-2 leading-tight">{news.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{news.time}</span>
                    <Badge className="bg-green-600 text-white text-xs">利好</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="flex-1 overflow-hidden m-0">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white text-sm">系统状态</h3>
          </div>

          <ScrollArea className="flex-1 p-4 scrollbar-thin">
            <div className="space-y-3">
              {systemLogs.map((log, idx) => {
                const typeConfig = {
                  info: { icon: AlertCircle, color: 'text-blue-400' },
                  warning: { icon: AlertCircle, color: 'text-yellow-400' },
                  success: { icon: Activity, color: 'text-green-400' },
                };
                const config = typeConfig[log.type];
                const LogIcon = config.icon;

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 glass-card rounded-lg"
                  >
                    <LogIcon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                    <div className="flex-1">
                      <p className="text-white text-sm mb-1">{log.message}</p>
                      <span className="text-xs text-gray-400">{getTimeAgo(log.time)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg text-white">{decisions.filter(d => d.action === 'buy').length}</div>
            <div className="text-xs text-gray-400">买入</div>
          </div>
          <div>
            <div className="text-lg text-white">{decisions.filter(d => d.action === 'sell').length}</div>
            <div className="text-xs text-gray-400">卖出</div>
          </div>
          <div>
            <div className="text-lg text-white">{decisions.filter(d => d.action === 'hold').length}</div>
            <div className="text-xs text-gray-400">持有</div>
          </div>
        </div>
      </div>
    </div>
  );
}
