<template>
    <div
        class="flex flex-col items-center flex-grow px-12 pt-20 pb-4 text-gray-800 bg-gray-100"
        :style="{
            width: '355px',
        }"
    >
        <h2 class="text-base text-center">
            {{
                feature.description ||
                'Preference preview will appear over here'
            }}
        </h2>

        <div class="flex flex-col w-full h-56 mt-10 preview-illustration">
            <div v-if="feature.key" class="preview-box">
                <img class="w-full h-full" :src="feature.illustration" alt="" />
            </div>

            <div v-else class="preview-box">
                <component :is="DefaultIllustration" class="w-full" />
            </div>
        </div>

        <div class="mt-auto text-sm text-center text-gray-500">
            💡 Hover on a preference to learn more
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import DefaultIllustration from '~/assets/images/illustrations/pref-preview-default.svg'
    // import InsightsIllustration from '~/assets/images/preference/Insights-workspace-toggle.gif'

    export default defineComponent({
        props: {
            feature: {
                type: Object,
                required: true,
            },
        },

        setup() {
            return {
                DefaultIllustration,
                // InsightsIllustration,
            }
        },

        methods: {},
    })
</script>

<style scoped>
    .preview-box {
        box-shadow: 0px 8px 24px rgba(25, 32, 56, 0.04);
        @apply flex flex-col items-center justify-center w-full h-full overflow-hidden bg-white rounded-md;
    }
</style>
