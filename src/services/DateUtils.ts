/**
 * 日期格式化工具函数
 */

/**
 * 将ISO日期字符串格式化为友好的中文格式
 * @param dateString - ISO格式的日期字符串 (如: "2024-01-15T10:00:00Z")
 * @returns 格式化后的日期字符串 (如: "2024年1月15日")
 */
export function formatDateToChinese(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateString; // 如果无法解析，返回原字符串
    }
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 返回 0-11
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
  } catch (error) {
    console.warn('日期格式化失败:', error);
    return dateString; // 出错时返回原字符串
  }
}

/**
 * 将ISO日期字符串格式化为简洁的数字格式
 * @param dateString - ISO格式的日期字符串 (如: "2024-01-15T10:00:00Z" 或 "2024-01-15T10:00:00.000Z")
 * @returns 格式化后的日期字符串 (如: "2024-01-15")
 */
export function formatDateToSimple(dateString: string): string {
  if (!dateString) return '';
  
  try {
    // 预处理日期字符串，确保能正确解析各种ISO格式
    let processedDateString = dateString.trim();
    
    // 如果是简单的YYYY-MM-DD格式，直接返回标准化格式
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(processedDateString)) {
      const [year, month, day] = processedDateString.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // 处理ISO格式日期字符串
    const date = new Date(processedDateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      // 尝试其他格式解析
      console.warn('无法解析日期格式:', processedDateString);
      return dateString; // 如果无法解析，返回原字符串
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('日期格式化失败:', error);
    return dateString; // 出错时返回原字符串
  }
}

/**
 * 智能日期格式化 - 根据日期字符串的格式自动选择合适的格式化方式
 * 支持多种ISO日期格式：
 * - "2024-01-15T10:00:00Z"
 * - "2024-01-15T10:00:00.000Z"
 * - "2025-09-29T03:11:00.000Z"
 * - "2024-07-20T00:00:00Z"
 * - "2024-01-15"
 * @param dateString - 日期字符串
 * @returns 格式化后的日期字符串 (YYYY-MM-DD格式)
 */
export const formatDateSmart = (dateString: string): string => {
  if (!dateString) {
    return '';
  }
  
  // Check if it's already in simple format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Check if it's an ISO format with time
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateString)) {
    return formatDateToSimple(dateString);
  }
  
  // Try to parse as Date and format
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return formatDateToSimple(dateString);
    }
  } catch (error) {
    // Silent error handling
  }
  
  // If all else fails, return the original string
  return dateString;
};