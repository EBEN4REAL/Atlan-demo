<template>
    <div>
        <p class="text-gray-500 mb-1">{{ $t('common.term.owner', 2) }}</p>
        <div class="flex flex-wrap gap-1">
            <UserPill
                v-for="(username, index) in ownerUsers"
                :key="index"
                :username="username"
                :allow-delete="false"
                :enable-hover="false"
            />
            <GroupPill
                v-for="(groupName, index) in ownerGroups"
                :key="index"
                :name="groupName"
                :allow-delete="false"
                :enable-hover="false"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    export default {
        name: 'GlossaryPopoverOwners',
        components: {
            UserPill,
            GroupPill,
        },
    }
</script>

<script setup lang="ts">
    import { computed, toRefs } from 'vue'

    const props = defineProps({
        attributes: {
            type: Object,
            required: true,
        },
    })

    const { attributes } = toRefs(props)

    const ownerUsers = computed(
        () => attributes?.value?.localOwners?.ownerUsers
    )
    const ownerGroups = computed(
        () => attributes?.value?.localOwners?.ownerGroups
    )
</script>

<style scoped></style>
