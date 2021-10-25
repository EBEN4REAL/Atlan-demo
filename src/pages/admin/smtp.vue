<template>
    <SmtpForm />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import SmtpForm from '@/admin/smtp/smtpForm.vue'
    import { useHead } from '@vueuse/head'
    import useAuth from '~/services2/service/composable/useAuth'

    export default defineComponent({
        components: {
            SmtpForm,
        },
        setup() {
            useHead({
                title: 'SMTP',
            })
            const { isAccess } = useAuth()
            return { isAccess }
        },
    })
</script>
<style lang="less" module></style>
