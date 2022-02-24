<template>
    <div class="flex p-2" :class="{ 'bg-primary text-white': selected }">
        <Avatar :username="user.username" />
        <span class="ml-1">
            <span class="font-semibold">{{ user.username }}</span>
        </span>
        <span class="mx-2">&bull;</span>
        {{ fullName }}
    </div>
</template>

<script lang="ts">
    import { toRefs, defineProps, PropType, computed } from 'vue'
    import Avatar from '@common/avatar/user.vue'
    import { userInterface } from '~/types/users/user.interface'

    export default {
        name: 'UserMention',
        components: {
            Avatar,
        },
    }
</script>

<script setup lang="ts">
    const props = defineProps({
        user: {
            type: Object as PropType<userInterface>,
            required: true,
        },
        selected: {
            type: Boolean,
            default: false,
            required: false,
        },
    })

    const { user, selected } = toRefs(props)

    const fullName = computed<String>(
        () => `${user.value.firstName} ${user.value.lastName}`
    )
</script>

<style scoped></style>
