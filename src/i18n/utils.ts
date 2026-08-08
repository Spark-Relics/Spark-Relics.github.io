import { ui, defaultLang, type Language, languages } from './translations';

export function getLangFromUrl(url: URL): Language {
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  if (firstSegment in ui) {
    return firstSegment as Language;
  }
  return defaultLang;
}

export function useTranslations(lang: Language) {
  return function t(key: keyof (typeof ui)[typeof defaultLang], params?: Record<string, string | number>): string {
    const langDict = ui[lang] || ui[defaultLang];
    let text = langDict[key] || ui[defaultLang][key] || (key as string);
    
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    
    return text;
  };
}

// 动态构建各语言的路由前缀映射字典，未来新增语言时会自动根据 defaultLang 决定前缀
const langPrefixMap: Record<string, string> = Object.keys(languages).reduce((acc, langKey) => {
  const isDefault = langKey === defaultLang;
  acc[langKey] = isDefault ? '' : `/${langKey}`;
  return acc;
}, {} as Record<string, string>);

export function getLocalizedPath(currentUrl: URL, targetLang: Language, targetPath?: string): string {
  const path = targetPath || currentUrl.pathname;
  const segments = path.split('/').filter(Boolean);
  
  // 如果当前路径包含语言前缀，清理掉
  if (segments[0] in ui) {
    segments.shift();
  }
  
  const cleanPath = segments.join('/');
  const prefix = langPrefixMap[targetLang] || '';
  
  if (!cleanPath) {
    return prefix ? `${prefix}/` : '/';
  }
  
  return `${prefix}/${cleanPath}/`.replace(/\/+/g, '/');
}
