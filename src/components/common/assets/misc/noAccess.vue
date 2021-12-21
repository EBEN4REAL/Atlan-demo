<template>
    <div class="flex items-center justify-center h-full">
        <div class="flex flex-col">
            <AtlanIcon icon="NoAccess" class="h-32" />
            <div class="leading-4 text-center text-gray-500 text">
                Oops, looks like you don't have access to view this asset!
            </div>
            <AtlanButton v-if="backButton" color="primary" @click="backToHome"
                >Take me home</AtlanButton
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        components: { AtlanButton },
        props: {
            backButton: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
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
