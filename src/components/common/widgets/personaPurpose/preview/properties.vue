<template>
    <div class="p-5">
        <div class="flex items-center text-sm font-bold text-gray-600">
            <AtlanIcon icon="Property" class="mb-1 mr-2" />Properties
        </div>
        <div class="mt-3">
            <div class="py-3">
                <div class="text-sm text-gray-600">Last updated by</div>
            </div>
            <div class="flex">
                <PopOverUser :item="item?.updatedBy || item?.createdBy">
                    <UserPill :username="item?.updatedBy || item?.createdBy" />
                </PopOverUser>
            </div>
            <div class="py-3">
                <div class="text-sm text-gray-600">Last updated at</div>
                <div class="mt-2 text-sm text-gray-800">
                    {{ formatDateTime(item?.updatedAt) }} ({{
                        useTimeAgo(item?.updatedAt).value
                    }})
                </div>
            </div>
            <div class="py-3">
                <div class="text-sm text-gray-600">Created at</div>
                <div class="mt-2 text-sm text-gray-800">
                    {{ formatDateTime(item?.createdAt) }} ({{
                        useTimeAgo(item?.createdAt).value
                    }})
                </div>
            </div>
            <div class="py-3">
                <div class="text-sm text-gray-600">Created by</div>
                <div class="flex">
                    <PopOverUser :item="item?.createdBy">
                        <UserPill :username="item?.createdBy" />
                    </PopOverUser>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import { useTimeAgo } from '@vueuse/core'

    import { formatDateTime } from '~/utils/date'
    import PopOverUser from '@/common/popover/user/user.vue'
    import UserPill from '@/common/pills/user.vue'

    export default defineComponent({
        name: 'PersonaPurposeProperties',
        components: {
            UserPill,
            PopOverUser,
        },
        props: {
            item: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { item } = toRefs(props)
            console.log(item?.value, 'iteeemm')
            return {
                useTimeAgo,
                formatDateTime,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped></style>
