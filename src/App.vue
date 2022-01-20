<template>
    <router-view />
    <!-- <div class="feedback-btn-wrapper" @click="toggleHelpWidget">
        <div id="feedback-btn">
            <img
                :src="Feedback"
                class="feedback-icon ml-2 mt-1 pb-1.5 pl-0.5 pt-1 w-3/6"
            />
        </div>
    </div> -->
</template>

<script lang="ts">
    import { defineComponent, ref, watch, inject, computed } from 'vue'
    import { useI18n } from 'vue-i18n'
    import useTypedefs from '~/composables/typedefs/useTypedefs'

    import useTenant from '~/composables/tenant/useTenant'
    import useConnection from '~/composables/connection/useConnection'
    import useIntegration from '~/composables/integrations/useIntegrations'
    import usePermissions from '~/composables/auth/usePermissions'
    import { useAuthStore } from './store/auth'
    import useGlossary from './composables/glossary2/useGlossary'
    import usePersona from './composables/persona/usePersona'
    import usePurpose from './composables/purpose/usePurpose'
    import Feedback from '~/assets/images/illustrations/feedback.svg?url'
    import useHelpWidget from '~/composables/helpCenter/useHelpWidget'

    export default defineComponent({
        setup(props, context) {
            const { toggleHelpWidget } = useHelpWidget()
            // const isPermissionsReady = ref(false)
            // const isTypedefReady = ref(false)

            const { locale, t } = useI18n({
                inheritLocale: true,
            })

            const authStore = useAuthStore()
            authStore.setUserDetails()

            // permissions
            usePermissions()

            // tenant
            useTenant()

            // typedefs
            useTypedefs()

            // // connections
            useConnection()

            // // glossary list
            useGlossary()

            useIntegration()

            usePersona()

            usePurpose()

            // watch([data], () => {
            //     isPermissionsReady.value = true
            // })
            // watch([typedef], () => {
            //     isTypedefReady.value = true
            // })

            return { locale, t, toggleHelpWidget, Feedback }
        },
    })
</script>
<style lang="less" scoped>
    .feedback-icon {
        transform: rotate(45deg);
    }
    #feedback-btn {
        z-index: 1030;
        position: fixed;
        bottom: 40px;
        right: 15px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #5277d7;
        -webkit-animation: 250ms ease 0s 1 normal none running animation-bhegco;
        animation: 250ms ease 0s 1 normal none running animation-bhegco;
        transition: opacity 0.3s ease 0s;
        cursor: pointer;
    }
    .feedback-btn-wrapper {
        position: fixed;
        bottom: -40px;
        right: -40px;
        z-index: 10000;
        width: 70px;
        height: 70px;
        box-shadow: rgba(0, 0, 0, 0.06) 0px 1px 6px 0px,
            rgba(0, 0, 0, 0.16) 0px 2px 32px 0px;
        background: #5277d7;
        animation: 250ms ease 0s 1 normal none running animation-bhegco;
        transition: opacity 0.3s ease 0s;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
    }
</style>
