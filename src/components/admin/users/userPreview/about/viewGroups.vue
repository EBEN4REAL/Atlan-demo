<template>
    <span class="text-gray-500 text-sm">Groups</span>
    <div v-if="!error && !isLoading" class="flex flex-wrap mt-1">
        <div v-if="filteredGroupCount > 0">
            <Tags
                :allow-update="false"
                :tags="groups"
                icon="Group"
                custom-classes="flex content-center items-center bg-white border border-gray-300 py-0.5 px-2 font-normal text-center text-sm rounded-3xl"
            >
                <template #label="{ tag }">
                    <AtlanIcon icon="Group" class="text-primary mr-1"/> {{ tag }}
                </template>
            </Tags>
        </div>
        <div v-else>
            <span class="font-bold">{{ user.firstName }}</span> is not a part of any group.
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineProps, toRefs, watch, ref } from 'vue'
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
        },
        setup(props) {
            const { user } = toRefs(props)
            const userId = computed(() => user.value.id)
            const groupListAPIParams = computed(() => ({
                userId: userId.value,
                params: {
                    limit: 10,
                    offset: 0,
                    sort: 'name',
                    filter: {},
                },
                immediate: true,
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
                totalGroupCount
            }
        },
    }
</script>
