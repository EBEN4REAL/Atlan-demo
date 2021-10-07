<template>
    <div>
        <div
            class="p-3 rounded cursor-pointer"
            :class="{ 'bg-gray-200': item.guid === selected }"
            v-for="item in list"
            :key="item.guid"
            @click="select(item.guid)"
        >
            <p
                class="m-0 overflow-hidden text-sm font-bold overflow-ellipsis"
                :class="item.guid === selected ? 'text-primary' : 'text-gray'"
            >
                {{ item.name }}
            </p>
            <span class="m-0 text-sm text-gray">
                {{ item.elementDefs.length }} elements(s)
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useTimeAgo } from '@vueuse/core'

    export default defineComponent({
        name: 'EnumList',
        props: {
            list: Array,
            selected: String,
        },
        emits: ['update:selected'],
        setup(props, context) {
            function select(id: string) {
                context.emit('update:selected', id)
            }

            function updateTime(time: string) {
                return useTimeAgo(time).value
            }

            return {
                updateTime,
                select,
            }
        },
    })
</script>
