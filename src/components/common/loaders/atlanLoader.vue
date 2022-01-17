<template>
    <img :src="Loader" :style="{ height: '1rem' }" class="inline w-auto" />
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
