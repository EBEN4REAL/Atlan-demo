<template>
    <span class="text-gray-500 text-sm">Groups</span>
    <div v-if="!error && !isLoading" class="flex flex-wrap mt-1">
        <div v-if="filteredGroupCount > 0">
            <Tags
                :allow-update="false"
                :tags="groups"
                icon="Group"
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
            const groupListLoading = ref(false)
            const groupList = ref([])
            const filteredGroupCount = ref(0)
            const groupListError = ref({})
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
            const fetchGroupList = () => {
                const { data, isReady, error, isLoading } =
                    Users.ListUserGroups(
                        groupListAPIParams.value.params,
                        groupListAPIParams.value.userId,
                        {
                            asyncOptions: {
                                immediate: groupListAPIParams.value.immediate,
                            },
                        }
                    )
                watch(
                    isLoading,
                    () => {
                        groupListLoading.value = isLoading.value
                    },
                    { immediate: true }
                )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        if (isReady && !error.value && !isLoading.value) {
                            groupList.value = data?.value?.records ?? []
                            filteredGroupCount.value =
                                data?.value?.filteredRecord ?? []
                        } else if (error && error.value) {
                            groupListError.value = error.value
                        }
                    },
                    { immediate: true }
                )
            }

            watch(
                userId,
                () => {
                    fetchGroupList()
                },
                { immediate: true }
            )

            const groups = computed(() =>
                groupList.value.map((group) => group.name)
            )

            return {
                groups,
                groupListError,
                groupListLoading,
                filteredGroupCount,
            }
        },
    }
</script>
