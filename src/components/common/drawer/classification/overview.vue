<template>
    <div class="px-4 py-5 overflow-hidden overflow-y-auto tab-content-wrapper">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanLoader class="h-10" />
        </div>

        <div v-else class="h-full">
            <div class="mb-5 text-base font-bold text-gray-500">
                Overview
            </div>
            <div class='mb-6'>
                <p class='text-gray-500'>Description</p>
                <p class='text-gray-700 mt-2'>
                    {{ classification.description ? classification.description : "No description available" }}
                </p>
            </div>
            <div v-auth='map.LIST_PURPOSE' class='mb-6'>
                <p class='text-gray-500 mb-2'>Purposes</p>
                <ClassificationPurposes :classification='classification' />
            </div>
            <div class='mb-6'>
                <p class='text-gray-500 mb-2'>Linked Assets</p>
                <p
                    class='text-gray-700 text-primary cursor-pointer font-bold'
                    @click='$emit("setTab", "linkedAssets")'
                >
                    {{ assetCount }} Assets
                </p>
            </div>
            <div class='mb-6'>
                <p class='text-gray-500 mb-2'>Last updated by</p>
                <div
                    class="flex gap-0.5 text-sm content-center items-center flex-wrap"
                >
                    <UserAvatar :username="lastUpdatedByUserName" />
                    <span class="text-gray-700">{{ lastUpdatedBy.name }}</span>
                    <span class="text-gray-500 ml-2">{{ lastUpdatedAt }}</span>
                </div>
            </div>
            <div class='mb-6'>
                <p class='text-gray-500 mb-2'>Created by</p>
                <div
                    class="flex gap-0.5 text-sm content-center items-center flex-wrap"
                >
                    <UserAvatar :username="createdByUserName" />
                    <span class="text-gray-700">{{ createdBy.name }}</span>
                    <span class="text-gray-500 ml-2">{{ createdAt }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import {
        computed,
        defineComponent, PropType,
        ref,
        toRefs,
    } from 'vue'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'
    import ClassificationPurposes from '@common/popover/classification/viewPurposes.vue'
    import UserAvatar from '@/common/avatar/user.vue'
    import { useUsers } from '~/composables/user/useUsers'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import { useLinkedAssets } from '~/composables/classification/useLinkedAssets'
    import { and } from '@vueuse/core'
    import map from '~/constant/accessControl/map'

    dayjs.extend(relativeTime)

    export default defineComponent({
        name: 'ClassificationOverview',
        components: {
            AtlanLoader,
            ClassificationPurposes,
            UserAvatar
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        emits: ['setTab'],
        setup(props, { emit }) {
            const { classification } = toRefs(props)

            const lastUpdatedAt = computed(() => dayjs().to(dayjs(classification.value.updateTime)))
            const createdAt = computed(() => dayjs().to(dayjs(classification.value.createTime)))

            const createdByUserName = computed(() => classification.value.createdBy)
            const lastUpdatedByUserName = computed(() => classification.value.updatedBy)

            const params = {
                limit: 2,
                offset: 0,
                filter: {
                    $or: [
                            { username: createdByUserName.value },
                            { username: lastUpdatedByUserName.value },
                        ],
                },
            }

            // Fetching the user list satisfying the given parameters.
            const { userList, isLoading: isUserLoading } = useUsers(params)

            const createdBy = computed(() =>
                !isUserLoading.value
                && userList.value.length > 0
                && userList.value.filter(
                    (user) => user.username === createdByUserName.value
                ).length > 0
                    ? { ...userList.value.filter((user) => user.username === createdByUserName.value)[0] }
                    : {}
            )

            const lastUpdatedBy = computed(() =>
                !isUserLoading.value
                && userList.value.length > 0
                && userList.value.filter(
                    (user) => user.username === lastUpdatedByUserName.value
                ).length > 0
                    ? { ...userList.value.filter((user) => user.username === lastUpdatedByUserName.value)[0] }
                    : {}
            )

            const { assetCount, isLoading: isAssetCountLoading } = useLinkedAssets(classification)

            const isLoading = and(isUserLoading, isAssetCountLoading)

            return {
                classification,
                isLoading,
                lastUpdatedAt,
                createdAt,
                createdBy,
                isUserLoading,
                createdByUserName,
                lastUpdatedByUserName,
                lastUpdatedBy,
                assetCount,
                map
            }
        },
    })
</script>
<style lang="less" scoped>
    .tab-content-wrapper {
        height: calc(100vh - 5rem) !important;
    }
</style>
