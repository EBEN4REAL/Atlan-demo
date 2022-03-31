// tailwind.config.js

module.exports = {
    jit: true,
    important: true,
    purge: {
        content: [
            './index.html',
            './src/**/*.{vue,js,ts,jsx,tsx}',
            './safelist.txt',
            // etc.
        ],
    },
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Avenir'],
                serif: ['Avenir'],
                mono: ['Menlo'],
            },
            colors: {
                primary: {
                    DEFAULT: '#5277D7',
                    focus: '#BDCDF4',
                    light: '#F4F6FD',
                    menu: '#f0f7ff',
                    selected: {
                        focus: '#dbeafe',
                    },
                },
                body: '#fff',
                gray: {
                    DEFAULT: '#3E4359',
                    light: '#F3F3F3',
                    500: '#6F7590',
                    300: '#E6E6EB',
                    200: '#F3F3F3',
                    100: '#FAFAFA',
                },
                pink: {
                    light: '#FEF5F8',
                    default: '#F34D77',
                },
                success: {
                    DEFAULT: '#00a680',
                    muted: '#c9f9ee',
                },
                error: {
                    DEFAULT: '#DC5252',
                    muted: '#f9dcd2',
                },
                alert: {
                    DEFAULT: '#ffb119',
                    muted: '#ffefd0',
                },
                warning: {
                    DEFAULT: '#ff751f',
                    light: '#FFF8E5',
                },
                blueGray: {
                    light: '#e8e8f8',
                    DEFAULT: '#64748B',
                },
                secondary: {
                    DEFAULT: '#AC52D7',
                    light: '#F9F4FD',
                },
                purple: {
                    DEFAULT: '#6D6DDA',
                },
                new: {
                    gray: {
                        900: '#1b1f29',
                        800: '#34394b',
                        700: '#525c73',
                        600: '#6a7692',
                        300: '#e0e4eb',
                        200: '#eff1f5',
                        100: '#f6f7f9',
                    },
                    red: {
                        700: '#820000',
                        600: '#a50505',
                        500: '#bf1b1b',
                        400: '#cc4747',
                        300: '#e48a8a',
                        200: '#f1b6b6',
                        100: '#fff0f0',
                    },

                    green: {
                        700: '#047960',
                        600: '#069a7a',
                        500: '#00b28a',
                        400: '#47ccaf',
                        300: '#8ae4d1',
                        200: '#b6f1e4',
                        100: '#f0fffc',
                    },

                    blue: {
                        700: '#00379a',
                        600: '#0f46b8',
                        500: '#225bd2',
                        400: '#3c71df',
                        300: '#85a4e6',
                        200: '#c0d2fa',
                        100: '#f4f6fd',
                    },

                    yellow: {
                        700: '#9d6e05',
                        600: '#d9950d',
                        500: '#f7b43d',
                        400: '#ffca65',
                        300: '#fbda8a',
                        200: '#feeec7',
                        100: '#fef7e4',
                    },
                    white: '#fff',
                },
            },
            outline: {
                primary: ['1px solid #5277D7', '0px'],
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
            backgroundColor: ['group-hover'],
            fill: ['group-hover'],
            textDecoration: ['group-hover'],
            visibility: ['group-hover'],
            inset: ['group-hover'],
            transitionDuration: ['group-hover'],
            transitionDelay: ['group-hover'],
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/typography'),
        require('tailwind-safelist-generator')({
            patterns: [
                'col-{gridColumn}',
                'col-start-{gridColumnStart}',
                'col-end-{gridColumnEnd}',
            ],
        }),
    ],
}
