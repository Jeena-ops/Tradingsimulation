import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    // Top Bar
    'platform.title': '科创板AI交易竞技平台',
    'platform.subtitle': 'STAR Market AI Trading Arena',
    'status.trading': '交易中',
    'status.closed': '休市',
    'status.auction': '集合竞价',
    'status.market': '市场状态',
    'countdown.title': '下次决策倒计时',
    'connection.realtime': '实时连接',
    
    // Navigation
    'nav.dashboard': '首页仪表盘',
    'nav.stockPool': '股票池',
    'nav.aiArena': 'AI竞技场',
    'nav.sector': '板块轮动',
    'nav.timeline': '决策时间线',
    'nav.settings': '系统配置',
    
    // Dashboard
    'dashboard.title': '首页仪表盘',
    'dashboard.subtitle': '实时监控与AI决策',
    'dashboard.marketOverview': '市场总览',
    'dashboard.aiModels': 'AI模型表现',
    'dashboard.topGainers': '涨幅榜',
    'dashboard.topLosers': '跌幅榜',
    'dashboard.tradingVolume': '成交量排行',
    
    // Stock Pool
    'stock.pool.title': '科创板股票池',
    'stock.pool.subtitle': '10只科创板龙头股票实时监控',
    'stock.volume': '成交量',
    'stock.turnover': '换手率',
    'stock.aiAttention': 'AI关注',
    'stock.price': '价格',
    'stock.change': '涨跌幅',
    'stock.high': '最高',
    'stock.low': '最低',
    'stock.open': '开盘',
    'stock.close': '收盘',
    'stock.marketCap': '市值',
    
    // AI Arena
    'ai.arena.title': 'AI竞技场',
    'ai.arena.subtitle': '6个AI交易模型实时对比',
    'ai.totalReturn': '总收益率',
    'ai.sharpeRatio': '夏普比率',
    'ai.winRate': '胜率',
    'ai.positions': '持仓数',
    'ai.maxDrawdown': '最大回撤',
    'ai.trades': '交易次数',
    'ai.avgReturn': '平均收益',
    
    // Sector Rotation
    'sector.title': '板块轮动分析',
    'sector.subtitle': '实时追踪板块资金流向',
    
    // Decision Timeline
    'timeline.title': 'AI决策时间线',
    'timeline.subtitle': '按时间顺序查看所有AI交易决策',
    
    // Settings
    'settings.title': '系统配置',
    'settings.subtitle': '平台参数设置和管理',
    'settings.tradingRules': '交易规则配置',
    'settings.t1': 'T+1限制',
    'settings.commission': '手续费率',
    'settings.stampTax': '印花税',
    'settings.aiConfig': 'AI模型配置',
    'settings.decisionFreq': '决策频率',
    'settings.decisionFreqValue': '每日3次',
    'settings.modelCount': '运行模型数',
    'settings.autoTrade': '自动交易',
    'settings.stockPool': '股票池管理',
    'settings.currentPool': '当前股票池',
    'settings.dataManagement': '数据管理',
    'settings.dataSource': '数据源',
    'settings.connected': '已连接',
    'settings.updateFreq': '更新频率',
    'settings.realtime': '实时',
    'settings.historicalData': '历史数据',
    'settings.days': '天',
    
    // Trading Times
    'trading.nextTime': '下次交易时间',
    'trading.times': '交易时段',
    'trading.morning1': '上午 9:00',
    'trading.morning2': '上午 11:00',
    'trading.afternoon': '下午 14:30',
    
    // Common
    'common.back': '返回',
    'common.details': '详情',
    'common.buy': '买入',
    'common.sell': '卖出',
    'common.hold': '持有',
    'common.units': '只',
    'common.models': '个',
    
    // Dashboard specific
    'dashboard.performance': '业绩表现',
    'dashboard.recentDecisions': '最新决策',
    'dashboard.quickStats': '快速统计',
    'dashboard.totalValue': '总市值',
    'dashboard.totalAssets': '总资产',
    'dashboard.totalProfit': '总收益',
    'dashboard.profitRate': '收益率',
    'dashboard.today': '今日',
    'dashboard.week': '本周',
    'dashboard.month': '本月',
    
    // Stock Detail
    'stock.detail.title': '股票详情',
    'stock.detail.chart': '价格走势',
    'stock.detail.info': '基本信息',
    'stock.detail.aiAnalysis': 'AI分析',
    'stock.detail.relatedNews': '相关新闻',
    'stock.detail.trades': '交易记录',
    
    // AI Model Detail
    'ai.detail.overview': '模型总览',
    'ai.detail.performance': '业绩指标',
    'ai.detail.holdings': '持仓明细',
    'ai.detail.history': '历史决策',
    'ai.detail.strategy': '策略说明',
    
    // Sector
    'sector.semiconductor': '半导体',
    'sector.solar': '光伏',
    'sector.tech': '科技',
    'sector.inflow': '资金流入',
    'sector.outflow': '资金流出',
    'sector.rotation': '板块轮动',
    
    // Timeline
    'timeline.all': '全部',
    'timeline.filter': '筛选',
    'timeline.today': '今天',
    'timeline.week': '本周',
    'timeline.month': '本月',
  },
  en: {
    // Top Bar
    'platform.title': 'STAR Market AI Trading Arena',
    'platform.subtitle': 'Real-time AI Trading Competition Platform',
    'status.trading': 'Trading',
    'status.closed': 'Closed',
    'status.auction': 'Auction',
    'status.market': 'Market Status',
    'countdown.title': 'Next Decision In',
    'connection.realtime': 'Live',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.stockPool': 'Stock Pool',
    'nav.aiArena': 'AI Arena',
    'nav.sector': 'Sector Rotation',
    'nav.timeline': 'Decision Timeline',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Real-time Monitoring & AI Decisions',
    'dashboard.marketOverview': 'Market Overview',
    'dashboard.aiModels': 'AI Model Performance',
    'dashboard.topGainers': 'Top Gainers',
    'dashboard.topLosers': 'Top Losers',
    'dashboard.tradingVolume': 'Trading Volume',
    
    // Stock Pool
    'stock.pool.title': 'STAR Market Stock Pool',
    'stock.pool.subtitle': '10 Leading STAR Market Stocks Real-time Monitoring',
    'stock.volume': 'Volume',
    'stock.turnover': 'Turnover',
    'stock.aiAttention': 'AI Focus',
    'stock.price': 'Price',
    'stock.change': 'Change',
    'stock.high': 'High',
    'stock.low': 'Low',
    'stock.open': 'Open',
    'stock.close': 'Close',
    'stock.marketCap': 'Market Cap',
    
    // AI Arena
    'ai.arena.title': 'AI Arena',
    'ai.arena.subtitle': '6 AI Trading Models Real-time Comparison',
    'ai.totalReturn': 'Total Return',
    'ai.sharpeRatio': 'Sharpe Ratio',
    'ai.winRate': 'Win Rate',
    'ai.positions': 'Positions',
    'ai.maxDrawdown': 'Max Drawdown',
    'ai.trades': 'Trades',
    'ai.avgReturn': 'Avg Return',
    
    // Sector Rotation
    'sector.title': 'Sector Rotation Analysis',
    'sector.subtitle': 'Real-time Sector Fund Flow Tracking',
    
    // Decision Timeline
    'timeline.title': 'AI Decision Timeline',
    'timeline.subtitle': 'View All AI Trading Decisions Chronologically',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Platform Parameters Configuration',
    'settings.tradingRules': 'Trading Rules',
    'settings.t1': 'T+1 Restriction',
    'settings.commission': 'Commission',
    'settings.stampTax': 'Stamp Tax',
    'settings.aiConfig': 'AI Model Config',
    'settings.decisionFreq': 'Decision Frequency',
    'settings.decisionFreqValue': '3 Times Daily',
    'settings.modelCount': 'Active Models',
    'settings.autoTrade': 'Auto Trading',
    'settings.stockPool': 'Stock Pool Management',
    'settings.currentPool': 'Current Pool',
    'settings.dataManagement': 'Data Management',
    'settings.dataSource': 'Data Source',
    'settings.connected': 'Connected',
    'settings.updateFreq': 'Update Frequency',
    'settings.realtime': 'Real-time',
    'settings.historicalData': 'Historical Data',
    'settings.days': 'days',
    
    // Trading Times
    'trading.nextTime': 'Next Trading Time',
    'trading.times': 'Trading Sessions',
    'trading.morning1': '9:00 AM',
    'trading.morning2': '11:00 AM',
    'trading.afternoon': '2:30 PM',
    
    // Common
    'common.back': 'Back',
    'common.details': 'Details',
    'common.buy': 'Buy',
    'common.sell': 'Sell',
    'common.hold': 'Hold',
    'common.units': 'stocks',
    'common.models': 'models',
    
    // Dashboard specific
    'dashboard.performance': 'Performance',
    'dashboard.recentDecisions': 'Recent Decisions',
    'dashboard.quickStats': 'Quick Stats',
    'dashboard.totalValue': 'Total Value',
    'dashboard.totalAssets': 'Total Assets',
    'dashboard.totalProfit': 'Total Profit',
    'dashboard.profitRate': 'Profit Rate',
    'dashboard.today': 'Today',
    'dashboard.week': 'This Week',
    'dashboard.month': 'This Month',
    
    // Stock Detail
    'stock.detail.title': 'Stock Details',
    'stock.detail.chart': 'Price Chart',
    'stock.detail.info': 'Basic Info',
    'stock.detail.aiAnalysis': 'AI Analysis',
    'stock.detail.relatedNews': 'Related News',
    'stock.detail.trades': 'Trade Records',
    
    // AI Model Detail
    'ai.detail.overview': 'Model Overview',
    'ai.detail.performance': 'Performance Metrics',
    'ai.detail.holdings': 'Holding Details',
    'ai.detail.history': 'Historical Decisions',
    'ai.detail.strategy': 'Strategy Description',
    
    // Sector
    'sector.semiconductor': 'Semiconductor',
    'sector.solar': 'Solar',
    'sector.tech': 'Tech',
    'sector.inflow': 'Inflow',
    'sector.outflow': 'Outflow',
    'sector.rotation': 'Sector Rotation',
    
    // Timeline
    'timeline.all': 'All',
    'timeline.filter': 'Filter',
    'timeline.today': 'Today',
    'timeline.week': 'This Week',
    'timeline.month': 'This Month',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.zh] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}