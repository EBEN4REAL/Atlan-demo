<template>
    <a-popover :mouseEnterDelay="0.3" placement="leftTop" trigger="hover">
        <template #content>
            <div class="flex flex-col w-56">
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
                    <span class="mb-1 text-xs text-gray-500">Description</span>
                    <span class="mb-4 text-sm">{{
                        data.shortDescription
                    }}</span>
                </template>

                <div v-if="data?.categories?.length">
                    <span class="mb-1 text-xs text-gray-500">Categories</span>
                    <PillGroup
                        :data="data.categories"
                        label-key="displayText"
                        read-only
                    >
                        <!-- TODO: Link the category on click action -->
                    </PillGroup>
                </div>
            </div>
        </template>
        <Pill :label="data.name" :has-action="false">
            <template #prefix>
                <AtlanIcon icon="Term"></AtlanIcon>
            </template>
        </Pill>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import Pill from '~/components/UI/pill/pill.vue'

    export default defineComponent({
        props: {
            data: { type: Object, required: true, default: () => {} },
        },
        components: { PillGroup, Pill },
        setup(props) {},
    })
</script>
