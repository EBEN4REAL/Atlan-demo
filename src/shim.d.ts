/* eslint-disable import/no-duplicates */

declare interface Window {
  // extend the window
}

window.global = window;

import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";

// with vite-plugin-md, markdowns can be treat as Vue components
declare module "*.md" {
  import { ComponentOptions } from "vue";
  const component: ComponentOptions;
  export default component;
}

// declare vue files as components
declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const component: ComponentOptions;
  export default component;
}

import { store } from "~/store";
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: store;
  }
}