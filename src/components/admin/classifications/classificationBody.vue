<template>
    <div class="">
        <div class="flex w-full">
            <a-tabs v-model:activeKey="activeTabKey" class="w-full">
                <a-tab-pane key="1" tab="Linked Assets">
                    <div class="w-full rounded asset-list">
                        <AssetsWrapper
                            v-if="selectedClassification?.name"
                            :ref="
                                (el) => {
                                    assetWrapperRef = el
                                }
                            "
                            :selected-classification="
                                selectedClassification?.name
                            "
                        />
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Linked Terms">
                    <div class="w-full mt-1 rounded asset-list">
                        <LinkedTerms
                            :selected-classification="
                                selectedClassification?.name
                            "
                        />
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, Ref, watch } from 'vue'
    import AssetsWrapper from '@common/assets/index.vue'
    import { Components } from '~/api/atlas/client'
    import LinkedTerms from './LinkedTerms.vue'
    import { classificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationHeader',
        components: {
            AssetsWrapper,
            LinkedTerms,
        },
        props: {
            classification: {
                type: Object as PropType<classificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const assetSearchText = ref('')
            const assetWrapperRef: Ref<any> = ref(null)
            const selectedClassification = computed(() => props.classification)
            const handleAssetSearch = (e: any) => {
                assetSearchText.value = e.target.value
            }
            const activeTabKey = ref('1')
            watch(selectedClassification, () => {
                if (selectedClassification.value) {
                    const criterion: Components.Schemas.FilterCriteria[] = []
                    const entityFilterPayload = [
                        {
                            condition: 'OR',
                            criterion,
                        } as Components.Schemas.FilterCriteria,
                    ]
                    criterion.push({
                        attributeName: '__classificationNames',
                        attributeValue: selectedClassification.value.name,
                        operator: 'eq',
                    })
                    criterion.push({
                        attributeName: '__propagatedClassificationNames',
                        attributeValue: selectedClassification.value.name,
                        operator: 'eq',
                    })

                    assetWrapperRef.value?.updateBody(entityFilterPayload)
                }
            })
            return {
                assetWrapperRef,
                selectedClassification,
                activeTabKey,
                assetSearchText,
                handleAssetSearch,
            }
        },
    })
</script>
<style lang="less" scoped>
    .three-dots {
        height: fit-content;
        cursor: pointer;
    }
    .search-input {
        max-width: 30%;
    }
    .linked-btn-active {
        background-color: #e9eefa;
        color: #2251cc;
    }
    .asset-list {
        height: calc(100vh - 23rem);
    }
</style>
