<template>
    <div :class="data.class" :key="data.id">
        {{ data.label }}
        <component
            :is="componentType"
            :id="data.id"
            :label="data.label"
            :payload="data.componentData"
        ></component>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        PropType,
        ref,
        toRefs,
    } from 'vue'

    import { Widget } from '~/types/reporting/Dashboard'

    export default defineComponent({
        name: 'Home',
        props: {
            data: {
                type: Object as PropType<Widget>,
                default() {
                    return { id: 'sample', label: 'sample' }
                },
            },
        },
        components: {
            Graph: defineAsyncComponent(() => import('./widgets/graph.vue')),
            Default: defineAsyncComponent(
                () => import('./widgets/default.vue')
            ),
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)

            const componentType = computed(() => {
                if (data.value.component && data.value.component !== '') {
                    return data.value.component
                }
                return 'default'
            })

            return { data, componentType }
        },
    })
</script>
