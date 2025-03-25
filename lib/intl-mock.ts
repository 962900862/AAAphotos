/**
 * 临时替代di18n-react的实现
 * 这是为了解决React版本兼容性问题
 */

interface IntlParams {
  [key: string]: string | number | undefined;
}

export const intl = {
  t: (message: string, params?: IntlParams): string => {
    // 简单替换参数
    if (params) {
      let result = message;
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
          const regex = new RegExp(`{${key}}`, 'g');
          result = result.replace(regex, String(params[key]));
        }
      });
      return result;
    }
    return message;
  }
}; 