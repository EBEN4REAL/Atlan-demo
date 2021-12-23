<template>
    <div :key="statusId">
        <div v-if="!showChipStyleStatus" class="flex items-center align-middle">
            <span class="svg-icon">
                <component :is="icons" class="w-auto h-4 -mt-0.5" />
            </span>

            <p v-if="showLabel" class="mb-0 ml-1.5">{{ label }}</p>
        </div>

        <div v-else class="flex items-center">
            <div
                class="inline-flex items-center px-3 py-1 mr-3 text-sm text-gray-700 border border-opacity-0 rounded-full cursor-pointer hover:border-opacity-100 status-badge-margin"
            >
                <span v-if="iconId !== 'is_null'" class="mr-1.5 svg-icon">
                    <component :is="icons" class="w-auto h-4" />
                </span>

                <p v-if="showLabel" class="mb-0">{{ label }}</p>
            </div>
            <p
                v-if="showLabel && statusId && statusUpdatedBy"
                class="mt-1 mb-0 text-xs leading-none text-gray-700"
            >
                {{ timeAgo(statusUpdatedAt) }}
                by
                <span class="capitalize">{{ statusUpdatedBy }}</span>
            </p>
        </div>
        <p
            v-if="statusMessage"
            v-linkified
            class="mt-1 mb-0 text-sm text-gray"
            v-html="statusMessage"
        ></p>
    </div>
</template>

<script lang="ts">
    import { useTimeAgo } from '@vueuse/core'
    import { defineComponent, computed, toRefs } from 'vue'
    import { List } from '~/constant/status'
    import TermDeprecated from '~/assets/images/status/term-deprecated.svg'
    import TermVerified from '~/assets/images/status/term-verified.svg'
    import TermIssue from '~/assets/images/status/term-issue.svg'
    import TermWip from '~/assets/images/status/term-wip.svg'

    export default defineComponent({
        name: 'StatusBadge',
        props: {
            statusId: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            isTree: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            statusMessage: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            statusUpdatedBy: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            statusUpdatedAt: {
                required: false,
            },
            showLabel: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            showNoStatus: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            showChipStyleStatus: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['change'],
        setup(props) {
            const { statusId, showNoStatus, isTree } = toRefs(props)
            const statusObject = computed(() => {
                let found = List.find((item) => item.id === statusId.value)
                if (showNoStatus.value && !found) {
                    found = List.find((item) => item.id === 'is_null')
                }
                return found
            })
            const icon = computed(() => statusObject.value?.icon)
            const iconId = computed(() => statusObject.value?.id)
            const label = computed(() => statusObject.value?.label)

            const fileIcon = computed(() => {
                if (statusObject.value?.label === 'Verified') {
                    return TermVerified
                }
                if (statusObject.value?.label === 'Draft') {
                    return TermWip
                }
                if (statusObject.value?.label === 'Deprecated') {
                    return TermDeprecated
                }
                return TermIssue
            })

            // console.log('status data: ', { icon, iconId, label })
            const icons = isTree.value ? fileIcon : icon
            const timeAgo = (time: string | number) => useTimeAgo(time).value
            return { icon, label, timeAgo, iconId, icons }
        },
    })
</script>

<style lang="less" scoped>
    .status-badge-margin {
        margin-left: -12px;
    }
</style>
