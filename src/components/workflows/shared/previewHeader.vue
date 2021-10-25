<template>
    <div class="flex px-5 py-3 border-b gap-x-3">
        <div class="flex items-center mb-0 overflow-hidden">
            <div class="pr-3">
                <img :src="icon" class="w-10 h-auto" />
            </div>
            <div class="flex flex-col">
                <p
                    class="flex-shrink mb-0 overflow-hidden text-base font-bold truncate cursor-pointer  text-primary overflow-ellipsis whitespace-nowrap"
                >
                    {{ name }}
                </p>
                <div class="leading-none text-gray-500 uppercase">
                    CONNECTOR
                </div>
            </div>
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
