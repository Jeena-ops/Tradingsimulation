import { useState, useEffect } from 'react';
import { Newspaper, Activity, Bell, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { generateMockDecisions, AI_MODELS, type Decision } from '../../utils/stockData';
import { useLanguage } from '../../utils/language';

export function RightInfoPanel() {
  const { language } = useLanguage();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [systemLogs, setSystemLogs] = useState<Array<{ time: Date; message: { zh: string; en: string }; type: 'info' | 'warning' | 'success' }>>([]);

  useEffect(() => {
    // 初始化决策数据
    setDecisions(generateMockDecisions(15));

    // 初始化系统日志
    setSystemLogs([
      { time: new Date(), message: { zh: '数据源连接正常', en: 'Data source connected' }, type: 'success' },
      { time: new Date(Date.now() - 60000), message: { zh: 'AI模型同步完成', en: 'AI models synchronized' }, type: 'success' },
      { time: new Date(Date.now() - 120000), message: { zh: '市场数据更新延迟', en: 'Market data update delayed' }, type: 'warning' },
    ]);

    // 模拟新决策
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newDecisions = generateMockDecisions(1);
        setDecisions(prev => [newDecisions[0], ...prev].slice(0, 15));
        
        const aiModel = AI_MODELS.find(m => m.id === newDecisions[0].aiModelId);
        setSystemLogs(prev => [{
          time: new Date(),
          message: {
            zh: `${aiModel?.name} 发出 ${newDecisions[0].action === 'buy' ? '买入' : newDecisions[0].action === 'sell' ? '卖出' : '持有'} 信号`,
            en: `${aiModel?.name} issued ${newDecisions[0].action.toUpperCase()} signal`
          },
          type: 'info'
        }, ...prev].slice(0, 10));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getActionConfig = (action: Decision['action']) => {
    switch (action) {
      case 'buy':
        return { label: language === 'zh' ? '买入' : 'Buy', color: 'bg-red-600', icon: TrendingUp };
      case 'sell':
        return { label: language === 'zh' ? '卖出' : 'Sell', color: 'bg-green-600', icon: TrendingDown };
      case 'hold':
        return { label: language === 'zh' ? '持有' : 'Hold', color: 'bg-gray-600', icon: Activity };
    }
  };

  const getTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (language === 'zh') {
      if (minutes < 60) return `${minutes}分钟前`;
      const hours = Math.floor(minutes / 60);
      return `${hours}小时前`;
    } else {
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    }
  };

  const newsData = [
    { 
      title: { zh: '科创板芯片股集体上涨，中芯国际领涨', en: 'STAR Market chip stocks rise, SMIC leads' },
      time: language === 'zh' ? '10分钟前' : '10m ago'
    },
    { 
      title: { zh: '光伏行业政策利好，概念股午后拉升', en: 'Solar industry policy boost, stocks rally' },
      time: language === 'zh' ? '25分钟前' : '25m ago'
    },
    { 
      title: { zh: '金山办公发布AI办公新品', en: 'Kingsoft Office launches AI products' },
      time: language === 'zh' ? '1小时前' : '1h ago'
    },
    { 
      title: { zh: '传音控股海外市场份额持续增长', en: 'Transsion grows overseas market share' },
      time: language === 'zh' ? '2小时前' : '2h ago'
    },
    { 
      title: { zh: '半导体设备国产化进程加速', en: 'Semiconductor equipment localization accelerates' },
      time: language === 'zh' ? '3小时前' : '3h ago'
    },
  ];

  return (
    <div className="w-96 bg-[#111827] border-l border-gray-700 h-screen flex flex-col overflow-hidden">
      <Tabs defaultValue="decisions" className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="decisions" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              {language === 'zh' ? '决策流' : 'Decisions'}
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs">
              <Newspaper className="w-3 h-3 mr-1" />
              {language === 'zh' ? '新闻' : 'News'}
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs">
              <Bell className="w-3 h-3 mr-1" />
              {language === 'zh' ? '系统' : 'System'}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* AI Decisions Tab */}
        <TabsContent value="decisions" className="flex-1 overflow-hidden m-0">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-sm">{language === 'zh' ? '最近决策' : 'Recent Decisions'}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">{language === 'zh' ? '实时更新' : 'Live'}</span>
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
                        <span className="text-gray-400">{language === 'zh' ? '置信度' : 'Confidence'}</span>
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
            <h3 className="text-white text-sm">{language === 'zh' ? '市场新闻' : 'Market News'}</h3>
          </div>

          <ScrollArea className="flex-1 p-4 scrollbar-thin">
            <div className="space-y-3">
              {newsData.map((news, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-lg p-3 hover:bg-gray-700 hover:bg-opacity-30 transition-all cursor-pointer"
                >
                  <h4 className="text-white text-sm mb-2 leading-tight">{news.title[language]}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{news.time}</span>
                    <Badge className="bg-green-600 text-white text-xs">
                      {language === 'zh' ? '利好' : 'Bullish'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="flex-1 overflow-hidden m-0">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white text-sm">{language === 'zh' ? '系统状态' : 'System Status'}</h3>
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
                      <p className="text-white text-sm mb-1">{log.message[language]}</p>
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
            <div className="text-xs text-gray-400">{language === 'zh' ? '买入' : 'Buy'}</div>
          </div>
          <div>
            <div className="text-lg text-white">{decisions.filter(d => d.action === 'sell').length}</div>
            <div className="text-xs text-gray-400">{language === 'zh' ? '卖出' : 'Sell'}</div>
          </div>
          <div>
            <div className="text-lg text-white">{decisions.filter(d => d.action === 'hold').length}</div>
            <div className="text-xs text-gray-400">{language === 'zh' ? '持有' : 'Hold'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}