<template>
    <div class="bg-white rounded">
        <div class="flex items-center justify-between p-3 border-b">
            <div class="flex items-center">
                <AtlanIcon icon="WarningIcon" class="mr-2" />
                <div class="font-semibold text-gray-700">Summary</div>
            </div>
        </div>
        <div class="flex flex-col p-3">
            <div class="mt-1">
                <div class="mb-2.5 text-gray-500">Channels</div>
                <span class="text-sm cursor-pointer text-primary"
                    ><AtlanIcon icon="Add" class="mr-2" />Add link</span
                >
            </div>
            <div class="mt-7">
                <div class="mb-2.5 text-gray-500">Policies</div>
                <span class="text-sm cursor-pointer text-primary"
                    ><AtlanIcon icon="Add" class="mr-2" />Add policies</span
                >
            </div>
            <div class="mt-7">
                <div class="mb-2.5 text-gray-500">Created by</div>
                <div class="flex items-center">
                    <Avatar
                        :allow-upload="false"
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-2"
                    />
                    {{ item.createdBy }}
                    <div class="mx-1 mt-1 text-gray-300">•</div>
                    <div class="text-sm text-gray-500">
                        {{ timeStamp(item.createdAt) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import Avatar from '~/components/common/avatar/index.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { formatDateTime } from '~/utils/date'
    import AtlanBtn from '@/UI/button.vue'

    interface IItem {
        createdAt?: string
        createdBy?: string
        description?: string
        name?: string
    }

    export default defineComponent({
        name: 'SummaryWidget',
        components: { Avatar, PopOverUser, AtlanBtn },
        props: {
            item: {
                type:
                    (Object as PropType<IPersona>) ||
                    (Object as PropType<IPurpose>) ||
                    (Object as IItem),
                required: true,
            },
        },
        emits: ['editDetails'],
        setup(props) {
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            const timeStamp = (time, raw: boolean = false) => {
                if (time) {
                    return raw
                        ? formatDateTime(time) || 'N/A'
                        : useTimeAgo(time).value
                }
                return ''
            }

            return {
                imageUrl,
                timeStamp,
            }
        },
    })
</script>
<style lang="less"></style>
