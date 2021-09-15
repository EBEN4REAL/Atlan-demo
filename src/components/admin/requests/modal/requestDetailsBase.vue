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

        <div class="flex flex-col h-64 overflow-y-auto gap-y-6 max-h-64">
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

            <TermDetails
                v-if="request.re === 'create_term'"
                :data="request.payload"
            />

            <TermDetails
                v-if="request.re === 'term_link'"
                :data="request.sourceEntity.attributes"
            />

            <div v-if="request.message">
                <p class="mb-1 text-sm text-gray-500">Requestor Note</p>
                <span class="text-gray">{{ request.message }}</span>
            </div>

            <p class="mt-auto mb-0 text-gray-500">
                Requested {{ createdTimeAgo }} by
                <UserPiece :user="request.createdByUser" :is-pill="false" /> •
                {{ createdDate }}
            </p>
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
    import { useTimeAgo } from '@vueuse/core'
    import {
        attributeCopyMapping,
        typeCopyMapping,
        requestTypeIcon,
    } from '../requestType'
    import AtlanButton from '@/UI/button.vue'
    import RequestActions from '../requestActions.vue'
    import AssetDetails from './assetDetails.vue'
    import ClassificationDetails from './classificationDetails.vue'
    import TermDetails from './termDetails.vue'
    import AttributeChange from './attributeChange.vue'

    import UserPiece from '../pieces/user.vue'

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
            TermDetails,
            UserPiece,
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

            const createdTimeAgo = useTimeAgo(request.value.created_at)
            const createdDate = computed(() =>
                new Date(request.value.created_at).toLocaleDateString()
            )

            return {
                requestTitle,
                requestTypeIcon,
                createdTimeAgo,
                createdDate,
            }
        },
    })
</script>
