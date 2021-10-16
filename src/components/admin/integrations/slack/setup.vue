<template>
    <div class="relative flex h-full bg-white rounded shadow slack-container">
        <div
            class="absolute top-0 left-0 w-full h-full  confetti-wrapper confetti-left"
        ></div>
        <div
            class="absolute top-0 left-0 w-full h-full  confetti-wrapper confetti-right"
        ></div>
        <div
            class="flex flex-col items-center justify-center w-full h-full p-8"
        >
            <span class="mb-6 text-2xl font-bold z-1"
                >Connect Atlan with Slack</span
            >
            <div class="flex justify-center mb-4 z-1">
                <div
                    v-for="(feature, index) in features"
                    :key="index"
                    class="flex flex-col items-center w-3/4 h-full p-3 pt-6 pb-4 mr-3 overflow-y-hidden border rounded  col-3"
                >
                    <span class="mb-2 mr-2 text-lg">
                        {{ feature.icon }}
                    </span>
                    <span class="text-center"> {{ feature.title }} </span>
                </div>
            </div>
            <a :href="''" target="_blank" class="z-1"
                ><img
                    alt="Add to Slack"
                    height="40"
                    width="139"
                    src="https://platform.slack-edge.com/img/add_to_slack.png"
                    srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
                    class="z-1"
            /></a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue'
import confetti1 from '~/assets/images/illustrations/confetti1.svg'
import confetti2 from '~/assets/images/illustrations/confetti1.svg'

interface Feature {
    title: string
    icon: string
}
export default defineComponent({
    name: 'SlackSetup',
    setup() {
        const features: Ref<Array<Feature>> = ref([])
        features.value = [
            // {
            //     title: 'Receive chat notifications directly into Slack',
            //     icon: '💬',
            // },
            {
                title: 'Share asset profile, terms, queries with your team',
                icon: '🚀',
            },
            // {
            //     title: 'Get updates whenever there are changes in a Term or Asset',
            //     icon: '🗂',
            // },
        ]

        return {
            features,
            confetti1,
            confetti2,
        }
    },
})
</script>

<style lang="less" scoped>
.slack-container {
    width: 90%;
    height: 90%;
}
.confetti-wrapper {
    background-repeat: no-repeat;
    background-size: 20%;
}
.confetti-left {
    background-image: url('../../../../assets/images/illustrations/confetti2.svg');
}
.confetti-right {
    background-position: 100% 0%;
    background-image: url('../../../../assets/images/illustrations/confetti1.svg');
}
</style>