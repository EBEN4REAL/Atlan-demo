/* eslint-disable import/no-duplicates */

import { ComponentCustomProperties } from 'vue';

declare interface Window {
    // extend the window
}

window.global = window;

// with vite-plugin-md, markdowns can be treat as Vue components
declare module '*.md' {
    import { ComponentOptions } from 'vue';

    const component: ComponentOptions;
    export default component;
}

// declare vue files as components
declare module '*.vue' {
    import { ComponentOptions } from 'vue';

    const component: ComponentOptions;
    export default component;
}
