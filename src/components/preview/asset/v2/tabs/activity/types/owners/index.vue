<template>
    <span
        >Say 👋 Hello, to the newly added
        {{ data.value.length > 1 ? 'Owners' : 'Owner' }}.</span
    >
    <ul v-for="(user, index) in data.value" :key="index">
        <li>{{ user }}></li>
    </ul>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            data,
        },
    })
</script>

<style lang="less" scoped></style>
