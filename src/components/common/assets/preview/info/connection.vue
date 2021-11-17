<template>
    <div class="flex flex-col">
        <p
            class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
        >
            Category
        </p>
        <div class="px-5 uppercase">
            {{ attributes(selectedAsset)?.category }}
        </div>
    </div>

    <div class="flex flex-col">
        <p
            class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
        >
            SQL Query
        </p>

        <div class="px-5">
            <div class="flex flex-col p-4 border border-gray-200 rounded">
                <div class="flex items-center mb-3 gap-x-6">
                    <p class="flex items-center text-gray-500">
                        <AtlanIcon
                            icon="Approve"
                            class="mr-1"
                            v-if="attributes(selectedAsset)?.allowQuery"
                        ></AtlanIcon>
                        <AtlanIcon
                            icon="Decline"
                            class="mr-1"
                            v-else
                        ></AtlanIcon>
                        Query
                    </p>

                    <p class="flex items-center text-gray-500">
                        <AtlanIcon
                            icon="Approve"
                            class="mr-1"
                            v-if="attributes(selectedAsset)?.allowQueryPreview"
                        ></AtlanIcon>
                        <AtlanIcon
                            icon="Decline"
                            class="mr-1"
                            v-else
                        ></AtlanIcon>
                        Preview
                    </p>
                </div>

                <div class="flex items-center mb-3 gap-x-6">
                    <div class="flex flex-col">
                        <p
                            class="flex items-center justify-between mb-1 text-sm text-gray-500 "
                        >
                            Credential
                        </p>
                        <div class="uppercase">
                            {{ queryConfigJSON.credentialType }}
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <p
                            class="flex items-center justify-between mb-1 text-sm text-gray-500 "
                        >
                            Row Limit
                        </p>
                        <div class="uppercase">
                            {{ queryConfigJSON.rowLimit }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'ConnectionDetails',
        components: {
            AtlanIcon,
        },
        setup(props) {
            const selectedAsset = inject('selectedAsset')

            const { attributes } = useAssetInfo()

            const queryConfigJSON = computed(() => {
                if (attributes(selectedAsset.value)?.queryConfig) {
                    return JSON.parse(
                        attributes(selectedAsset.value)?.queryConfig
                    )
                }
                return {}
            })

            return { selectedAsset, attributes, queryConfigJSON }
        },
    })
</script>