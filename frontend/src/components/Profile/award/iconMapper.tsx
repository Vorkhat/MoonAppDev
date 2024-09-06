import { TaskType } from '@prisma/client';
import ImageComments from '../../../../public/images/profile/comments.svg';
import ImageInvite from '../../../../public/images/profile/friends.svg';
import ImageGame from '../../../../public/images/profile/active.svg';
import ImageTask from '../../../../public/images/profile/tasks.svg';

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