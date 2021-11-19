<template>
    <div class="p-6">
        <p class="mb-5 text-lg font-semibold text-gray-700">
            {{ data?.label }}
        </p>

        <div class="grid grid-cols-12 gap-4">
            <div
                :class="item.class"
                :style="item.style"
                class=""
                :id="item.id"
                v-for="item in data.widgets"
                :key="item.id"
            >
                <WidgetComponent :data="item"> </WidgetComponent>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRef, toRefs } from 'vue'
    import { Dashboard } from '~/types/reporting/Dashboard'
    import WidgetComponent from './widget.vue'

    export default defineComponent({
        name: 'Dashboard',
        components: { WidgetComponent },
        props: {
            data: {
                type: Object,
                default() {
                    return {}
                },
            },
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)

            return { data }
        },
    })
</script>
