<template>
    <a-popover :mouseEnterDelay="0.3" placement="leftTop" trigger="hover">
        <template #content>
            <p>{{ label }}</p>
            <p>{{ rawTime }}</p>
        </template>
        <span>{{ timeAgo }}</span>
    </a-popover>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import { useTimeAgo } from '@vueuse/core'

    export default defineComponent({
        props: {
            label: {
                type: String,
                required: false,
            },
            date: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const { date } = toRefs(props)
            const timeAgo = useTimeAgo(date, {
                max: 'day',
                fullDateFormatter: (dt: Date): string => {
                    return dt.toDateString().split(' ').slice(1).join(' ')
                },
            })
            const rawTime = computed(() =>
                new Date(date.value).toLocaleString()
            )
            return { timeAgo, rawTime }
        },
    })
</script>
