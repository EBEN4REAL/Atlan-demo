<template>
    <div class="grid h-full grid-cols-6 mx-auto" style="max-width: 1100px">
        <div class="flex flex-col col-span-4 pb-6">
            <div class="flex items-center h-24 col-span-6 gap-4 pl-9">
                <AtlanIcon class="h-8" :icon="getIcon()" />
                <span class="text-lg"
                    >{{ getGreet() }}, {{ getNameInTitleCase(name) }}!</span
                >
            </div>
            <div class="flex flex-col col-span-4 px-9">
                <div class="">
                    <SearchAndStats />
                    <Announcements class="mt-6" />
                </div>

                <div class="mt-6">
                    <Persona></Persona>
                </div>
                <div class="mt-6">
                    <Purpose></Purpose>
                </div>
                <div class="mt-6">
                    <Relevant />
                </div>

                <!--section>
                <YourOrgs />
            </section-->
            </div>
        </div>
        <aside
            class="flex flex-col w-48 col-span-2 mt-8 mb-24 ml-8 xl:w-64 gap-y-12 lg:w-56"
        >
            <section>
                <YourWorkspace />
            </section>
            <!-- TODO: Hidden for paytm rollout, will enable it back -->
            <section>
                <h2 class="mb-3 text-xl font-bold">Helpful links</h2>
                <a :href="documentationLink" target="_blank">
                    <div
                        class="flex items-center p-2 mb-1 cursor-pointer span-2 gap-x-5 group hover:shadow hover:border-1"
                    >
                        <AtlanIcon class="h-9" icon="AtlanIcon" />
                        <span class="flex flex-col text-gray-700">
                            <div class="flex items-center text-base">
                                Atlan Documentation
                                <AtlanIcon
                                    icon="External"
                                    class="mb-1 ml-2 opacity-0 text-primary group-hover:opacity-100"
                                />
                            </div>
                        </span>
                    </div>
                </a>

                <div
                    class="relative flex items-center w-full p-2 mb-1 cursor-pointer span-2 gap-x-5 group hover:shadow hover:border-1"
                    @click="toggleHelpWidget"
                >
                    <AtlanIcon class="h-9" icon="CallIcon" />
                    <span class="flex flex-col text-gray-700">
                        <div class="text-base">
                            Support
                            <AtlanIcon
                                class="absolute opacity-0 right-3 text-primary top-4 group-hover:opacity-100"
                                icon="ArrowRight"
                            />
                        </div>
                    </span>
                </div>

                <!-- <router-link to="//notion.so" target="_blank" replace>
                    <div
                        class="flex items-center p-2 cursor-pointer span-2 gap-x-5 group hover:shadow hover:border-1"
                    >
                        <AtlanIcon class="h-12" icon="FeedbackIcon" />
                        <span class="flex flex-col text-gray-700">
                            <h3 class="text-base">Share Feedback</h3>
                        </span>
                    </div>
                </router-link> -->
            </section>
        </aside>
    </div>
</template>

<script lang="ts">
    import { useHead } from '@vueuse/head'
    import { defineComponent, computed } from 'vue'
    import useUserData from '~/composables/user/useUserData'
    import { getNameInTitleCase } from '~/utils/string'
    import SearchAndStats from '@/home/main/searchAndStats.vue'
    import Announcements from '@/home/main/annoucement.vue'
    import Relevant from '@/home/main/relevant.vue'
    import Persona from '@/home/main/persona.vue'
    import Purpose from '@/home/main/purpose.vue'
    import YourOrgs from '@/home/main/YourOrgs.vue'
    import YourWorkspace from '@/home/aside/YourWorkspace.vue'
    import { helpCenterList } from '~/constant/navigation/helpCentre'
    import useHelpWidget from '~/composables/helpCenter/useHelpWidget'

    export default defineComponent({
        name: 'HomePage',
        components: {
            SearchAndStats,
            YourWorkspace,
            Announcements,
            Relevant,
            YourOrgs,
            Persona,
            Purpose,
        },
        props: {},
        setup() {
            const { name } = useUserData()
            const { toggleHelpWidget } = useHelpWidget()

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

            const documentationLink = computed(
                () =>
                    helpCenterList.find(
                        (listItem) => listItem.id === 'documentation'
                    )?.link ?? ''
            )
            return {
                getIcon,
                getGreet,
                name,
                getNameInTitleCase,
                documentationLink,
                toggleHelpWidget,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
