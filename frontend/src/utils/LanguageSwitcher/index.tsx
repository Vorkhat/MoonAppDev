import { prisma } from '@/prisma.ts';
import { getCurrentLanguage, getCurrentSessionLanguage, setCurrentSessionLanguage } from '@/locale/locale';
import { useSession } from '@/components/session';

export default async function LanguageSwitcher() {

    const language = getCurrentLanguage();

    async function saveLanguage() {
        'use server';

        const { userId } = await useSession();

        const newLanguage = await getCurrentSessionLanguage() === 'Ru' ? 'En' : 'Ru';

        await setCurrentSessionLanguage(newLanguage);

        await prisma.user.update({
            where: { id: userId },
            data: { language: newLanguage },
        });
    }

    return (
        <>
            <form style={{
                margin: '0 auto',
            }} action={saveLanguage}>
                <button type="submit" style={{
                    background: 'rgba(46, 42, 49, 0.24)',
                    border: '1px solid rgba(46, 42, 49, 0.24)',
                    color: '#FFFFFF',
                }} value={language}>
                    {language === 'Ru' ? 'EN' : 'RU'}
                </button>
            </form>
        </>
    );
}
