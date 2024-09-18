import switcherThemeLight from './theme/switcherThemeLight.svg';
import switcherThemeDark from './theme/switcherThemeDark.svg'

export type Icons = {
    light: object;
    dark: object;
};


export const SwitcherIconMapper: Icons = {
    light: switcherThemeLight,
    dark: switcherThemeDark
};