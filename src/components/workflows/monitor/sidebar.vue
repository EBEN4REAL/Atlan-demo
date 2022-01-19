<template>
    <div class="flex flex-col gap-y-2">
        <div class="flex items-center">
            <AtlanIcon icon="Shield" class="text-pink-400" />
            {{ selectedPod.displayName }}
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { computed, defineComponent, toRefs } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        // mixins: [WorkflowMixin],
        props: {
            selectedPod: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },
        emits: ['setSelectedGraph', 'setSelectedPod', 'openLog'],
        setup(props, { emit }) {
            const { selectedPod } = toRefs(props)

            const icon = computed(() => {
                if (selectedPod.value.phase) {
                }
            })
            return {
                selectedPod,
            }
        },
        components: { AtlanIcon },
    })
</script>

<style lang="less" scoped></style>
