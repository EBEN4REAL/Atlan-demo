// tailwind.config.js

module.exports = {
    jit: true,
    important: true,
    purge: {
        safeList: [],
        content: [
            './index.html',
            './src/**/*.{vue,js,ts,jsx,tsx}',
            // etc.
        ],
    },
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Avenir'],
                serif: ['Avenir'],
            },
            colors: {
                primary: {
                    DEFAULT: '#2251cc',
                    muted: '#e6edff',
                    light: '#F4F6FD',
                    100: '#d2d4f6',
                    200: '#a6a8ed',
                    300: '#797de4',
                    400: '#4d51db',
                    500: '#2026d2',
                    600: '#1a1ea8',
                    700: '#13177e',
                    800: '#0d0f54',
                    900: '#06082a',
                },
                body: '#fff',
                gray: {
                    DEFAULT: '#3E4359',
                    light: '#ced4da',
                    dark: '#28292a',
                    disabled: '#CED4DA',
                    medium: '#FAFAFA',
                    bg: '#E5E6EB',
                    description: '#6F7590',
                    100: '#f8f8fd',
                    400: '#909ca7',
                },
                success: {
                    DEFAULT: '#00a680',
                    muted: '#c9f9ee',
                },
                error: {
                    DEFAULT: '#dc2626',
                    muted: '#f9dcd2',
                },
                alert: {
                    DEFAULT: '#ffb119',
                    muted: '#ffefd0',
                },
                warning: {
                    DEFAULT: '#ff751f',
                },
                blueGray: {
                    light: '#e8e8f8',
                    DEFAULT: '#64748B',
                },
            },
        },
    },
    variants: {
        extend: {
            animation: ['motion-safe'],
            borderWidth: ['last'],
            borderColor: ['hover', 'focus'],
            display: ['group-hover'],
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/typography'),
    ],
}
