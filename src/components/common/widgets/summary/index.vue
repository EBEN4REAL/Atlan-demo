<template>
    <div class="p-4 bg-white rounded">
        <div class="flex items-center mb-4">
            <AtlanIcon icon="TableSummary" class="w-auto h-8 mr-3" /><span
                class="text-base font-bold text-gray"
                >{{ getSummaryVariants(asset)?.label }} Summary</span
            >
        </div>
        <div class="flex flex-col gap-y-10">
            <div class="flex flex-col gap-y-3">
                <div class="flex gap-x-16">
                    <div
                        v-for="(component, index) in getSummaryVariants(asset)
                            ?.components"
                        :key="index"
                    >
                        <component :is="component" :asset="asset"></component>
                    </div>
                </div>
                <div>
                    <div class="flex flex-col">
                        <p class="mb-1 text-sm text-gray-500">Description</p>
                        <Description
                            ref="descriptionRef"
                            v-model="localDescription"
                            @change="handleChangeDescription"
                            :selected-asset="asset"
                        />
                    </div>
                </div>
                <div class="flex gap-x-32">
                    <div ref="animationPoint" class="flex flex-col">
                        <p class="mb-1 text-sm text-gray-500">Certificate</p>

                        <Certificate
                            v-model="localCertificate"
                            :selected-asset="asset"
                            @change="handleChangeCertificate"
                        />
                    </div>

                    <div v-if="asset.guid" class="flex flex-col">
                        <p class="mb-1 text-sm text-gray-500">Owners</p>
                        <Owners
                            v-model="localOwners"
                            :used-for-assets="true"
                            @change="handleOwnersChange"
                            :selected-asset="asset"
                        />
                    </div>
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        defineAsyncComponent,
    } from 'vue'

    // Components
    import Description from '@/common/input/description/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            Description,
            Certificate,
            Owners,
            Rows: defineAsyncComponent(() => import('./types/rows.vue')),
            Columns: defineAsyncComponent(() => import('./types/columns.vue')),
            Definition: defineAsyncComponent(
                () => import('./types/definition.vue')
            ),
            TermsCount: defineAsyncComponent(
                () => import('./types/termsCount.vue')
            ),
            CategoriesCount: defineAsyncComponent(
                () => import('./types/categoriesCount.vue')
            ),
            ParentGlossary: defineAsyncComponent(
                () => import('./types/parentGlossary.vue')
            ),
        },

        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)

            const { getSummaryVariants } = useAssetInfo()

            const {
                isLoading,
                localDescription,
                localCertificate,
                localOwners,
                handleChangeDescription,
                handleOwnersChange,
                handleChangeCertificate,
                descriptionRef,
                animationPoint,
            } = updateAssetAttributes(asset)

            return {
                isLoading,
                localDescription,
                handleChangeDescription,
                localOwners,
                handleOwnersChange,
                localCertificate,
                handleChangeCertificate,
                getSummaryVariants,
                descriptionRef,
                animationPoint,
            }
        },
    })
</script>
