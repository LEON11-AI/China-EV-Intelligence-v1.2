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
 * @param dateString - ISO格式的日期字符串 (如: "2024-01-15T10:00:00Z")
 * @returns 格式化后的日期字符串 (如: "2024-01-15")
 */
export function formatDateToSimple(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
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
 * @param dateString - 日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDateSmart(dateString: string): string {
  if (!dateString) return '';
  
  // 如果已经是简单格式 (YYYY-MM-DD 或 YYYY-M-D)，检查是否需要标准化
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) {
    // 对于简单格式，统一转换为标准的 YYYY-MM-DD 格式
    return formatDateToSimple(dateString);
  }
  
  // 如果是ISO格式或其他复杂格式，转换为简洁格式
  return formatDateToSimple(dateString);
}