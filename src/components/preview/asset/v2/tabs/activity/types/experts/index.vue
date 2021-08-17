<template>
    <span
        >Say 👋 Hello, to the newly added
        <b>{{ data.value.length > 1 ? 'Experts' : 'Expert' }}</b></span
    >
    <ul v-for="(user, index) in data.value" :key="index" class="my-1">
        <li class="flex items-center">
            <avatar
                :avatar-name="user"
                avatar-shape="circle"
                :avatar-size="28"
                class="mx-2"
            /><span class="font-bold">{{ user }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import Avatar from '~/components/common/avatar.vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        components: { Avatar },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: 'Event', value: [] }
                },
            },
        },
    })
</script>
