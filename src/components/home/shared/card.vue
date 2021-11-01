<template>
    <router-link :to="url">
        <div class="flex p-2 cursor-pointer gap-x-5 group hover:shadow hover:border-1">
            <div class="h-12">
                <AtlanIcon  class="h-full" :icon="icon"/>
            </div>
            <p class="relative flex flex-col text-gray-700 ">
                <h3 class="text-base">{{ head }}</h3>
                <AtlanIcon class="text-primary absolute right-0 top-1.5 opacity-0 group-hover:opacity-100" icon="ArrowRight"/>
                <span class="text-gray-500 " style="font-size: 12px;">{{ desc }}</span>
                
            </p>
        </div>
    </router-link>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            head: {
                type: String,
                required: true
            },
            desc: {
                type: String,
                required: false,
                default: ''
            },
            icon: {
                type: String,
                required: false,
                default: ''
            },
            clickable: {
                type: Boolean,
                defalt: false,
                required: false
            },
            url: {
                type: String,
                default: '',
                required: false
            }
        },
        setup() {
            return {}
        },
    })
</script>

<style scoped></style>
