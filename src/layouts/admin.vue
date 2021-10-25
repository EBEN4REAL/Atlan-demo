<template>
    <a-layout class="min-h-full">
        <a-layout-header
            style="height: 32px; padding: 0 0px; line-height: 32px"
            class="shadow-sm"
        >
            <div
                class="flex items-center justify-between px-3 align-middle border-b shadow-sm "
            >
                <div class="flex items-center align-middle">
                    <img
                        src="https://atlan.com/assets/img/logo.40c9d1d3.svg"
                        class="w-auto h-3 mr-3"
                    />
                    <!-- <a-input
            style="min-width: 400px"
            placeholder="Click or Cmd/Ctrl+K"
            size="small"
            class="text-white placeholder-gray-300 bg-opacity-50 rounded bg-primary-light border-primary-focus"
          >
          </a-input> -->
                </div>
                <div></div>
                <div class="flex space-x-3 text-white">
                     
                    <fa icon="fal bell w-3"></fa>
                    <fa icon="fal gift"></fa>
                    <fa icon="fal question-circle"></fa>
                    <div class="text-center border-b border-primary-focus">
                        <UserPersonalAvatar></UserPersonalAvatar>
                    </div>
                </div>
            </div>
        </a-layout-header>

        <a-layout class="h-full">
            <a-layout-sider
                :collapsed="true"
                :collapsed-width="60"
                :class="$style.sidebar"
                :collapsible="false"
            >
                <div class="flex flex-col h-full">
                    <Sidebar class="flex-grow mt-2" />
                    <a-button
                        class="mx-1 mb-3"
                        size="large"
                        type="ghost"
                        @click="handleNewPage"
                    >
                        <fa icon="fal plug" class="text-white"></fa>
                    </a-button>
                </div>
            </a-layout-sider>
            <a-layout-content
                class="overflow-hidden"
                style="height: calc(100vh - 32px) !important"
            >
                <router-view class="flex-grow" />
            </a-layout-content>
        </a-layout>
    </a-layout>
    <!-- <div class="mx-auto mt-5" @click="themeToggle">[Default Layout]</div> -->
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import PageLoader from '@common/loaders/page.vue'

    import Sidebar from './sidebar/index.vue'
    import UserPersonalAvatar from '~/components/common/avatar/me.vue'

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            PageLoader,
            Sidebar,
            UserPersonalAvatar,
        },

        props: {},
        data() {
            return {}
        },
        computed: {},
        mounted() {},
        methods: {
            handleNewPage() {
                this.$router.push('/connections')
            },
        },
    })
</script>

<style lang="less" module></style>
