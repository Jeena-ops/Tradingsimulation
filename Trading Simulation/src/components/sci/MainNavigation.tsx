import { Home, BarChart3, Brain, TrendingUp, Clock, Settings, FileText } from 'lucide-react';
import { useLanguage } from '../../utils/language';

interface MainNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function MainNavigation({ activeView, onViewChange }: MainNavigationProps) {
  const { t } = useLanguage();
  
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'stock-list', label: t('nav.stockPool'), icon: BarChart3 },
    { id: 'ai-arena', label: t('nav.aiArena'), icon: Brain },
    { id: 'sector', label: t('nav.sector'), icon: TrendingUp },
    { id: 'timeline', label: t('nav.timeline'), icon: Clock },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <div className="h-14 bg-[#111827] border-b border-gray-700 px-6 flex items-center gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isActive
                ? 'bg-[#1E40AF] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}