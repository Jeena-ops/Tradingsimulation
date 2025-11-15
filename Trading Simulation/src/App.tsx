import { useState } from 'react';
import { TopStatusBar } from './components/sci/TopStatusBar';
import { MainNavigation } from './components/sci/MainNavigation';
import { LeftStockSidebar } from './components/sci/LeftStockSidebar';
import { RightInfoPanel } from './components/sci/RightInfoPanel';
import { DashboardView } from './components/sci/DashboardView';
import { StockDetailView } from './components/sci/StockDetailView';
import { AIModelDetailView } from './components/sci/AIModelDetailView';
import { SectorRotationView } from './components/sci/SectorRotationView';
import { DecisionTimelineView } from './components/sci/DecisionTimelineView';
import { DEFAULT_STOCK_SYMBOLS, AI_MODELS } from './utils/stockData';
import type { Stock, AIModel } from './utils/stockData';
import { LanguageProvider, useLanguage } from './utils/language';

type View = 
  | 'dashboard' 
  | 'stock-list' 
  | 'stock-detail' 
  | 'ai-arena'
  | 'ai-detail' 
  | 'sector' 
  | 'timeline' 
  | 'settings';

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedAIModel, setSelectedAIModel] = useState<AIModel | null>(null);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setCurrentView('stock-detail');
  };

  const handleAIModelClick = (model: AIModel) => {
    setSelectedAIModel(model);
    setCurrentView('ai-detail');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
    // 清除选中的股票和AI模型（除非是详情页）
    if (view !== 'stock-detail') setSelectedStock(null);
    if (view !== 'ai-detail') setSelectedAIModel(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedStock(null);
    setSelectedAIModel(null);
  };

  const handleBackToStockList = () => {
    setCurrentView('stock-list');
    setSelectedStock(null);
  };

  const handleBackToAIArena = () => {
    setCurrentView('ai-arena');
    setSelectedAIModel(null);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onAIModelClick={handleAIModelClick} />;
      
      case 'stock-list':
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-white text-2xl mb-2">{t('stock.pool.title')}</h1>
              <p className="text-gray-400">{t('stock.pool.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {DEFAULT_STOCK_SYMBOLS.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                return (
                  <div
                    key={stock.code}
                    onClick={() => handleStockSelect(stock)}
                    className="glass-card rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-all hover:scale-[1.02] border border-gray-700 hover:border-[#1E40AF]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white text-xl mb-1">{stock.name}</h3>
                        <p className="text-gray-400 text-sm">{stock.code}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-white">¥{stock.price.toFixed(2)}</div>
                        <div className={`text-sm flex items-center justify-end gap-1 ${isPositive ? 'price-up' : 'price-down'}`}>
                          <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400 mb-1">{t('stock.volume')}</div>
                        <div className="text-white">{(stock.volume / 10000).toFixed(0)}万</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">{t('stock.turnover')}</div>
                        <div className="text-white">{stock.turnover.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">{t('stock.aiAttention')}</div>
                        <div className="text-[#1E40AF]">{stock.aiAttention}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 'stock-detail':
        return selectedStock ? (
          <StockDetailView 
            stock={selectedStock} 
            onBack={handleBackToStockList}
          />
        ) : null;
      
      case 'ai-arena':
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-white text-2xl mb-2">{t('ai.arena.title')}</h1>
              <p className="text-gray-400">{t('ai.arena.subtitle')}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {AI_MODELS.map(model => (
                <div
                  key={model.id}
                  onClick={() => handleAIModelClick(model)}
                  className="glass-card rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-all hover:scale-[1.02] border-l-4"
                  style={{ borderLeftColor: model.color }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg">{model.name}</h3>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: model.color }}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{t('ai.totalReturn')}</span>
                      <span className={`text-xl ${model.totalReturn >= 0 ? 'price-up' : 'price-down'}`}>
                        {model.totalReturn >= 0 ? '+' : ''}{model.totalReturn.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{t('ai.sharpeRatio')}</span>
                      <span className="text-white">{model.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{t('ai.winRate')}</span>
                      <span className="text-white">{model.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{t('ai.positions')}</span>
                      <span className="text-white">{model.positionCount} / 10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <DashboardView onAIModelClick={handleAIModelClick} />
          </div>
        );
      
      case 'ai-detail':
        return selectedAIModel ? (
          <AIModelDetailView
            model={selectedAIModel}
            onBack={handleBackToAIArena}
          />
        ) : null;
      
      case 'sector':
        return <SectorRotationView />;
      
      case 'timeline':
        return <DecisionTimelineView />;
      
      case 'settings':
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-white text-2xl mb-2">{t('settings.title')}</h1>
              <p className="text-gray-400">{t('settings.subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card rounded-lg p-6">
                <h3 className="text-white mb-4">{t('settings.tradingRules')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.t1')}</span>
                    <div className="w-12 h-6 bg-green-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.commission')}</span>
                    <span className="text-white">0.03%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.stampTax')}</span>
                    <span className="text-white">0.1%</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h3 className="text-white mb-4">{t('settings.aiConfig')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.decisionFreq')}</span>
                    <span className="text-white">{t('settings.decisionFreqValue')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.modelCount')}</span>
                    <span className="text-white">6 {t('common.models')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.autoTrade')}</span>
                    <div className="w-12 h-6 bg-green-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h3 className="text-white mb-4">{t('settings.stockPool')}</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400 mb-2">{t('settings.currentPool')} ({DEFAULT_STOCK_SYMBOLS.length}{t('common.units')})</div>
                  {DEFAULT_STOCK_SYMBOLS.map(stock => (
                    <div key={stock.code} className="flex items-center justify-between p-2 bg-gray-700 bg-opacity-30 rounded text-sm">
                      <span className="text-white">{stock.name}</span>
                      <span className="text-gray-400">{stock.code}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h3 className="text-white mb-4">{t('settings.dataManagement')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.dataSource')}</span>
                    <span className="text-green-500">{t('settings.connected')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.updateFreq')}</span>
                    <span className="text-white">{t('settings.realtime')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-30 rounded">
                    <span className="text-gray-400">{t('settings.historicalData')}</span>
                    <span className="text-white">30{t('settings.days')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <DashboardView onAIModelClick={handleAIModelClick} />;
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div className="flex flex-col h-screen bg-[#1F2937] overflow-hidden">
        {/* Top Status Bar */}
        <TopStatusBar />
        
        {/* Main Navigation */}
        <MainNavigation activeView={currentView} onViewChange={handleViewChange} />
        
        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Stock Sidebar */}
          <LeftStockSidebar 
            onStockSelect={handleStockSelect}
            selectedStock={selectedStock}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {renderMainContent()}
          </div>

          {/* Right Info Panel */}
          <RightInfoPanel />
        </div>
      </div>
    </>
  );
}