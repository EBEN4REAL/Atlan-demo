<template>
    <span class="text-gray-500 text-sm">Groups</span>
    <div v-if="!error && !isLoading" class="flex flex-wrap mt-1">
        <div v-if="filteredGroupCount > 0">
            <span
                v-for="(group, index) in groupList.slice(0, 2)"
                :key="index"
                class="rounded-3xl border border-gray-300 py-1 px-3 font-normal text-center text-sm"
                :class="index > 0 ? 'ml-1' : ''"
            >
                <AtlanIcon icon="Group" class="w-4 h-4 text-primary" />
                {{ group.alias }}
            </span>
            <span
                v-if="filteredGroupCount < 2"
                class="rounded-3xl ml-1 mt-1 bg-gray-300 border border-gray-200 py-1 px-3 text-center font-normal text-sm"
            >
                <a href="#">+ {{ filteredGroupCount - 2 }} more</a>
            </span>
        </div>
        <div v-else>
            <span class="font-bold">{{ user.firstName }}</span> is not a part of any group.
        </div>
    </div>
</template>

<script setup lang="ts">
    import { toRefs, defineProps, reactive } from 'vue'
    import getUserGroups from '~/composables/user/getUserGroups'

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
</script>

<script lang="ts">
    export default {
        name: 'ViewGroups',
    }
</script>