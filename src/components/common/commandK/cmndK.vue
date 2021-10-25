<template>
    <div>
        <a-modal :visible="isVisible" @cancel="$emit('closeModal')">
            <template #title> searchBar goes here </template>
            list goes here
        </a-modal>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        onMounted,
        watch,
        computed,
        toRefs,
    } from 'vue'
    import { useMagicKeys, whenever } from '@vueuse/core'
    export default defineComponent({
        name: 'CommandK',
        components: {},
        props: {
            isCmndKVisible: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['closeModal'],
        setup(props) {
            const { isCmndKVisible } = toRefs(props)
            const isVisible = computed(() => isCmndKVisible.value)

            return {
                isVisible,
            }
        },
    })
</script>
