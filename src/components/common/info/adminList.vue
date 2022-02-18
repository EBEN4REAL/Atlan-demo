<template>
    <div
        v-if="isLoading && !list?.length"
        style="min-width: 240px"
        class="h-40 flex items-center justify-center"
    >
        <a-spin />
    </div>
    <div
        v-else
        class="flex flex-col py-2 px-2 pl-4 overflow-y-auto"
        style="max-height: 300px; min-width: 240px"
    >
        <span class="font-bold mb-2"
            >{{ filteredUserCount }} workspace admins</span
        >
        <template v-for="user in list" :key="user.username">
            <div class="flex items-center py-1 justify-between">
                <div class="flex items-center">
                    <a-avatar
                        :src="imageUrl(user?.username)"
                        class="ant-tag-blue text-primary"
                        :size="16"
                    >
                        <template #icon>
                            <AtlanIcon icon="User" class="h-3"></AtlanIcon>
                        </template>
                    </a-avatar>
                    <span class="ml-2">{{ user?.name || user?.username }}</span>
                </div>
                <div>
                    <SlackMessageCta :entity="user" ctaText="" />
                </div>
            </div>
        </template>
        <span
            @click="handleLoadMore"
            class="text-primary my-2 mx-auto cursor-pointer"
            >Load More...
            <span v-if="isLoading && list?.length">
                <AtlanIcon
                    icon="CircleLoader"
                    class="text-primary animate-spin"
                />
            </span>
        </span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, reactive, computed, watch } from 'vue'
    import { useUsers } from '~/composables/user/useUsers'
    import SlackMessageCta from '@common/popover/user/slackMessageCta.vue'
    export default defineComponent({
        name: 'AdminList',
        components: {
            SlackMessageCta,
        },
        setup(props) {
            const userListAPIParams: any = reactive({
                limit: 5,
                offset: 0,
                sort: 'firstName',
                filter: {
                    $and: [{ roles: { $elemMatch: '$admin' } }],
                },
            })
            const list = ref([])
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const {
                userList,
                filteredUserCount,
                getUserList,
                isLoading,
                error,
                isReady,
                totalUserCount,
                getUserTypeAggregations,
                STATES,
            } = useUsers(userListAPIParams)

            const handleLoadMore = () => {
                console.log('loadmore')
                userListAPIParams.offset = userListAPIParams.offset + 5
                getUserList()
            }

            watch(isReady, () => {
                userList.value.forEach((el) => {
                    if (!list.value.find((i) => i?.username === el.username)) {
                        list.value.push(el)
                    }
                })
            })
            return {
                userList,
                imageUrl,
                filteredUserCount,
                isLoading,
                handleLoadMore,
                list,
            }
        },
    })
</script>

<style></style>
