<template>
    <div>Home</div>
</template>

<script lang="ts">
    import { useHead } from '@vueuse/head'
    import { defineComponent } from 'vue'
    import useUserData from '~/composables/user/useUserData'
    import { getNameInTitleCase } from '~/utils/string'

    export default defineComponent({
        name: 'HelloWorld',
        components: {},
        props: {},
        setup() {
            const { name } = useUserData()

            useHead({
                title: `Welcome - ${getNameInTitleCase(name)} `,
            })
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
