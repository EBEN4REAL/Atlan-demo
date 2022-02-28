<template>
    <a-button class="flex items-center justify-center">
        <SlackModal
            :link="assetLink"
            :asset-i-d="asset?.guid"
            :asset-type="asset?.typeName"
            :ask-question-modal="true"
            @success="onSlackModalSuccess"
        >
            <AtlanIcon icon="Slack" class="mb-0.5" />
        </SlackModal>
    </a-button>
</template>

<script setup lang="ts">
    import { PropType, toRefs } from 'vue'
    import useAskAQuestion, {
        onSlackModalSuccess,
    } from '~/composables/integrations/slack/useAskAQuestion'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SlackModal from '@/common/assets/misc/slackModal.vue'

    const props = defineProps({
        asset: {
            type: Object as PropType<assetInterface>,
            required: false,
            default() {
                return {}
            },
        },
    })

    const { asset } = toRefs(props)

    const { assetLink } = useAskAQuestion(asset)
</script>

<style scoped></style>
