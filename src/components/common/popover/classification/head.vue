<template>
    <div
        class="w-full px-4 py-3 border-b border-gray-300 bg-gray-100"
        style="min-width: 374px"
    >
        <div
            v-if="isLoading"
            class="flex justify-center items-center content-center"
        >
            <AtlanLoader class="h-10 animate-spin" />
        </div>
        <div v-else class="flex w-full align-center items-center">
            <ClassificationIcon
                :classification="classification"
                :entity-guid="guid"
                :class-names="'h-6'"
                :linked-by="
                    linkedUser.hasOwnProperty('username')
                        ? linkedUser.username
                        : ''
                "
            />
            <p
                class="text-lg font-gray-700 font-bold max-w-xs truncate mr-1 ml-2"
            >
                {{ classification.displayName }}
            </p>
            <a-button
                class="px-1.5 py-1 ml-auto"
                @click="$emit('togglePreview')"
            >
                <AtlanIcon icon="SidebarSwitch" style="height: auto" />
            </a-button>
        </div>
        <div
            v-if="!isPropagated && Object.keys(linkedUser).length > 0"
            class="flex gap-1 mt-1.5 text-sm content-center items-center flex-wrap break-all"
        >
            <span class="text-gray-500">Linked by</span>
            <UserAvatar :username="linkedUser.username" />
            <span class="text-gray-700">{{ linkedUser.name }}</span>
            <span class="text-gray-500">{{ linkedAt }}</span>
        </div>
        <div
            v-else-if="isPropagated && Object.keys(propagatedVia).length > 0"
            class="flex gap-1 mt-1.5 text-sm content-center items-center text-gray-500 flex-wrap break-all"
        >
            Propagated via <AtlanIcon :icon="propagatedViaIcon" />
            <span class="text-gray-700">{{ propagatedVia.displayText }}</span>
            {{ linkedAt }}
        </div>
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import { computed, defineComponent, PropType, ref } from 'vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import ClassificationIcon from '@/common/icon/classificationIcon.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import UserAvatar from '@/common/avatar/user.vue'
    import { and } from '@vueuse/core'
    import { usePropagatedVia } from '~/composables/classification/usePropagatedVia'
    import { useLinkedBy } from '~/composables/classification/useLinkedBy'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'

    dayjs.extend(relativeTime)

    export default defineComponent({
        name: 'ClassificationHead',
        components: {
            AtlanLoader,
            ClassificationIcon,
            AtlanIcon,
            UserAvatar,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
            entityGuid: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: ['togglePreview'],
        setup(props) {
            const classification = ref<ClassificationInterface>(
                props.classification
            )
            const guid = ref(props.entityGuid)

            const isPropagated = computed(() => {
                if (!guid.value || guid.value.length === 0) {
                    return false
                }
                return guid.value !== classification.value.entityGuid
            })

            const {
                linkedBy: linkedUser,
                linkedAt,
                isLoading: isAuditLoading,
            } = useLinkedBy(classification, isPropagated)

            const {
                isLoading: isAssetLoading,
                propagatedVia,
                propagatedViaIcon,
            } = usePropagatedVia(classification)

            const isLoading = and(isAuditLoading, isAssetLoading)

            return {
                linkedUser,
                linkedAt,
                isPropagated,
                guid,
                propagatedVia,
                propagatedViaIcon,
                isLoading,
            }
        },
    })
</script>
