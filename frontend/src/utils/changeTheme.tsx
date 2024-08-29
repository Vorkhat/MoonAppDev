'use client'

export const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
};

export const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

export const loadTheme = () => {
    const savedTheme: string | null = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {

        const defaultTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(defaultTheme);
    }
};
