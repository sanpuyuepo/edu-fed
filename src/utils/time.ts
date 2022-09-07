/**
 * 时间格式化
 */

// 也可使用更轻量化的 day.js
import moment from 'moment'

/* YYYY-MM-DD HH:mm:ss */
export const getFullTime = (timeStr: string) => {
  return moment(timeStr).format('YYYY-MM-DD HH:mm:ss')
}
