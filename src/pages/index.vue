<template>
    <div class="grid h-full max-w-5xl grid-cols-6 mx-auto">
        <section class="flex items-center h-24 col-span-6 gap-4">
            <AtlanIcon class="h-8" :icon="getIcon()" />
            <span class="text-lg"
                >{{ getGreet() }}, {{ getNameInTitleCase(name) }}!</span
            >
        </section>
        <main
            class="flex flex-col col-span-4 pb-16 mb-16 border-r pr-9 gap-y-14"
        >
            <section class="">
                <SearchAndStats />
            </section>
            <section class="">
                <Announcements />
            </section>
            <section>
                <Relevant />
            </section>
            <section>
                <YourOrgs />
            </section>
        </main>
        <aside class="flex flex-col w-64 mb-24 ml-8 gap-y-12">
            <section>
                <div class="">
                    <img
                        class="mb-3 rounded-lg"
                        src="https://images.unsplash.com/photo-1606937589177-0c6374bd88ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1651&q=80"
                        alt=""
                    />
                    <span class="text-sm text-gray-500"
                        >Pets of Atlan, Ginger and Lemon wish you a nice day!
                        🐾</span
                    >
                </div>
            </section>
            <section>
                <YourWorkspace />
            </section>
            <section>
                <h2 class="mb-3 text-xl font-bold">Helpful links</h2>
                <router-link to="//notion.so" target="_blank" replace>
                    <div
                        class="flex items-center p-2 mb-1 cursor-pointer span-2 gap-x-5 group hover:shadow hover:border-1"
                    >
                        <AtlanIcon class="h-12" icon="AtlanIcon" />
                        <span class="flex flex-col text-gray-700">
                            <h3 class="text-base">Atlan Documentation</h3>
                        </span>
                    </div>
                </router-link>
                <router-link to="//notion.so" target="_blank" replace>
                    <div
                        class="flex items-center p-2 mb-1 cursor-pointer span-2 gap-x-5 group hover:shadow hover:border-1"
                    >
                        <AtlanIcon class="h-12" icon="CallIcon" />
                        <span class="flex flex-col text-gray-700">
                            <h3 class="text-base">Customer Support</h3>
                        </span>
                    </div>
                </router-link>
                <router-link to="//notion.so" target="_blank" replace>
                    <div
                        class="flex items-center p-2 cursor-pointer span-2 gap-x-5 group hover:shadow hover:border-1"
                    >
                        <AtlanIcon class="h-12" icon="FeedbackIcon" />
                        <span class="flex flex-col text-gray-700">
                            <h3 class="text-base">Share Feedback</h3>
                        </span>
                    </div>
                </router-link>
            </section>
        </aside>
    </div>
</template>

<script lang="ts">
    import { useHead } from '@vueuse/head'
    import { defineComponent } from 'vue'
    import useUserData from '~/composables/user/useUserData'
    import { getNameInTitleCase } from '~/utils/string'
    import SearchAndStats from '@/home/main/searchAndStats.vue'
    import Announcements from '@/home/main/annoucement.vue'
    import Relevant from '@/home/main/relevant.vue'
    import YourOrgs from '@/home/main/YourOrgs.vue'
    import YourWorkspace from '@/home/aside/YourWorkspace.vue'

    export default defineComponent({
        name: 'HomePage',
        components: {
            SearchAndStats,
            YourWorkspace,
            Announcements,
            Relevant,
            YourOrgs,
        },
        props: {},
        setup() {
            const { name } = useUserData()

            useHead({
                title: `Welcome - ${getNameInTitleCase(name)} `,
            })

            const hour = new Date().getHours()

            const getIcon = () => {
                if (hour < 12) return 'MorningIcon'
                if (hour < 17) return 'AfternoonIcon'
                return 'EveningIcon'
            }
            const getGreet = () => {
                if (hour < 12) return 'Good Morning'
                if (hour < 17) return 'Good Afternoon'
                return 'Good Evening'
            }

            return {
                getIcon,
                getGreet,
                name,
                getNameInTitleCase,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
