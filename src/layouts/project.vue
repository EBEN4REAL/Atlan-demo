<template>
    <router-view />
    <!-- <div class="mx-auto mt-5" @click="themeToggle">[Default Layout]</div> -->
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import PageLoader from '@common/loaders/page.vue';
    import KeycloakMixin from '~/mixins/keycloak';
    import UserPersonalAvatar from '~/components/common/avatar/me.vue';

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            PageLoader,
            UserPersonalAvatar,
        },
        mixins: [KeycloakMixin],
        props: {},
        data() {
            return {};
        },
        computed: {},
        mounted() {},
        methods: {
            handleNewPage() {
                this.$router.push('/connections');
            },
        },

        // mixins: [KeycloakMixin],
        // const getDarkTheme = () => import("~/styles/dark.less");
        // const getLightTheme = () => import("~/styles/light.less");

        //   function themeToggle() {
        //     const htmlTag = document.querySelector("html");
        //     if (htmlTag.classList.contains("dark")) {
        //       htmlTag.className = "light";
        //     } else {
        //       htmlTag.className = "dark";
        //     }

        //     getCurrentTheme().forEach((element: string) => {
        //       if (element === "dark") {
        //         getDarkTheme();
        //       } else {
        //         getLightTheme();
        //       }
        //     });
        //   };

        // const getCurrentTheme = function (): any {
        //   const htmlTag = document.querySelector("html");
        //   return htmlTag?.classList;
        // };
    });
</script>

<style lang="less" module>
    // .sidebarMenu {
    //   @apply mt-3 !important;
    //   width: 48px !important;
    //   border: 0px !important;
    //   background: transparent !important;

    //   &:global(.ant-menu-inline-collapsed) {
    //     :global(.ant-menu-item) {
    //       @apply text-primary-light mb-3 rounded-lg ease-in transition-colors text-center text-xl leading-6 !important;
    //       padding: 8px 0px !important;
    //       margin-left: 6px !important;

    //       margin-right: 6px !important;
    //       height: inherit !important;

    //       &:global(.ant-menu-item-selected) {
    //         @apply bg-gray-100 text-primary !important;
    //       }
    //     }
    //   }
    // }
</style>
