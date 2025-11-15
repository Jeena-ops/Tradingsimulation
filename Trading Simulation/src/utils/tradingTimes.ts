// Trading times: 9:00, 11:00, 14:30 daily
export const TRADING_TIMES = [
  { hour: 9, minute: 0 },
  { hour: 11, minute: 0 },
  { hour: 14, minute: 30 }
];

export function getNextTradingTime(currentTime: Date): Date {
  const now = new Date(currentTime);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Check each trading time today
  for (const time of TRADING_TIMES) {
    const tradingTime = new Date(today);
    tradingTime.setHours(time.hour, time.minute, 0, 0);
    
    if (tradingTime > now) {
      return tradingTime;
    }
  }
  
  // If all times have passed today, return first time tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(TRADING_TIMES[0].hour, TRADING_TIMES[0].minute, 0, 0);
  
  return tomorrow;
}

export function isAtTradingTime(currentTime: Date): boolean {
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  
  return TRADING_TIMES.some(time => 
    time.hour === hour && time.minute === minute
  );
}

export function getCurrentTradingSession(currentTime: Date): number | null {
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  
  for (let i = 0; i < TRADING_TIMES.length; i++) {
    const time = TRADING_TIMES[i];
    if (time.hour === hour && time.minute === minute) {
      return i;
    }
  }
  
  return null;
}
