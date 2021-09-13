<template>
    <div>
        <p class="mb-1 text-sm text-gray-500">Classification Details</p>
        <div class="flex flex-col pl-3 border-l-2 border-gray-300">
            <div class="flex items-center text-gray-500 gap-x-1">
                <AtlanIcon icon="Term" /> Term
            </div>
            <span class="text-base font-bold overflow-ellipsis text-gray"
                >{{ data?.name }}
            </span>
            <span
                v-if="data.shortDescription"
                class="text-sm text-gray-500 overflow-ellipsis"
                >{{ data.shortDescription }}
            </span>
            <p
                v-if="data.anchor"
                class="m-0 text-sm text-gray-500 overflow-ellipsis"
            >
                Glossary:
                <span class="text-gray">{{ data.anchor.displayText }}</span>
            </p>
        </div>
    </div>
    <!-- <div class="flex flex-col w-56">
        <div class="flex justify-between mb-2 text-sm">
            <span class="text-gray-500">TERM</span>
            <span v-if="data.isPropagated" class="text-primary"
                >Propagated</span
            >
        </div>
        <span class="mb-1 text-sm font-bold">{{ data.name }}</span>
       
        <span class="mb-4 text-xs text-gray-500">{{
            data.anchor.displayText
        }}</span>

        <div v-if="data?.shortDescription">
            <span class="mb-1 text-xs text-gray-500">Description</span>
            <span class="mb-4 text-sm">{{ data.shortDescription }}</span>
        </div>

        <div v-if="data?.categories?.length">
            <span class="mb-1 text-xs text-gray-500">Categories</span>
            <PillGroup
                :data="data.categories"
                label-key="displayText"
                read-only
            >
            </PillGroup>
        </div>
    </div> -->
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
