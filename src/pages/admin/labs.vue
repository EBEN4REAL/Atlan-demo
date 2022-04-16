<template>
    <main class="mx-4 space-y-8 my-9">
        <h1 class="text-3xl">Labs</h1>
        <div class="grid w-full p-5 border gap-y-5">
            <div
                v-for="feature in featureList"
                :key="feature.key"
                class="flex flex-col pb-5 border-b last:border-b-0 last:pb-0"
            >
                <div class="flex justify-between gap-y-8">
                    <div class="flex flex-col">
                        <div class="flex">
                            <span class="text-base font-bold text-primary">{{
                                feature.name
                            }}</span>
                            <div
                                v-if="feature.isBeta"
                                class="flex items-center px-2 ml-2 rounded-full bg-success-muted border-success"
                            >
                                Beta
                            </div>
                            <div class=""></div>
                        </div>
                        <span>{{ feature.description }}</span>
                    </div>
                    <a-switch
                        :checked="feature.defaultValue"
                        :disabled="isLoading"
                        :loading="isLoading"
                        @click="handleSwitch(feature)"
                    />
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { featureList } from '~/composables/labs/labFeatureList'

    export default defineComponent({
        name: 'AdminLabs',
        components: {},
        setup() {
            const handleSwitch = (feature) => {}
            return { featureList, handleSwitch }
        },
    })
</script>

<style scoped></style>
