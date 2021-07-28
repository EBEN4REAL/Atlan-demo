/*
  Ant Design variables override file. This files is being used by Vite config -> LESS preprocessor
  Default variable list https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
*/

import themeColors from "./theme/atlan_theme.js";

const getAntDesignVariables = {
  "primary-color": themeColors.primary["DEFAULT"],
  "link-color": themeColors.primary["DEFAULT"],
  "heading-color": themeColors.gray["DEFAULT"],
  "text-color": themeColors.gray["DEFAULT"],
  //Table
  "table-header-bg": themeColors.gray[100],
  "table-row-hover-bg": themeColors.primary["muted"],
  "table-padding-horizontal": "1rem",
  "table-padding-vertical": "0.5rem",
  //  overriding table border from antd.less, overriding color from here is not working. 👇
  // "table-border-color": "#ff751f",
  // "table-border-radius-base": "0.7rem",
  //Drawer
  "drawer-body-padding": 0,
};

export default getAntDesignVariables;
