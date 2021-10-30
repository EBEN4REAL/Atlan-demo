<template>
    <div class="flex flex-col w-full px-3 gap-y-2">
        <ConnectorSelect class="w-full"></ConnectorSelect>
        <ConnectionSelect class="w-full"></ConnectionSelect>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRef, toRefs } from 'vue'

    import ConnectorSelect from '@/common/select/connector.vue'
    import ConnectionSelect from '@/common/select/connection.vue'

    import { useVModels, toRef } from '@vueuse/core'

    export default defineComponent({
        props: {
            facetMap: {
                required: false,
                default() {
                    return []
                },
            },
        },
        components: {
            ConnectorSelect,
            ConnectionSelect,
        },
        emits: ['change', 'update:facetMap'],
        setup(props, { emit }) {
            return {}
        },
    })
</script>

<style lang="less" scoped></style>
