<template>
    <div class="flex justify-center h-screen">
        <div class="flex flex-col m-auto">
            <AtlanIcon icon="NoAccess" class="h-32" />
            <div class="leading-4 text-center text-gray-500 text">
                Oops, looks like you don't have access to view this page!
            </div>
            <AtlanButton2
                color="secondary"
                size="large"
                label="Take me home"
                @click="backToHome"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'

    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'NoAccess',
        components: { AtlanButton },
        props: {},
        setup() {
            const router = useRouter()

            const backToHome = () => {
                router.push('/')
            }

            return {
                backToHome,
            }
        },
    })
</script>
<style lang="less">
    .text {
        max-width: 216px;
        margin-top: 35px;
        margin-bottom: 1rem;
    }
</style>
