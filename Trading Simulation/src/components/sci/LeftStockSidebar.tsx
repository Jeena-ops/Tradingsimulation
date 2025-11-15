import { useState } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { DEFAULT_STOCK_SYMBOLS, getSectorColor, type Stock } from '../../utils/stockData';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../utils/language';

interface LeftStockSidebarProps {
  onStockSelect: (stock: Stock) => void;
  selectedStock?: Stock | null;
}

export function LeftStockSidebar({ onStockSelect, selectedStock }: LeftStockSidebarProps) {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // 按板块分组
  const semiconductorStocks = DEFAULT_STOCK_SYMBOLS.filter(s => s.sector === 'semiconductor');
  const solarStocks = DEFAULT_STOCK_SYMBOLS.filter(s => s.sector === 'solar');
  const techStocks = DEFAULT_STOCK_SYMBOLS.filter(s => s.sector === 'tech');

  const filteredStocks = (stocks: Stock[]) => {
    if (!searchQuery) return stocks;
    return stocks.filter(s => 
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery)
    );
  };

  const renderStockItem = (stock: Stock) => {
    const isSelected = selectedStock?.code === stock.code;
    const isPositive = stock.changePercent >= 0;

    return (
      <div
        key={stock.code}
        onClick={() => onStockSelect(stock)}
        className={`p-3 cursor-pointer transition-all border-l-2 ${
          isSelected 
            ? 'bg-[#1E40AF] bg-opacity-20 border-l-[#1E40AF]' 
            : 'border-l-transparent hover:bg-gray-700 hover:bg-opacity-30'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">{stock.name}</span>
            <span className="text-gray-400 text-xs">{stock.code}</span>
          </div>
          {stock.aiAttention > 80 && (
            <Badge className="bg-[#F59E0B] text-white text-xs px-1 py-0">
              {language === 'zh' ? '热' : 'Hot'}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white">¥{stock.price.toFixed(2)}</span>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'price-up' : 'price-down'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
          <span>{language === 'zh' ? '成交' : 'Vol'}:{(stock.volume / 10000).toFixed(0)}{language === 'zh' ? '万' : 'K'}</span>
          <span>{language === 'zh' ? '换手' : 'Turn'}:{stock.turnover.toFixed(2)}%</span>
        </div>
      </div>
    );
  };

  const getSectorName = (sector: string) => {
    const names: Record<string, { zh: string; en: string }> = {
      semiconductor: { zh: '半导体板块', en: 'Semiconductor' },
      solar: { zh: '光伏板块', en: 'Solar Energy' },
      tech: { zh: '科技其他', en: 'Technology' }
    };
    return names[sector]?.[language] || sector;
  };

  const renderSectorGroup = (sector: string, stocks: Stock[], color: string) => {
    const filtered = filteredStocks(stocks);
    if (filtered.length === 0 && searchQuery) return null;

    return (
      <div className="mb-4">
        <div 
          className="px-3 py-2 flex items-center gap-2 border-b border-gray-700"
          style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-gray-300 text-sm">{getSectorName(sector)}</span>
          <span className="text-gray-500 text-xs">({filtered.length})</span>
        </div>
        <div className="space-y-0.5">
          {filtered.map(renderStockItem)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-[#111827] border-r border-gray-700 h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white mb-3">{t('stock.pool.title')}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh' ? '搜索股票代码或名称...' : 'Search stock code or name...'}
            className="pl-10 bg-gray-700 border-gray-600 text-white text-sm"
          />
        </div>
      </div>

      {/* Stock List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {renderSectorGroup('semiconductor', semiconductorStocks, getSectorColor('semiconductor'))}
        {renderSectorGroup('solar', solarStocks, getSectorColor('solar'))}
        {renderSectorGroup('tech', techStocks, getSectorColor('tech'))}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-gray-400 mb-1">{language === 'zh' ? '上涨' : 'Gainers'}</div>
            <div className="price-up text-lg">
              {DEFAULT_STOCK_SYMBOLS.filter(s => s.changePercent > 0).length}{language === 'zh' ? '只' : ''}
            </div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">{language === 'zh' ? '下跌' : 'Losers'}</div>
            <div className="price-down text-lg">
              {DEFAULT_STOCK_SYMBOLS.filter(s => s.changePercent < 0).length}{language === 'zh' ? '只' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}