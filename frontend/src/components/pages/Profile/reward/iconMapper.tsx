import { TaskType } from '@prisma/client';
import ImageComments from '@/app/(content)/profile/images/comments.svg';
import ImageInvite from '@/app/(content)/profile/images/friends.svg';
import ImageGame from '@/app/(content)/profile/images/active.svg';
import ImageTask from '@/app/(content)/profile/images/tasks.svg';

export function mapToIcon(type: TaskType) {
    switch (type) {
        case TaskType.Comment:
            return ImageComments;
        case TaskType.Invite:
            return ImageInvite;
        case TaskType.Game:
            return ImageGame;
        case TaskType.Task:
            return ImageTask;
    }
}