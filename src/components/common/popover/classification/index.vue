<template>
    <a-popover placement="left">
        <template #content>
            <div>
                <div>
                    <ClassificationHead
                        :classification="classification"
                        :entity-guid="entityGuid"
                    />
                </div>
                <div>
                    <ClassificationBody :classification="classification" />
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { PropType, defineComponent, ref } from 'vue'
    import ClassificationHead from '@common/popover/classification/head.vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import ClassificationBody from '@common/popover/classification/body.vue'

    export default defineComponent({
        name: "ClassificationPopover",
        components: { ClassificationBody, ClassificationHead },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true
            },
            entityGuid: {
                type: String,
                required: false,
                default: ''
            }
        },
        setup(props) {
            const classification = ref<ClassificationInterface>(props.classification)

        }
    })
</script>