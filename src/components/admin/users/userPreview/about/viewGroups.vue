<template>
    <div class="cursor-pointer group">
        <span class="text-sm text-gray-500">Groups</span>
        <span
            class="mx-2 text-xs transition duration-300 ease-in-out delay-100 opacity-0 cursor-pointer text-primary group-hover:opacity-100"
            @click="$emit('changeTab', 'groups')"
            >Manage</span
        >
        <div v-if="isLoading" class="mt-1">
            <AtlanIcon
                icon="CircleLoader"
                class="mb-1 mr-2 text-primary animate-spin"
            ></AtlanIcon>
            <span class="text-gray-500">Fetching user groups...</span>
        </div>
        <div v-else-if="!error && !isLoading" class="flex flex-wrap mt-1">
            <div
                v-if="filteredGroupCount > 0"
                class="flex flex-wrap mt-1 gap-y-1"
            >
                <Tags
                    :allow-update="false"
                    :tags="groups"
                    icon="Group"
                    custom-classes="flex content-center items-center bg-white border border-gray-300 py-0.5 px-2 font-normal text-center text-sm rounded-3xl"
                >
                    <template #label="{ tag }">
                        <AtlanIcon icon="Group" class="mr-1 text-primary" />
                        {{ tag }}
                    </template>
                </Tags>
                <!-- <div
                v-if="filteredGroupCount > groupTagLimit"
                class="flex content-center items-center bg-white border border-gray-300 py-0.5 px-2 font-normal text-center text-sm rounded-3xl hover:bg-gray-300 cursor-pointer"
                @click="$emit('changeTab','groups')"
            >
                + {{ filteredGroupCount - groupTagLimit }} more
            </div> -->
            </div>
            <div v-else>
                <span>{{
                    isCurrentUser ? 'You are' : `${user.firstName} is`
                }}</span>
                not a part of any group.
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineProps, toRefs, watch, ref, onMounted } from 'vue'
    import getUserGroups from '~/composables/user/getUserGroups'
    import Tags from '~/components/common/badge/tags/index.vue'
    import { Users } from '~/services/service/users'

    export default {
        name: 'ViewGroups',
        components: {
            Tags,
        },
        props: {
            user: {
                type: Object,
                required: true,
            },
            groupTagLimit: {
                type: Number,
                default: 2,
            },
            isCurrentUser: {
                type: Boolean,
                default: false,
            },
            immediateFetch: {
                type: Boolean,
                default: true,
            },
        },
        emits: ['changTab'],
        setup(props) {
            const { user, immediateFetch } = toRefs(props)
            const userId = computed(() => user.value.id)
            const groupListAPIParams = computed(() => ({
                userId: userId.value,
                params: {
                    limit: 10,
                    offset: 0,
                    sort: 'name',
                    filter: {},
                },
                immediate: immediateFetch.value,
            }))
            const {
                groupList,
                totalGroupCount,
                filteredGroupCount,
                getUserGroupList,
                error,
                isLoading,
            } = getUserGroups(groupListAPIParams)

            watch(
                userId,
                () => {
                    getUserGroupList()
                },
                { immediate: true }
            )
            const groups = computed(() =>
                groupList.value.map((group) => group.name)
            )

            return {
                groups,
                error,
                isLoading,
                filteredGroupCount,
                totalGroupCount,
            }
        },
    }
</script>
