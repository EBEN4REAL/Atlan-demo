<template>
    <div class="flex justify-center h-screen">
        <div class="flex flex-col m-auto">
            <AtlanIcon icon="NoAccess" class="h-32" />
            <div class="leading-4 text-center text-gray-500 text">
                Oops, looks like you don't have access to view this page!
            </div>
            <router-link to="/">
                <AtlanButton2 color="secondary" label="Take me home" />
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({})
</script>
<style lang="less">
    .text {
        max-width: 216px;
        margin-top: 35px;
        margin-bottom: 1rem;
    }
</style>
