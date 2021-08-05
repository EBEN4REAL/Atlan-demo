<template>
    <div class="w-full min-h-screen px-10 py-5 overflow-y-auto">
        <div class="flex justify-between">
            <p class="mb-0 text-2xl">Projects</p>
            <a-button type="primary" class="text-white rounded"
                >Create Project</a-button
            >
        </div>
        <div
            class="grid grid-flow-row gap-8 mt-8 xl:grid-cols-4 2xl:grid-cols-5"
        >
            <template v-for="project in dummyProjects" :key="project.id">
                <div
                    class="rounded shadow cursor-pointer hover:shadow-lg"
                    @click="onProjectClick"
                >
                    <div
                        class="mb-2 overflow-hidden rounded-t shadow  md:h-32 lg:h-36"
                    >
                        <img
                            src="https://picsum.photos/300/150"
                            class="w-full h-auto"
                            alt="Project Image"
                        />
                    </div>
                    <div class="p-4">
                        <p class="mb-2 text-lg text-gray-dark">
                            {{ project.projectName }}
                        </p>
                        <p class="mb-2 text-gray-400">
                            {{ project.description }}
                        </p>
                        <div class="flex justify-between mt-6">
                            <div>
                                <div class="flex items-center text-gray-dark">
                                    <template
                                        v-for="view in views"
                                        :key="view.id"
                                    >
                                        <img
                                            :src="view.src"
                                            alt="view"
                                            class="w-8 h-8 rounded-full view"
                                        />
                                    </template>
                                    +3 Others
                                </div>
                            </div>
                            <a-button
                                type="default"
                                class="flex items-center justify-center rounded"
                            >
                                <span
                                    class="flex items-center justify-center mr-2 "
                                >
                                    <fa icon="fal circle"></fa
                                ></span>
                                Active</a-button
                            >
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRouter } from 'vue-router'
    // import initalize from "~/utils/tracking";
    export default defineComponent({
        components: {},
        setup() {
            useHead({
                title: 'Project Home',
            })
            // initalize();
            const router = useRouter()
            const views = [
                { id: 1, src: 'https://picsum.photos/50/50' },
                { id: 2, src: 'https://picsum.photos/50/50' },
                { id: 3, src: 'https://picsum.photos/50/50' },
            ]
            const dummyProjects = [
                {
                    id: 1,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
                {
                    id: 2,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
                {
                    id: 3,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
                {
                    id: 4,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
                {
                    id: 5,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
            ]

            const onProjectClick = () => {
                // router.push(`/projects/${projectID}`);
                router.push(`/projects/project1`)
            }
            return {
                onProjectClick,
                dummyProjects,
                views,
            }
        },
    })
</script>

<style lang="less" scoped>
    .view {
        border: 3px solid white;
        margin-left: -8px;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
