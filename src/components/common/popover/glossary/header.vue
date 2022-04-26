<template>
    <div class="w-full px-4 py-3 border-b border-gray-300 bg-gray-100">
        <div class="flex w-full content-center items-center">
            <span
                class="text-lg font-gray-700 font-bold max-w-xs truncate mr-1"
            >
                {{ term?.displayText }}
            </span>
            <CertificateBadge
                v-if="certificateStatus(term)"
                :status="certificateStatus(term)"
                :username="certificateUpdatedBy(term)"
                :timestamp="certificateUpdatedAt(term)"
            />
            <AtlanButton
                v-if="showDrawerToggle"
                size="icn"
                color="secondary"
                padding="icon"
                class="ml-auto"
                @click="
                    () => {
                        isTermDrawerVisible = true
                    }
                "
            >
                <AtlanIcon icon="SidebarSwitch" style="height: auto" />
            </AtlanButton>
        </div>
        <div class="mt-1.5 text-gray-700 text-sm break-all">
            <AtlanIcon :icon="icon" />
            <span class="ml-1.5 uppercase">
                {{ typeName }}
            </span>
            <span v-if="anchorAttributes?.name" class="ml-2">in</span>
            <AtlanIcon
                v-if="anchorAttributes?.name"
                class="ml-2 mr-1.5"
                icon="Glossary"
            />
            <span v-if="anchorAttributes?.name">
                {{ anchorAttributes?.name }}
            </span>
        </div>
    </div>
    <AssetDrawer
        :data="term"
        :show-drawer="isTermDrawerVisible"
        :show-close-btn="isTermDrawerVisible"
        @close-drawer="
            () => {
                isTermDrawerVisible = false
            }
        "
    />
</template>

<script lang="ts">
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import { defineAsyncComponent } from 'vue'

    export default {
        name: 'GlossaryPopoverHeader',
        components: {
            CertificateBadge,
            AssetDrawer: defineAsyncComponent(
                () => import('@/common/assets/preview/drawer.vue')
            ),
        },
    }
</script>

<script setup lang="ts">
    import { computed, PropType, ref, toRefs, watch } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { Category, Term } from '~/types/glossary/glossary.interface'

    const props = defineProps({
        term: {
            type: Object,
            required: true,
        },
        showDrawerToggle: {
            type: Boolean,
            required: false,
            default: () => true,
        },
    })

    const { term, showDrawerToggle } = toRefs(props)
    const {
        certificateStatus,
        certificateUpdatedBy,
        certificateUpdatedAt,
        anchorAttributes: getAnchorAttributes,
    } = useAssetInfo()

    const isTermDrawerVisible = ref(false)

    const anchorAttributes = computed(() => getAnchorAttributes(term?.value))

    const isTerm = computed(
        () => term?.value && term?.value.typeName === 'AtlasGlossaryTerm'
    )
    const typeName = computed(() => {
        switch (term?.value?.typeName) {
            case 'AtlasGlossaryTerm':
                return 'Term'
            case 'AtlasGlossaryCategory':
                return 'Category'
            case 'AtlasGlossary':
                return 'Glossary'
        }
    })

    const icon = computed(() => {
        switch (term?.value?.typeName) {
            case 'AtlasGlossaryTerm':
                return 'Term'
            case 'AtlasGlossaryCategory':
                return 'CategoryShaded'
            case 'AtlasGlossary':
                return 'Glossary'
        }
    })
</script>

<style scoped></style>
