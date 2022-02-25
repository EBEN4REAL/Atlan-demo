<template>
    <div class="flex p-2 w-100" :class="{ 'bg-primary text-white': selected }">
        <Avatar :is-group="true" />
        <span class="ml-1 flex" style="max-width: 50%">
            <span class="font-semibold truncate">{{ group.alias }}</span>
        </span>
        <span class="mx-2">&bull;</span>
        <span class="truncate">{{ group.name }}</span>
    </div>
</template>

<script lang="ts">
    import { toRefs, defineProps, PropType } from 'vue'
    import Avatar from '@common/avatar/user.vue'
    import { groupInterface } from '~/types/groups/group.interface'

    export default {
        name: 'UserMention',
        components: {
            Avatar,
        },
    }
</script>

<script setup lang="ts">
    const props = defineProps({
        group: {
            type: Object as PropType<groupInterface>,
            required: true,
        },
        selected: {
            type: Boolean,
            default: false,
            required: false,
        },
    })

    const { group, selected } = toRefs(props)
</script>

<style scoped></style>
