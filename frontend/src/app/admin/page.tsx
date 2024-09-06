'use server';

import styles from './page.module.scss';
import { prisma } from '@/prisma.ts';
import Image from 'next/image';
import { mapToIcon } from '@/components/Profile/award/iconMapper.tsx';
import Link from 'next/link';

export async function getTasks() {
    return prisma.task.findMany();
}

export default async function AdminPage() {
    const tasks = await getTasks();

    return (
        <div className={styles.admin}>
            <a className={'card'} href={'/admin/-1'}>
                Create
            </a>
            {tasks.map(task => (
                <Link className={'card'} key={task.id} href={`/admin/${task.id}`}>
                    <Image src={mapToIcon(task.type)} alt={task.type}/>
                    {task.type}
                </Link>
            ))}
        </div>
    );
}