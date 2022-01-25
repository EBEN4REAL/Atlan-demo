<template>
    <a-popover placement="left">
        <template #content>
            <div>
                <div>
                    <ClassificationHead
                        :classification="classification"
                        :entity-guid="entityGuid"
                        @toggle-preview="togglePreview"
                    />
                </div>
                <div>
                    <ClassificationBody :classification="classification" />
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
    <a-drawer
        :visible="showClassificationPreview"
        :destroy-on-close="true"
        placement="right"
        :body-style="{ height: '100%' }"
        :mask="false"
        :width="420"
        :closable="false"
        class="drawer"
        @close="togglePreview"
    >
        <ClassificationDrawer
            :classification-prop='classification'
            @close="togglePreview"
        />
    </a-drawer>
</template>

<script lang="ts">
    import { PropType, defineComponent, ref } from 'vue'
    import ClassificationHead from '@common/popover/classification/head.vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import ClassificationBody from '@common/popover/classification/body.vue'
    import ClassificationDrawer from '@common/drawer/classification/index.vue'

    export default defineComponent({
        name: "ClassificationPopover",
        components: { ClassificationBody, ClassificationHead, ClassificationDrawer },
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
            const showClassificationPreview = ref(false)

            const togglePreview = () => {
                showClassificationPreview.value = !showClassificationPreview.value
            }

            return {
                classification,
                showClassificationPreview,
                togglePreview
            }
        }
    })
</script>