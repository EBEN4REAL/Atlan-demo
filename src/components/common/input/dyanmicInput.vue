<template>
    <a-input
        v-if="dataType === 'string'"
        v-model:value="localValue"
        :maxlength="max || 50"
    ></a-input>
    <a-input-number
        v-if="['int', 'long'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        :precision="0"
    ></a-input-number>
    <a-input-number
        v-if="['double', 'float'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
    ></a-input-number>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        defineAsyncComponent,
        toRefs,
        defineComponent,
        ref,
        watch,
        onMounted,
        Ref,
    } from 'vue'
    // import UserSelector from '@common/selector/users/index.vue'
    // import useAsyncSelector from './useAsyncSelector'
    // import useAsyncTreeSelect from './useAsyncTreeSelect'
    // import useFileUploader from './useFileUploader'

    export default defineComponent({
        components: {},
        props: {
            modelValue: {},
            dataType: { default: 'string' },
            max: { type: Number },
        },
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const localValue = ref(modelValue.value)

            return { localValue }
        },
    })
</script>

<style lang="less" scoped></style>
