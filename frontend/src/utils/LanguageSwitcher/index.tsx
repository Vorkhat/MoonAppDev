import { prisma } from '@/prisma.ts';
import { getCurrentSessionLanguage, setCurrentSessionLanguage } from '@/locale/locale';
import { useSession } from '@/components/session';

export default async function LanguageSwitcher() {

    const language = await getCurrentSessionLanguage();

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
            <form style={{ height: '48px', display: 'grid', alignItems: 'center' }} action={saveLanguage}>
                <button type="submit" style={{
                    background: 'rgba(46, 42, 49, 0.24)',
                    border: '1px solid rgba(46, 42, 49, 0.24)',
                    borderRadius: '8px',
                    padding: '4px',
                    color: '#FFFFFF',
                }} value={language}>
                    {language === 'Ru' ? 'EN' : 'RU'}
                </button>
            </form>
        </>
    );
}
