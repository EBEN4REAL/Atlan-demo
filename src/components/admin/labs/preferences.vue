<template>
    <div class="flex flex-col w-7/12 h-full overflow-y-scroll border-r">
        <div class="w-full p-3 border-b">
            <div
                v-for="(
                    feature, insightFeatureIndex
                ) in featureList.insightsFeatures"
                :key="feature.key"
                class="flex w-full flex-col items-center justify-center px-3 my-0.5 rounded h-11 hover:bg-gray-100"
                @mouseenter="$emit('setFeaturePreview', feature)"
                @mouseleave="$emit('setFeaturePreview')"
            >
                <div
                    class="flex flex-col w-full lab-card"
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
                                <AtlanIcon
                                    icon="InsightsIcon"
                                    class="w-8 h-8 -mt-1"
                                />
                            </div>
                            <span
                                class="text-sm font-normal"
                                :class="{
                                    'font-bold text-base': !insightFeatureIndex,
                                }"
                                >{{ feature.name }}</span
                            >
                        </div>

                        <a-switch
                            size="small"
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

        <div class="w-full p-3">
            <div class="flex flex-row items-center px-3 rounded h-11">
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
                class="flex flex-col items-center justify-center px-3 my-0.5 rounded h-11 hover:bg-gray-100"
                @mouseenter="$emit('setFeaturePreview', feature)"
                @mouseleave="$emit('setFeaturePreview')"
            >
                <div
                    class="flex flex-col w-full lab-card"
                    :class="{
                        disabled: feature.dependantFeatureKey
                            ? !featureEnabledMap[feature.dependantFeatureKey]
                            : false,
                    }"
                >
                    <div class="flex items-center justify-between w-full">
                        <div class="flex flex-row items-center">
                            <span class="text-sm font-normal">{{
                                feature.name
                            }}</span>
                        </div>

                        <a-switch
                            size="small"
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
