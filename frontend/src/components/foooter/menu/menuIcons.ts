import HomeIcon from '../images/home.svg';
import ProfileIcon from '../images/profile.svg';
import RatingIcon from '../images/rating.svg';
import QuizIcon from '../images/quiz.svg';
import TasksIcon from '../images/tasks.svg';

export type Icons = {
    Home: object;
    Profile: object;
    Rating: object;
    Quiz: object;
    Tasks: object;
};


export const MenuIconMapper: Icons = {
    Home: HomeIcon,
    Profile: ProfileIcon,
    Rating: RatingIcon,
    Quiz: QuizIcon,
    Tasks: TasksIcon,
};