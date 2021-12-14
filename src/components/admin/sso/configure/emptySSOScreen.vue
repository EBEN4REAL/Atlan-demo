<template>
    <div>
        <div
            v-if="showConfigOptions"
            class="m-auto"
        >
            <span class="text-2xl text-gray">
                Choose SAML provider
            </span>

            <div class="flex flex-col justify-center w-full mt-6">
                <div
                    v-for="(provider, index) in samlProviders"
                    :key="provider.alias"
                    class="p-4 mb-3 border border-gray-200 rounded cursor-pointer provider-wrapper"
                    :class="[
                        index !== samlProviders.length - 1 ? '' : '',
                        selectedOption === provider.alias
                            ? 'bg-primary-light border rounded border-primary'
                            : '',
                    ]"
                    @click="setSelectedOption(provider.alias)"
                >
                    <div class="flex items-center">
                        <img
                            v-if="!provider.isCustomSaml"
                            :src="provider.image"
                            :alt="provider.title"
                            class="w-6 h-6 mr-5"
                        />
                        <AtlanIcon
                            v-else
                            icon="CustomSaml"
                            class="h-6 mr-5"
                        />

                        <span class="text-lg font-bold">{{ provider.title }}</span>
                    </div>
                </div>
            </div>
            <div class="flex justify-end w-full mt-6">
                <AtlanBtn
                    :disabled="!selectedOption"
                    padding="compact"
                    :bold="true"
                    :class="
                        !selectedOption
                            ? 'bg-gray-300 text-white border-gray-300'
                            : 'bg-primary text-white border-primary'
                    "
                    @click="configureSSO"
                >
                    Configure
                    <template v-slot:suffix>
                        <AtlanIcon
                            icon="ArrowRight"
                        ></AtlanIcon>
                    </template>
                </AtlanBtn
                >
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import emptySSOImage from '~/assets/images/emptyCreds.png'

import { topSAMLProviders, customSamlProvider } from '~/constant/saml'
import AtlanBtn from '@/UI/button.vue'

export default defineComponent({
    components: { AtlanBtn },
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

        const samlProviders = computed(() => [
            ...topSAMLProviders,
            { ...customSamlProvider, alias: 'custom' },
        ])
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
</style>
<style lang="less" scoped>
.provider-wrapper {
    width: 546px;
}
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>