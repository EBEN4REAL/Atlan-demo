<template>
    <div
        class="w-full px-4 py-3 border-b border-gray-300 bg-gray-100"
        style="min-width: 374px"
    >
        <div class="flex w-full align-center items-center">
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
            <a-button
                class="px-1.5 py-1 ml-auto"
                @click="$emit('togglePreview')"
            >
                <AtlanIcon icon="SidebarSwitch" style="height: auto" />
            </a-button>
        </div>
        <div
            class="my-3 mt-1.5 flex align-center items-center text-gray-700 text-sm"
        >
            <AtlanIcon :icon="primaryIcon" class="h-4" />
            <span class="ml-1.5 uppercase">
                {{ isTerm ? 'Term' : 'Category' }}
            </span>
            <span v-if="anchorAttributes?.name" class="ml-2">in</span>
            <AtlanIcon
                v-if="anchorAttributes?.name"
                class="ml-2 h-4"
                icon="Glossary"
            />
            <span v-if="anchorAttributes?.name" class="ml-1.5">
                {{ anchorAttributes?.name }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    export default {
        name: 'GlossaryPopoverHeader',
        components: {
            CertificateBadge,
        },
    }
</script>

<script setup lang="ts">
    import { computed, PropType, ref, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { Category, Term } from '~/types/glossary/glossary.interface'

    const props = defineProps({
        term: {
            type: Object,
            required: true,
        },
    })

    const { term } = toRefs(props)
    const {
        certificateStatus,
        certificateUpdatedBy,
        certificateUpdatedAt,
        anchorAttributes: getAnchorAttributes,
    } = useAssetInfo()

    const anchorAttributes = computed(() => getAnchorAttributes(term?.value))

    const isTerm = computed(
        () => term?.value && term?.value.typeName === 'AtlasGlossaryTerm'
    )
    const primaryIcon = computed(() => (isTerm.value ? 'Term' : 'Category'))
</script>

<style scoped></style>
