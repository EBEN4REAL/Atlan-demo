
<p align='center'>
  <img src='https://atlan.com/assets/img/atlan-blue.6ed81a56.svg' alt='Vitesse - Opinionated Vite Starter Template' width='200'/>
</p>

<p align='center'>
Frontend SPA for Atlan
</p>



## Behind the Scenes

- ⚡️ [Vue 3](https://v3.vuejs.org/), [Vite 2](https://github.com/vitejs/vite), [pnpm](https://pnpm.js.org/)

- 🗂 [File based routing](./src/pages)

- 📑 [Layout system](./src/layouts)

- 🎨 [Tailwind CSS](https://tailwindcss.com/) - next generation utility-first CSS framework

- 😃 [Use icons from any icon sets, with no compromise](./src/components)

- 🌍 [I18n ready](./locales)

- 🔥 Use the [new `<script setup>` style](https://github.com/vuejs/rfcs/pull/227)

- 🦾 TypeScript


## Pre-packed

### UI Frameworks

- [Ant Design Vue 2](https://2x.antdv.com/) 

### Icons

- [Font Awesome Pro](https://fontawesome.com/pro)

### Vite Plugins

- [Vue Router](https://github.com/vuejs/vue-router)
  - [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages) - file system based routing
  - [`vite-plugin-vue-layouts`](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) - layouts for pages
- [`vite-plugin-pwa`](https://github.com/antfu/vite-plugin-pwa) - PWA
- [Vue I18n](https://github.com/intlify/vue-i18n-next) - Internationalization
  - [`vite-plugin-vue-i18n`](https://github.com/intlify/vite-plugin-vue-i18n) - Vite plugin for Vue I18n
- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs
- [`@vueuse/head`](https://github.com/vueuse/head) - manipulate document head reactively

### Coding Style

- Use Composition API with [`<script setup>` SFC syntax](https://github.com/vuejs/rfcs/pull/227)

### Dev tools

- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.js.org/) - fast, disk space efficient package manager
- [VS Code Extensions](./.vscode/extensions.json)


## Usage

### Development

Just run and visit http://localhost:3333

```bash
pnpm dev
```

### Build

To build the App, run

```bash
pnpm build
```

to preview the PWA service worker use (you can also use `pnpm preview`):

```bash
pnpm preview-https
```

And you will see the generated file in `dist` that ready to be served.