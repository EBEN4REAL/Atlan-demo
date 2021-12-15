/*
  Ant Design variables override file. This files is being used by Vite config -> LESS preprocessor
  Default variable list https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
*/

import themeColors from './theme/atlan_theme.js'

const getAntDesignVariables = {
  'primary-color': themeColors.primary.DEFAULT,
  'link-color': themeColors.primary.DEFAULT,
  'error-color': themeColors.error.DEFAULT,
  'heading-color': themeColors.gray.DEFAULT,
  'text-color': themeColors.gray.DEFAULT,
  'font-family': 'Avenir, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji !important;',
  'border-radius-base': '4px',
  // Table
  'table-header-bg': themeColors.gray[100],
  'table-row-hover-bg': themeColors.primary.light,
  'table-padding-horizontal': '1rem',
  'table-padding-vertical': '0.5rem',
  // Progress
  'progress-default-color': themeColors.primary.DEFAULT,
  'progress-remaining-color': themeColors.primary.light,
  // Drawer
  'drawer-body-padding': 0,
  // Input
  'input-icon-color': themeColors.gray[500],
  'input-hover-border-color': themeColors.primary.focus,
  // Collapse
  '@collapse-header-padding': '.75rem !important'
}

export default getAntDesignVariables
