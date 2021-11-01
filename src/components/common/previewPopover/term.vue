<template>
    <div>
        
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, watch, Ref, toRefs } from 'vue'

    import { Term } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        name: 'TermPopover',
        components: {

        },
        props: {
            term: {
                type: Object as PropType<Term>,
                required: false,
                default: true,
            },
        },
        setup(props, { emit }) {
           const term = toRefs(props)

            return {
                term
            }
        },
    })
</script>


<style lang="less" module>

</style>
