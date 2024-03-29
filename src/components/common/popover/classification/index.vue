<template>
    <a-drawer
        v-model:visible="showClassificationPreview"
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
            :classification-prop="classification"
            @close="togglePreview"
        />
    </a-drawer>
    <a-popover
        placement="left"
        :mouse-enter-delay="mouseEnterDelay"
        @click="
            (e) => {
                e.stopPropagation()
                togglePreview()
            }
        "
        @mouseenter="$emit('mouseEntered')"
        @mouseleave="$emit('mouseLeft')"
    >
        <template #content>
            <div class="max-w-sm">
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
</template>

<script lang="ts">
    import { PropType, defineComponent, ref } from 'vue'
    import ClassificationHead from '@common/popover/classification/head.vue'
    import ClassificationBody from '@common/popover/classification/body.vue'
    import ClassificationDrawer from '@common/drawer/classification/index.vue'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationPopover',
        components: {
            ClassificationBody,
            ClassificationHead,
            ClassificationDrawer,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
            entityGuid: {
                type: String,
                required: false,
                default: '',
            },
            mouseEnterDelay: {
                type: Number,
                required: false,
                default: 0,
            },
        },
        emits: ['mouseEntered', 'mouseLeft'],
        setup() {
            const showClassificationPreview = ref<boolean>(false)

            const togglePreview = () => {
                showClassificationPreview.value =
                    !showClassificationPreview.value
            }

            return {
                showClassificationPreview,
                togglePreview,
            }
        },
    })
</script>
