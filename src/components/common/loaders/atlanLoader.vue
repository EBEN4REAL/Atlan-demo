<template>
    <img :src="Loader" class="inline w-auto h-4" />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Loader from '~/assets/images/icons/loader.svg?url'

    export default defineComponent({
        name: 'AtlanLoader',
        setup() {
            return { Loader }
        },
    })
</script>
