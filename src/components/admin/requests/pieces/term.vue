<template>
    <PillGroup
        :data="[data]"
        label-key="name"
        popover-trigger="hover"
        read-only
    >
        <template #pillPrefix>
            <AtlanIcon icon="Term"></AtlanIcon>
        </template>
        <template #popover="{ item }">
            <div class="flex flex-col w-56">
                <div class="flex justify-between mb-2 text-sm">
                    <span class="text-gray-500">TERM</span>
                    <span v-if="item.isPropagated" class="text-primary"
                        >Propagated</span
                    >
                </div>
                <span class="mb-1 text-sm font-bold">{{ item.name }}</span>
                <!-- TODO: Change this to a link to the specified glossary -->
                <span
                    v-if="item.anchor?.displayText"
                    class="mb-4 text-xs text-gray-500"
                    >{{ item.anchor.displayText }}</span
                >

                <template v-if="item?.shortDescription">
                    <span class="mb-1 text-xs text-gray-500">Description</span>
                    <span class="mb-4 text-sm">{{
                        item.shortDescription
                    }}</span>
                </template>

                <div v-if="item?.categories?.length">
                    <span class="mb-1 text-xs text-gray-500">Categories</span>
                    <PillGroup
                        :data="item.categories"
                        label-key="displayText"
                        read-only
                    >
                        <!-- Link the category on click action -->
                    </PillGroup>
                </div>
            </div>
        </template>
    </PillGroup>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import PillGroup from '~/components/UI/pill/pillGroup.vue'

    export default defineComponent({
        props: {
            data: { type: Object, required: true, default: () => {} },
        },
        components: { PillGroup },
        setup(props) {},
    })
</script>
