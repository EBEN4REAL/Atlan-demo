<template>
    <div class="flex flex-col p-2 rounded" :class="statusClass">
        <div class="flex">
            <div class="flex items-center text-sm">
                <component
                    :is="icon"
                    class="inline-flex self-center w-auto h-4 mr-1 mb-0.5"
                />
                <span class="text-sm tracking-wide text-gray-700">{{
                    capitalizeFirstLetter(status?.toLowerCase())
                }}</span>
            </div>
        </div>
        <p
            :key="message"
            v-linkified="{ className: 'text-primary', target: '_blank' }"
            class="overflow-hidden text-sm overflow-ellipsis"
        >
            {{ message }}
        </p>

        <div class="flex items-center mt-1 text-gray-500" v-if="username">
            <div class="flex text-sm gap-x-1">
                <AtlanIcon icon="User"></AtlanIcon>
                <div class="mr-1">{{ username }}</div>
                <span v-if="timestamp">{{ timestamp }}</span>
            </div>
        </div>

        <div
            class="flex group-hover:text-white"
            @click="handleRemove"
            v-if="allowEdit"
        >
            <AtlanIcon icon="Edit" class="h-3 ml-1"></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, toRefs } from 'vue'
    import { certificateList } from '~/constant/certification'
    import { capitalizeFirstLetter } from '~/utils/string'

    export default {
        props: {
            username: {
                type: String,
                default: '',
            },
            status: {
                type: String,
                default: '',
            },
            message: {
                type: String,
                default: '',
            },

            timestamp: {
                default() {
                    return ''
                },
            },
            allowEdit: {
                type: Boolean,
                default() {
                    return false
                },
            },
        },

        emits: ['delete'],
        setup(props, { emit }) {
            const { username, status, allowEdit, timestamp, message } =
                toRefs(props)

            const icon = computed(() => {
                const found = certificateList.find(
                    (item) =>
                        item.id.toLowerCase() === status?.value?.toLowerCase()
                )
                if (found) {
                    return found.icon
                }

                return ''
            })

            const statusClass = computed(() => {
                switch (status.value) {
                    case 'VERIFIED':
                        return 'bg-verified'
                    case 'DRAFT':
                        return 'bg-warning-light'
                    case 'DEPRECATED':
                        return 'bg-gray-100'
                    default:
                        return ''
                }
            })

            const handleRemove = () => {
                emit('delete', status)
            }

            return {
                handleRemove,
                capitalizeFirstLetter,
                icon,
                statusClass,
            }
        },
    }
</script>

<style lang="less" scoped>
    .bg-verified {
        background-color: #eeffef;
    }
</style>
