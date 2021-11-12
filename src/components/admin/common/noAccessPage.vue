<template>
    <div class="flex h-screen justify-center">
        <div class="flex flex-col m-auto">
            <AtlanIcon icon="NoAccess" class="h-32"/>
            <div class="text text-gray-500 text-center leading-4">Oops, looks like you don't have access to view this page!</div>
            <AtlanButton color="secondary" @onClick="backToHome">Take me home</AtlanButton>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanButton from '@/UI/button.vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        props: {  },
        components: {AtlanButton},
        setup() {
            const router = useRouter();

            const backToHome = () => {
                router.push('/')
            }

            return {
                backToHome
            }
        }
    })
</script>
<style lang="less">
    .text {
        max-width: 216px;
        margin-top: 35px;
        margin-bottom: 1rem;
    }
</style>