<template>
    <a-modal title="Details">
        <template #footer>
            <a-button key="back" @click="">Return</a-button>
            <a-button key="submit" type="primary">Submit</a-button>
        </template>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'RequestDetails',
        props: {},

        setup(props, { emit }) {
            return {}
        },
    })
</script>
