<template>
    <div class="px-5">
        <a-button
            block
            class="flex items-center justify-between px-2 shadow-none"
            @click="showReadmeModal"
            ><div class="flex items-center">Readme of {{ title(asset) }}</div>
            <AtlanIcon icon="External" />
        </a-button>
    </div>

    <a-modal
        v-model:visible="readmeVisible"
        :footer="null"
        :closable="false"
        :destroy-on-close="true"
        width="1000px"
    >
        <div
            v-if="isReadmeLoading"
            class="flex items-center justify-center w-full"
            style="height: 155px"
        >
            <AtlanLoader class="h-9" />
        </div>
        <ReadmeContent v-else :readme-asset="readmeAsset" />
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'
    import ReadmeContent from './readmeContent.vue'

    export default defineComponent({
        components: { ReadmeContent },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
        },

        setup(props) {
            const { asset } = toRefs(props)

            const { title } = useAssetInfo()

            const readmeAttribute = ref(['readme'])

            const {
                asset: readmeAsset,
                mutate: mutateReadme,
                isReady: isReadmeReady,
                isLoading: isReadmeLoading,
            } = useAssetAttributes({
                id: asset.value?.guid,
                attributes: readmeAttribute,
            })

            const readmeVisible = ref<boolean>(false)

            const showReadmeModal = () => {
                mutateReadme()
                readmeVisible.value = true
            }

            return {
                title,
                showReadmeModal,
                readmeVisible,
                readmeAsset,

                isReadmeLoading,
            }
        },
    })
</script>
