const basePath = '/images/theme/menu/{type}/';

export enum MenuIcon {
    HOME = `${basePath}home.svg`,
    QUIZ = `${basePath}quiz.svg`,
    TASKS = `${basePath}tasks.svg`,
    RATING = `${basePath}rating.svg`,
    PROFILE = `${basePath}profile.svg`
}

export enum MenuIconType {
    DEFAULT = 'light',
    ACTIVE = 'dark'
}

export function formatMenuIconPath(icon: MenuIcon, type: MenuIconType) {
    return icon.replace('{type}', type);
}