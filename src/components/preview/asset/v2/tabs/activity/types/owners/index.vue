<template>
    <span
        >Say 👋 Hello, to the newly added
        {{ data.value.length > 1 ? 'Owners' : 'Owner' }}</span
    >
    <ul v-for="(user, index) in data.value" :key="index" class="my-1">
        <li class="flex items-center">
            <avatar
                :avatar-name="user"
                avatar-shape="circle"
                :avatar-size="28"
                class="mx-2"
            /><span class="font-bold">{{ user }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Avatar from '~/components/common/avatar.vue'

    export default defineComponent({
        components: { Avatar },
        props: {
            data,
        },
    })
</script>

<style lang="less" scoped></style>
