<template>
    <div>
        <b>Terms </b
        >{{ data.displayValue === 'termAdded' ? 'added' : 'removed' }}
    </div>
    <div class="flex">
        <div
            class="
                px-3
                my-3
                rounded-full
                cursor-pointer
                pill
                py-1.5
                font-bold
                bg-gray-light
                text-gray-700
                hover:bg-primary hover:text-white
            "
        >
            {{ data.value }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
    })
</script>
