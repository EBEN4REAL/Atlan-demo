<template>
    <div class="term-request">
        <a-popover :mouse-enter-delay="0.3" placement="leftTop" trigger="hover">
            <template #content>
                <div class="flex flex-col w-56 p-4">
                    <div class="flex justify-between mb-2 text-sm">
                        <span class="text-gray-500">TERM</span>
                        <span v-if="data.isPropagated" class="text-primary"
                            >Propagated</span
                        >
                    </div>
                    <span class="mb-1 text-sm font-bold">{{ data.name }}</span>
                    <!-- TODO: Change this to a link to the specified glossary -->
                    <span
                        v-if="data.anchor?.displayText"
                        class="mb-4 text-xs text-gray-500"
                        >{{ data.anchor.displayText }}</span
                    >

                    <template v-if="data?.shortDescription">
                        <span class="mb-1 text-xs text-gray-500"
                            >Description</span
                        >
                        <span class="mb-4 text-sm">{{
                            data.shortDescription
                        }}</span>
                    </template>

                    <div v-if="data?.categories?.length">
                        <span class="mb-1 text-xs text-gray-500"
                            >Categories</span
                        >
                        <PillGroup
                            :data="data.categories"
                            label-key="displayText"
                            read-only
                        />
                        <!-- TODO: Link the category on click action -->
                    </div>
                </div>
            </template>
            <Pill :label="data?.name" :has-action="false">
                <template #prefix>
                    <AtlanIcon icon="Term"></AtlanIcon>
                </template>
            </Pill>
        </a-popover>
        <div class="pr-2 mt-1 text-gray-500">Link Term</div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import Pill from '~/components/UI/pill/pill.vue'

    export default defineComponent({
        components: { PillGroup, Pill },
        props: {
            data: {
                required: true,
                default: () => {},
            },
        },
        setup(props) {},
    })
</script>

<style lang="less">
    .term-request {
        .classification-request {
            button {
                padding-left: 0px !important;
            }
        }
        .pill-ui {
            padding-left: 0px !important;
            background: transparent !important;
            border: none !important;
            &:hover {
                background: transparent !important;
                @apply text-gray-700 !important;
            }
        }
    }
</style>
