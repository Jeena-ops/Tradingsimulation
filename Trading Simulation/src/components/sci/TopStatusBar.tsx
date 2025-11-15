import { useState, useEffect } from 'react';
import { Clock, Activity, AlertCircle, Wifi, Globe } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../utils/language';
import { getNextTradingTime, TRADING_TIMES } from '../../utils/tradingTimes';
import { Button } from '../ui/button';

export function TopStatusBar() {
  const { language, setLanguage, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextDecisionTime, setNextDecisionTime] = useState<Date>(getNextTradingTime(new Date()));
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // 更新当前时间
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // 检查是否需要更新下次交易时间
      if (now >= nextDecisionTime) {
        setNextDecisionTime(getNextTradingTime(now));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextDecisionTime]);

  useEffect(() => {
    // 更新倒计时
    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextDecisionTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setNextDecisionTime(getNextTradingTime(now));
        return;
      }
      
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      if (hours > 0) {
        setCountdown(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextDecisionTime]);

  // 判断交易状态
  const getTradingStatus = () => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const day = currentTime.getDay();

    // 周末
    if (day === 0 || day === 6) {
      return { status: t('status.closed'), color: 'bg-gray-600', icon: AlertCircle };
    }

    // 开市时间: 9:30-11:30, 13:00-15:00
    if ((hour === 9 && minute >= 30) || (hour === 10) || (hour === 11 && minute < 30) ||
        (hour === 13) || (hour === 14)) {
      return { status: t('status.trading'), color: 'bg-green-600', icon: Activity };
    }

    // 集合竞价: 9:15-9:25
    if (hour === 9 && minute >= 15 && minute < 25) {
      return { status: t('status.auction'), color: 'bg-yellow-600', icon: Clock };
    }

    return { status: t('status.closed'), color: 'bg-gray-600', icon: AlertCircle };
  };

  const tradingStatus = getTradingStatus();
  const StatusIcon = tradingStatus.icon;

  return (
    <div className="h-16 bg-[#111827] border-b border-gray-700 px-6 flex items-center justify-between">
      {/* Left: Logo and Platform Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white">{t('platform.title')}</h1>
            <p className="text-xs text-gray-400">{t('platform.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Center: Trading Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-white text-lg tabular-nums">
              {currentTime.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour12: language === 'en' })}
            </div>
            <div className="text-xs text-gray-400">
              {currentTime.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                weekday: 'short'
              })}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-700" />

        <div className="flex items-center gap-3">
          <StatusIcon className="w-5 h-5 text-gray-400" />
          <div>
            <Badge className={`${tradingStatus.color} text-white mb-1`}>
              {tradingStatus.status}
            </Badge>
            <div className="text-xs text-gray-400">{t('status.market')}</div>
          </div>
        </div>
      </div>

      {/* Right: Next Decision Countdown & Language Toggle */}
      <div className="flex items-center gap-6">
        <div className="glass-card rounded-lg px-4 py-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">{t('countdown.title')}</div>
              <div className="text-2xl text-[#1E40AF] tabular-nums">{countdown}</div>
            </div>
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="rgba(30, 64, 175, 0.2)"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#1E40AF"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - (countdown.includes(':') ? parseInt(countdown.split(':')[0]) / 60 : 0))}`}
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{language === 'zh' ? '中文' : 'EN'}</span>
        </Button>

        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-xs text-gray-400">{t('connection.realtime')}</span>
        </div>
      </div>
    </div>
  );
}