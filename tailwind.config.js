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
                    DEFAULT: '#5277D7',
                    focus: '#BDCDF4',
                    light: '#F4F6FD',
                },
                body: '#fff',
                gray: {
                    DEFAULT: '#3E4359',
                    light: '#F3F3F3',
                    500: '#6F7590',
                    300: '#E6E6EB',
                    100: '#FAFAFA',
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
                secondary: {
                    DEFAULT: '#AC52D7',
                    light: '#F9F4FD',
                },
            },
        },
    },
    variants: {
        extend: {
            animation: ['motion-safe'],
            borderWidth: ['last'],
            fontWeight: ['hover'],
            borderColor: ['hover', 'focus'],
            display: ['group-hover'],
            textColor: ['group-focus'],
            fill: ['group-hover'],
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/typography'),
    ],
}
