/*
  Ant Design variables override file. This files is being used by Vite config -> LESS preprocessor
  Default variable list https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
*/
let colors = {
  primary: {
    DEFAULT: "#2251cc",
    muted: "#e6edff",
    100: "#d2d4f6",
    200: "#a6a8ed",
    300: "#797de4",
    400: "#4d51db",
    500: "#2026d2",
    600: "#1a1ea8",
    700: "#13177e",
    800: "#0d0f54",
    900: "#06082a",
  },
  body: "#fff",

  gray: {
    DEFAULT: "#495057",
    light: "#ced4da",
    dark: "#28292a",
    100: "#f8f8fd",
    400: "#909ca7",
  },
  success: {
    DEFAULT: "#00a680",
    muted: "#c9f9ee",
  },
  error: {
    DEFAULT: "#dc2626",
    muted: "#f9dcd2",
  },
  alert: {
    DEFAULT: "#ffb119",
    muted: "#ffefd0",
  },
  warning: {
    DEFAULT: "#ff751f",
  },
  blueGray: {
    light: "#e8e8f8",
    DEFAULT: "#64748B",
  },
};
const getAntDesignVariables = {
  "primary-color": "#2026d2",
  "link-color": "#2026d2",
  "heading-color": "#595c97",
  "text-color": "#595c97",
  //Table
  "table-header-bg": colors.gray[100],
  "table-row-hover-bg": colors.primary["muted"],
  "table-padding-horizontal": "1rem",
  "table-padding-vertical": "0.5rem",
  //  overriding table border from antd.less, overriding color from here is not working. 👇
  // "table-border-color": "#ff751f",
  // "table-border-radius-base": "0.7rem",
};

export default getAntDesignVariables;
