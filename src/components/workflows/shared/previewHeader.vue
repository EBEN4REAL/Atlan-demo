<template>
    <div class="px-5 py-3 border-b">
        <div class="flex items-center justify-between mb-0 text-sm">
            <div class="flex items-center flex-none">
                <span class="text-sm tracking-wider text-gray-700 uppercase">{{
                    type
                }}</span>
            </div>
            <div v-if="showUtilityButtons" class="flex space-x-2">
                <UtilityButtons />
            </div>
        </div>
        <h3 class="text-lg font-bold text-primary">
            {{ name }}
        </h3>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import UtilityButtons from './utilityButtons.vue'

    export default defineComponent({
        components: { UtilityButtons },
        props: {
            type: {
                type: String,
                default: 'enter tyoe here',
            },
            name: {
                type: String,
                default: 'enter name here',
            },
            showUtilityButtons: {
                type: Boolean,
                default: true,
            },
        },
    })
</script>
