<template>
    <div class="flex items-center border rounded bg-blue-50 border-primary">
        <AtlanIcon class="mx-7 h-9" icon="Annoucement"/>
        <p class="flex flex-col text-gray-700 gap-y-1.5 my-5">
            <h3 class="text-lg font-bold">Company Level Announcement</h3>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi dolorum quo obcaecati necessitatibus! Assumenda sunt, optio quo facere error vel doloribus accusamus, fuga eligendi atque asperiores ad mollitia id expedita?</span>
            <div class="text-sm">
                <span >Shreyas Gupta</span>
                <span class="ml-1 text-gray-500">12 Jan 2021</span>
            </div>
        </p>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    
    export default defineComponent({
        name: "Annoucements",
        setup() {
            return {}
        },
    })
</script>

<style scoped></style>
