<template>
    <div class="flex items-center py-2 cursor-pointer hover:bg-gray-100">
        <div>
            <atlan-icon
                v-if="item?.typeName === 'AtlasGlossaryTerm'"
                icon="Term"
                class="w-auto h-5 text-primary"
            />
            <atlan-icon
                v-if="item?.typeName === 'AtlasGlossary'"
                icon="Glossary"
                class="w-auto h-5"
            />

            <atlan-icon
                v-if="item?.typeName === 'AtlasGlossaryCategory'"
                icon="Category"
                class="w-auto h-5"
            />
        </div>

        <div class="flex flex-col py-1 ml-3">
            <span class="flex items-center space-x-2"
                >{{ item.displayText }}
                <CertificateBadge
                    :key="item?.guid"
                    :status-id="item?.attributes?.certificateStatus"
                    :show-chip-style-status="false"
                    :show-label="false"
                    class="p-0 ml-2"
                ></CertificateBadge>
            </span>
            <div class="flex items-cener mt-0.5">
                <span class="text-xs text-gray-500"
                    >{{ gtcTypeLabel[item?.typeName].toUpperCase() }}
                </span>
                <div class="w-1 h-1 mx-2 mt-1 bg-gray-500 rounded-full"></div>
                <span
                    v-if="
                        item?.typeName !== 'AtlasGlossary' &&
                        item?.attributes?.anchor?.attributes?.name?.length
                    "
                    class="text-xs text-gray-500"
                >
                    {{ item?.attributes?.anchor?.attributes?.name }}
                    Glossary
                </span>
                <span v-else class="text-xs text-gray-500">
                    {{ item?.attributes?.terms?.length }}
                    Terms,
                    {{ item?.attributes?.categories?.length }}
                    Categories
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, inject } from 'vue'
    import { useRouter } from 'vue-router'
    // components
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    // utils
    // import redirect from '@/glossary/utils/redirectToProfile'
    import gtcTypeLabel from '~/constant/gtcTypeLabel'

    export default defineComponent({
        components: {
            CertificateBadge,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        setup() {
            const router = useRouter()
            // TODO: Uncomment when redirecting to glossary profiles
            // const redirectToProfile = redirect(router)

            return {
                gtcTypeLabel,
            }
        },
    })
</script>
