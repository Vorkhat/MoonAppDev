import FriendsIcon from '@/app/(content)/tasks/images/friends.svg';
import PartnersIcon from '@/app/(content)/tasks/images/partners.svg';
import RepostIcon from '@/app/(content)/tasks/images/repost.svg';
import PhoneIcon from '@/app/(content)/tasks/images/phone.svg';
import WebIcon from '@/app/(content)/tasks/images/web.svg';
import InstagramIcon from '@/app/(content)/tasks/images/instagram.svg';
import DownloadIcon from '@/app/(content)/tasks/images/download.svg';

export type Icon = { src: unknown } & any;

export type Icons = {
    Friends: Icon;
    Partners: Icon;
    Repost: Icon;
    Phone: Icon;
    Web: Icon;
    Instagram: Icon;
    Download: Icon;
};


export const TasksIconMapper: Icons = {
    Friends: FriendsIcon,
    Partners: PartnersIcon,
    Repost: RepostIcon,
    Phone: PhoneIcon,
    Web: WebIcon,
    Instagram: InstagramIcon,
    Download: DownloadIcon,
};