<template>
    <div class="flex px-5 py-3 border-b gap-x-3">
        <img v-if="icon" :src="icon" class="h-11 w-11" />
        <div class="w-full">
            <div class="flex items-center justify-between mb-0 text-sm">
                <div class="flex items-center flex-none">
                    <span
                        class="text-sm tracking-wider text-gray-700 uppercase"
                        >{{ type }}</span
                    >
                </div>
                <div v-if="showUtilityButtons" class="flex space-x-2">
                    <UtilityButtons :name="name" />
                </div>
            </div>
            <h3 class="text-lg font-bold text-primary">
                {{ name }}
            </h3>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import UtilityButtons from '@/workflows/shared/utilityButtons.vue'

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
            icon: {
                type: String,
                default: '',
            },
            logo: {
                type: String,
                default: '',
            },
            showUtilityButtons: {
                type: Boolean,
                default: true,
            },
        },
    })
</script>
