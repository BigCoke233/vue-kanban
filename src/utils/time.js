export function getRelativeTime(date) {
  if (!date) return ''
  
  const now = new Date()
  const target = new Date(date)
  const diff = target - now
  const absDiff = Math.abs(diff)
  const isFuture = diff > 0
  
  // Units in milliseconds
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  
  // Less than 1 minute
  if (absDiff < minute) {
    return '刚刚'
  }
  
  // Less than 1 hour
  if (absDiff < hour) {
    const minutes = Math.floor(absDiff / minute)
    return isFuture ? `${minutes} 分钟后` : `${minutes} 分钟前`
  }
  
  // Less than 24 hours
  if (absDiff < day) {
    const hours = Math.floor(absDiff / hour)
    return isFuture ? `${hours} 小时后` : `${hours} 小时前`
  }
  
  // Less than 7 days
  if (absDiff < day * 7) {
    const days = Math.floor(absDiff / day)
    return isFuture ? `${days} 天后` : `${days} 天前`
  }
  
  // Fallback to absolute date for older/future dates
  const year = target.getFullYear()
  const month = target.getMonth() + 1
  const d = target.getDate()
  
  if (year === now.getFullYear()) {
    return `${month} 月 ${d} 日`
  }
  return `${year} 年 ${month} 月 ${d} 日`
}
