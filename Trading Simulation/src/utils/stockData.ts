// 科创板股票池数据结构

export interface Stock {
  code: string;
  name: string;
  sector: 'semiconductor' | 'solar' | 'tech';
  sectorName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  turnover: number;
  aiAttention: number; // AI关注度 0-100
}

export interface AIModel {
  id: string;
  name: string;
  color: string;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  positionCount: number;
  status: 'active' | 'idle' | 'deciding';
  config: {
    baseModel: string;
    signature: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface Decision {
  timestamp: Date;
  aiModelId: string;
  stockCode: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  price: number;
}

// 股票池配置
export const DEFAULT_STOCK_SYMBOLS: Stock[] = [
  {
    code: 'SH688396',
    name: '华润微',
    sector: 'semiconductor',
    sectorName: '半导体',
    price: 52.30,
    change: 1.85,
    changePercent: 3.67,
    volume: 8523400,
    turnover: 4.52,
    aiAttention: 85,
  },
  {
    code: 'SH688009',
    name: '中国通号',
    sector: 'tech',
    sectorName: '轨道交通',
    price: 6.42,
    change: -0.12,
    changePercent: -1.83,
    volume: 12456700,
    turnover: 2.38,
    aiAttention: 62,
  },
  {
    code: 'SH688012',
    name: '中微公司',
    sector: 'semiconductor',
    sectorName: '芯片设备',
    price: 178.56,
    change: 5.23,
    changePercent: 3.02,
    volume: 4235600,
    turnover: 3.87,
    aiAttention: 92,
  },
  {
    code: 'SH688036',
    name: '传音控股',
    sector: 'tech',
    sectorName: '消费电子',
    price: 98.74,
    change: -2.36,
    changePercent: -2.33,
    volume: 5678900,
    turnover: 1.95,
    aiAttention: 58,
  },
  {
    code: 'SH688099',
    name: '晶晨股份',
    sector: 'semiconductor',
    sectorName: '芯片设计',
    price: 64.28,
    change: 2.14,
    changePercent: 3.44,
    volume: 6789300,
    turnover: 5.23,
    aiAttention: 78,
  },
  {
    code: 'SH688111',
    name: '金山办公',
    sector: 'tech',
    sectorName: '软件服务',
    price: 352.16,
    change: 12.45,
    changePercent: 3.66,
    volume: 3456200,
    turnover: 2.67,
    aiAttention: 88,
  },
  {
    code: 'SH688981',
    name: '中芯国际',
    sector: 'semiconductor',
    sectorName: '芯片制造',
    price: 42.18,
    change: 1.56,
    changePercent: 3.84,
    volume: 15678400,
    turnover: 6.42,
    aiAttention: 95,
  },
  {
    code: 'SH688599',
    name: '天合光能',
    sector: 'solar',
    sectorName: '光伏',
    price: 28.94,
    change: -0.87,
    changePercent: -2.92,
    volume: 9234500,
    turnover: 3.15,
    aiAttention: 71,
  },
  {
    code: 'SH688223',
    name: '晶科能源',
    sector: 'solar',
    sectorName: '光伏',
    price: 5.67,
    change: -0.23,
    changePercent: -3.90,
    volume: 18234600,
    turnover: 7.82,
    aiAttention: 68,
  },
  {
    code: 'SH688169',
    name: '石头科技',
    sector: 'tech',
    sectorName: '智能硬件',
    price: 286.45,
    change: 8.32,
    changePercent: 2.99,
    volume: 2345600,
    turnover: 3.28,
    aiAttention: 73,
  },
];

// AI模型配置
export const AI_MODELS: AIModel[] = [
  {
    id: 'ai-001',
    name: '量化先锋Alpha',
    color: '#3B82F6',
    totalReturn: 24.56,
    sharpeRatio: 1.85,
    maxDrawdown: -8.32,
    winRate: 68.5,
    positionCount: 6,
    status: 'active',
    config: {
      baseModel: 'GPT-4-Turbo',
      signature: 'QuantPro-V2',
      riskLevel: 'medium',
    },
  },
  {
    id: 'ai-002',
    name: '趋势猎手Beta',
    color: '#10B981',
    totalReturn: 19.82,
    sharpeRatio: 1.62,
    maxDrawdown: -12.45,
    winRate: 64.2,
    positionCount: 5,
    status: 'deciding',
    config: {
      baseModel: 'Claude-3-Opus',
      signature: 'TrendFollower-V3',
      riskLevel: 'high',
    },
  },
  {
    id: 'ai-003',
    name: '稳健卫士Gamma',
    color: '#8B5CF6',
    totalReturn: 15.43,
    sharpeRatio: 2.12,
    maxDrawdown: -5.67,
    winRate: 72.8,
    positionCount: 4,
    status: 'idle',
    config: {
      baseModel: 'Gemini-Pro',
      signature: 'ConservativeGuard-V1',
      riskLevel: 'low',
    },
  },
  {
    id: 'ai-004',
    name: '动量冲击Delta',
    color: '#F59E0B',
    totalReturn: 28.91,
    sharpeRatio: 1.45,
    maxDrawdown: -15.23,
    winRate: 61.3,
    positionCount: 7,
    status: 'active',
    config: {
      baseModel: 'GPT-4-Turbo',
      signature: 'MomentumImpact-V2',
      riskLevel: 'high',
    },
  },
  {
    id: 'ai-005',
    name: '价值挖掘Epsilon',
    color: '#EC4899',
    totalReturn: 22.15,
    sharpeRatio: 1.78,
    maxDrawdown: -9.87,
    winRate: 66.9,
    positionCount: 5,
    status: 'active',
    config: {
      baseModel: 'Claude-3-Sonnet',
      signature: 'ValueHunter-V4',
      riskLevel: 'medium',
    },
  },
  {
    id: 'ai-006',
    name: '套利大师Zeta',
    color: '#14B8A6',
    totalReturn: 17.68,
    sharpeRatio: 1.95,
    maxDrawdown: -6.54,
    winRate: 70.4,
    positionCount: 6,
    status: 'idle',
    config: {
      baseModel: 'GPT-4o',
      signature: 'ArbitrageMaster-V1',
      riskLevel: 'low',
    },
  },
];

// 获取板块股票
export const getStocksBySector = (sector: Stock['sector']) => {
  return DEFAULT_STOCK_SYMBOLS.filter(stock => stock.sector === sector);
};

// 获取板块名称
export const getSectorName = (sector: Stock['sector']) => {
  const names = {
    semiconductor: '半导体板块',
    solar: '光伏板块',
    tech: '科技其他',
  };
  return names[sector];
};

// 获取板块颜色
export const getSectorColor = (sector: Stock['sector']) => {
  const colors = {
    semiconductor: '#3B82F6',
    solar: '#10B981',
    tech: '#8B5CF6',
  };
  return colors[sector];
};

// 生成模拟决策数据
export const generateMockDecisions = (count: number = 20): Decision[] => {
  const decisions: Decision[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const stock = DEFAULT_STOCK_SYMBOLS[Math.floor(Math.random() * DEFAULT_STOCK_SYMBOLS.length)];
    const aiModel = AI_MODELS[Math.floor(Math.random() * AI_MODELS.length)];
    const actions: Decision['action'][] = ['buy', 'sell', 'hold'];
    
    decisions.push({
      timestamp: new Date(now.getTime() - i * 3600000), // 每小时一个决策
      aiModelId: aiModel.id,
      stockCode: stock.code,
      action: actions[Math.floor(Math.random() * actions.length)],
      confidence: 60 + Math.random() * 40,
      reasoning: '基于技术指标分析，MACD金叉信号出现，RSI处于超卖区域，建议买入',
      price: stock.price,
    });
  }
  
  return decisions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};