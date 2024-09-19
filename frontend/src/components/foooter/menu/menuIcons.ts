import HomeIcon from '../images/home.svg';
import ProfileIcon from '../images/profile.svg';
import RatingIcon from '../images/rating.svg';
import QuizIcon from '../images/quiz.svg';
import TasksIcon from '../images/tasks.svg';

export type Icon = { src: unknown } & any;

export type Icons = {
    Home: Icon;
    Profile: Icon;
    Rating: Icon;
    Quiz: Icon;
    Tasks: Icon;
};


export const MenuIconMapper: Icons = {
    Home: HomeIcon,
    Profile: ProfileIcon,
    Rating: RatingIcon,
    Quiz: QuizIcon,
    Tasks: TasksIcon,
};