<template>
    <div class="flex flex-col w-7/12 border-r">
        <div class="w-full pb-5 border-b">
            <div
                v-for="(
                    feature, insightFeatureIndex
                ) in featureList.insightsFeatures"
                :key="feature.key"
                class="grid pb-4 gap-y-5 hover:bg-gray-100"
                @mouseenter="$emit('setFeaturePreview', feature)"
                @mouseleave="$emit('setFeaturePreview')"
            >
                <div
                    class="flex flex-col p-5 last:pb-0 lab-card"
                    :class="{
                        disabled: feature.dependantFeatureKey
                            ? !featureEnabledMap[feature.dependantFeatureKey]
                            : false,
                    }"
                >
                    <div class="flex items-center justify-between gap-y-8">
                        <div class="flex flex-row items-center">
                            <div
                                v-if="!insightFeatureIndex"
                                class="flex flex-col items-center w-6 h-6 mr-3 overflow-hidden rounded"
                                :style="{ backgroundColor: '#FEF7E4' }"
                            >
                                <AtlanIcon icon="InsightsIcon" class="h-6" />
                            </div>
                            <span
                                class="text-base font-normal"
                                :class="{ 'font-bold': !insightFeatureIndex }"
                                >{{ feature.name }}</span
                            >
                        </div>

                        <a-switch
                            :checked="featureEnabledMap[feature.key]"
                            :disabled="updateStatus === 'loading'"
                            :loading="
                                updateStatus === 'loading' &&
                                processingPreference === feature.key
                            "
                            @click="triggerSwitch(feature)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full pb-5">
            <div class="flex flex-row items-center p-5 pt-8 pb-3">
                <div
                    class="flex flex-col items-center p-1.5 mr-3 overflow-hidden rounded"
                    :style="{ backgroundColor: '#F0FFFC' }"
                >
                    <AtlanIcon icon="FlaskIcon" />
                </div>
                <span class="text-base font-bold">Beta Features</span>
            </div>

            <div
                v-for="feature in featureList.betaFeatures"
                :key="feature.key"
                class="grid pb-4 gap-y-5 hover:bg-gray-100"
                @mouseenter="$emit('setFeaturePreview', feature)"
                @mouseleave="$emit('setFeaturePreview')"
            >
                <div
                    class="flex flex-col p-5 last:pb-0 lab-card"
                    :class="{
                        disabled: feature.dependantFeatureKey
                            ? !featureEnabledMap[feature.dependantFeatureKey]
                            : false,
                    }"
                >
                    <div class="flex items-center justify-between gap-y-8">
                        <div class="flex flex-row items-center">
                            <span class="text-base font-normal">{{
                                feature.name
                            }}</span>
                        </div>

                        <a-switch
                            :checked="featureEnabledMap[feature.key]"
                            :disabled="updateStatus === 'loading'"
                            :loading="
                                updateStatus === 'loading' &&
                                processingPreference === feature.key
                            "
                            @click="triggerSwitch(feature)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'

    export default defineComponent({
        name: 'PreferenceList',

        props: {
            featureList: {
                type: Object,
                required: true,
            },
            featureEnabledMap: {
                type: Array,
                required: true,
            },
            updateStatus: {
                type: String,
                required: true,
            },
        },
        emits: ['handleSwitch', 'setFeaturePreview'],

        setup(props, { emit }) {
            const processingPreference = ref('')

            const triggerSwitch = (feature) => {
                processingPreference.value = feature.key
                emit('handleSwitch', feature)
            }

            watch(
                () => props.updateStatus,
                (val) => {
                    if (val !== 'loading') {
                        processingPreference.value = ''
                    }
                }
            )

            return {
                processingPreference,
                triggerSwitch,
            }
        },
    })
</script>

<style scoped>
    .disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
        touch-action: none;
    }
</style>
