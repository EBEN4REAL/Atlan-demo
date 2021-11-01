<template>
    <a-popover :placement="placement" :trigger="trigger">
        <template #content>
            <div class="p-1">
                <div class="flex text-xs leading-4">
                    <div class="flex mr-3 space-x-2 text-gray-700">
                        <AtlanIcon icon="Term" />
                        <span>TERM</span>
                    </div>

                    <div v-if="anchorAttributes(term)?.name" class="flex space-x-2 mr-2 text-gray-500">
                        <AtlanIcon icon="Glossary" />
                        <span>{{ anchorAttributes(term)?.name }}</span>
                    </div>
                </div>

                <div class="flex mt-4">
                    <div class="flex space-x-2 text-xl text-gray-700">
                        <span>{{ title(term) }}</span>
                    </div>
                </div>

                <div class="text-sm leading-5 text-gray-500 truncate overflow-ellipsis"> 
                    {{ description(term) }} 
                </div>
                
                <div class="flex mt-2">
                    <Owners
                        :selected-asset="term"
                    />
                </div>
            </div>
        </template>

        <div class="flex w-32">
            <AtlanIcon icon="Term" />
            <span>{{ title(term) }}</span>
        </div>

    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'

    // components
    import Owners from '@/common/input/owner/index.vue'

    // composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    //types
    import { Term } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        name: 'TermPopover',
        components: {
            Owners,
        },
        props: {
            term: {
                type: Object as PropType<Term>,
                required: false,
                default: true,
            },
            placement: {
                type: String,
                required: false,
                default: 'left'
            },
            trigger: {
                type: String,
                required: false,
                default: 'hover'
            }
        },
        setup(props, { emit }) {
           const { term } = toRefs(props)

            const {
                title,
                description,
                anchorAttributes
            } = useAssetInfo()

            return {
                term,
                title,
                description,
                anchorAttributes
            }
        },
    })
</script>


<style lang="less" module>

</style>
