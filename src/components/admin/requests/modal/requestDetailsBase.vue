<template>
    <a-modal
        style="top: 5rem; right: 0px; margin-left: auto; margin-right: 4rem"
        :mask="false"
        :bodyStyle="{ padding: '20px' }"
    >
        <template #title>
            <div class="flex items-center">
                <AtlanIcon
                    class="mr-4 text-gray-500"
                    :icon="requestTypeIcon[request.re]"
                />
                <span class="text-lg leading-5">
                    {{ requestTitle }}
                </span>
            </div>
        </template>

        <div class="flex flex-col gap-y-6">
            <!-- TOP SECTION -->
            <AssetDetails
                v-if="request.destinationEntity"
                :asset="request.destinationEntity"
            />

            <!-- BOTTOM SECTION -->
            <AttributeChange
                :attribute="request.destination_attribute"
                :value="request.destination_value"
                v-if="request.re === 'attribute'"
            />

            <ClassificationDetails
                :typeName="request.payload.typeName"
                v-if="request.re === 'attach_classification'"
            />

            <ClassificationDetails
                :data="request.payload?.classificationDefs?.[0]"
                v-if="request.re === 'create_typedef'"
            />
        </div>

        <template #footer>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <AtlanButton
                        color="secondary"
                        @click.stop="$emit('up')"
                        padding="compact"
                        size="sm"
                        ><template #label
                            ><AtlanIcon icon="ChevronUp" />
                        </template>
                    </AtlanButton>
                    <AtlanButton
                        color="secondary"
                        @click.stop="$emit('down')"
                        padding="compact"
                        size="sm"
                        ><template #label
                            ><AtlanIcon icon="ChevronDown" />
                        </template>
                    </AtlanButton>
                </div>
                <RequestActions />
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import {
        attributeCopyMapping,
        typeCopyMapping,
        requestTypeIcon,
    } from '../requestType'
    import RequestActions from '../requestActions.vue'
    import AssetDetails from './assetDetails.vue'
    import ClassificationDetails from './classificationDetails.vue'
    import AttributeChange from './attributeChange.vue'
    import AtlanButton from '@/UI/button.vue'

    import { RequestAttributes } from '~/types/atlas/requests'
    import { AssetTypeList } from '~/constant/assetType'

    export default defineComponent({
        name: 'RequestDetails',
        components: {
            RequestActions,
            AssetDetails,
            AttributeChange,
            AtlanButton,
            ClassificationDetails,
        },
        props: {
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
        },
        emits: ['up', 'down'],
        setup(props) {
            const { request } = toRefs(props)
            const requestTitle = computed(() => {
                let title = `${typeCopyMapping[request.value.re]} `
                // Attribute change title
                if (['bm_attribute', 'attribute'].includes(request.value.re)) {
                    title += AssetTypeList.find(
                        (ast) => ast.id == request.value.entity_type
                    )?.label

                    title += ` ${
                        attributeCopyMapping[
                            request.value.destination_attribute
                        ]
                    }`
                }

                // Linking stuff to asset
                if (
                    ['term_link', 'attach_classification'].includes(
                        request.value.re
                    )
                ) {
                    title +=
                        'to ' +
                        AssetTypeList.find(
                            (ast) => ast.id == request.value.entity_type
                        )?.label
                }

                return title
            })

            return { requestTitle, requestTypeIcon }
        },
    })
</script>
