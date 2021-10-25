<template>
    <div>
        <div
            v-if="showConfigOptions"
            class="flex flex-col items-center justify-center h-64 px-10 m-auto text-center bg-white border rounded  configure-wrapper"
        >
            <span class="mb-8 text-lg text-center text-gray">
                Choose your SAML provider
            </span>

            <div class="flex justify-center w-full">
                <div
                    v-for="(provider, index) in samlProviders"
                    :key="provider.alias"
                    class="py-5 border rounded-sm cursor-pointer  provider-wrapper"
                    @click="setSelectedOption(provider.alias)"
                    :class="[
                        index !== samlProviders.length - 1 ? 'mr-4' : '',
                        selectedOption === provider.alias
                            ? 'bg-primary-light border rounded border-primary'
                            : '',
                    ]"
                >
                    <div class="flex flex-col justify-center">
                        <img
                            v-if="!provider.isCustomSaml"
                            :src="provider.image"
                            :alt="provider.title"
                            class="self-center w-4 h-4 mb-2"
                        />
                        <AtlanIcon
                            v-else
                            icon="PrimaryKey"
                            class="self-center mb-2 text-alert"
                        />

                        <span>{{ provider.title }}</span>
                    </div>
                </div>
            </div>
            <div class="flex justify-end w-full mt-6">
                <AtlanBtn
                    @click="configureSSO"
                    :disabled="!selectedOption"
                    padding="compact"
                    :bold="true"
                    :class="
                        !selectedOption
                            ? 'bg-gray-300 text-white border-gray-300'
                            : 'bg-primary text-white border-primary'
                    "
                >
                    Configure</AtlanBtn
                >
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import emptySSOImage from '~/assets/images/emptyCreds.png'
import ConfigureNewSSO from './configureNewSSO.vue'
import { useRouter } from 'vue-router'
import { topSAMLProviders, customSamlProvider } from '~/constant/saml'
import AtlanBtn from '@/UI/button.vue'

export default defineComponent({
    components: { ConfigureNewSSO, AtlanBtn },
    setup() {
        const router = useRouter()
        const showConfigOptions = ref(true)
        const selectedOption = ref('')

        const setSelectedOption = (option: string) => {
            selectedOption.value = option
        }
        const configureSSO = () => {
            showConfigOptions.value = false
            router.push(`/admin/sso/configure/${selectedOption.value}`)
        }
        const showConfigScreen = () => {
            showConfigOptions.value = true
            selectedOption.value = ''
        }

        const samlProviders = computed(() => {
            return [
                ...topSAMLProviders,
                { ...customSamlProvider, alias: 'custom' },
            ]
        })
        return {
            emptySSOImage,
            configureSSO,
            showConfigOptions,
            selectedOption,
            showConfigScreen,
            samlProviders,
            setSelectedOption,
        }
    },
})
</script>
<style lang="less">
.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
    @apply text-gray-500 !important;
}
.configure-wrapper {
    max-width: 43.5rem;
    max-height: 17rem;
    .provider-wrapper {
        width: 8.75rem;
    }
}
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>