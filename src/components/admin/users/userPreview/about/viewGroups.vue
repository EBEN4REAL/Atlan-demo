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

<script setup lang="ts">
    import { toRefs, defineProps, reactive, computed } from 'vue'
    import getUserGroups from '~/composables/user/getUserGroups'
    import Tags from "~/components/common/badge/tags/index.vue"

    const props = defineProps({
        user: {
            type: Object,
            default: () => {},
            required: true
        }
    })

    const { user } = toRefs(props)
    const groupListAPIParams = reactive({
        userId: user.value.id,
        params: {
            limit: 10,
            offset: 0,
            sort: 'name',
            filter: {},
        },
    })
    const {
        groupList,
        filteredGroupCount,
        error,
        isLoading,
    } = getUserGroups(groupListAPIParams)

    const groups = computed(() => groupList.value.map((group) => group.name))
</script>

<script lang="ts">
    export default {
        name: 'ViewGroups',
    }
</script>