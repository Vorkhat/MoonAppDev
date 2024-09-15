import { getRequestConfig } from 'next-intl/server';
import { getCurrentSessionLanguage } from '@/locale/locale';

export default getRequestConfig(async () => {
    const locale = await getCurrentSessionLanguage();
    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    };
});