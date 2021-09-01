<template>
    <span>
        <div
            ref="container"
            class="mr-2 overflow-y-auto"
            style="max-height: 25rem"
        >
            <div
                v-for="item in AdvancedAttributeList"
                :key="item.id"
                class="mx-5"
            >
                <!-- <AttributeItem
                    :a="a"
                    :applied="data.applied[a.name] || {}"
                    @handleAttributeInput="setBMfilter"
                /> -->
            </div>
        </div>
    </span>
</template>
<script lang="ts">
    import { defineComponent, PropType, ref, provide } from 'vue'
    import { Collapse } from '~/types'
    import AttributeItem from './attributeItems.vue'
    import {
        AdvancedAttributeList,
        OperatorList,
    } from '~/constant/advancedAttributes'

    export default defineComponent({
        name: 'Advanced Filter',
        components: { AttributeItem },

        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            return {
                AdvancedAttributeList,
            }
        },
    })
</script>

<style>
    .ant-popover-arrow {
        display: none;
    }
</style>
