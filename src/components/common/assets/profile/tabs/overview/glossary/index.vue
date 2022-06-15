<template>
    <div class="flex flex-col p-6 gap-y-4">
        <!-- hidden for GA -->
        <!-- <BulkUploadProgress
            v-if="selectedAsset?.typeName === 'AtlasGlossary'"
            :entity="selectedAsset"
        /> -->
        <div
            class="rounded-lg p-4 bg-white flex flex-wrap items-center"
        >
            <atlan-icon icon="Info" class="mx-1 text-primary" />
            <router-link
                :to="`/glossary/${selectedAsset?.guid}`"
                class="font-bold text-primary hover:underline mx-1"
            >
                {{
                    selectedAsset?.attributes?.name ||
                    selectedAsset?.displayText
                }}
            </router-link>
            <div
                v-for="el in preferredTerms(selectedAsset)"
                :key="el?.guid"
                class="mx-1"
            >
                <router-link
                    :to="`/glossary/${el?.guid}`"
                    class="font-bold text-primary hover:underline"
                >
                    {{ el?.attributes?.name }}
                </router-link>
            </div>

            is preferred over
            <div
                v-for="el in preferredToTerms(selectedAsset)"
                :key="el?.guid"
                class="ml-1"
            >
                <router-link
                    :to="`/glossary/${el?.guid}`"
                    class="font-bold text-primary hover:underline"
                >
                    {{ el?.attributes?.name }}
                </router-link>
            </div>
            <span class="mx-1">
                <router-link
                    :to="`/glossary/${selectedAsset?.guid}`"
                    class="font-bold text-primary hover:underline"
                >
                    {{
                        selectedAsset?.attributes?.name ||
                        selectedAsset?.displayText
                    }}
                </router-link>
            </span>
        </div>
        <Summary :asset="selectedAsset">
            <template #announcement>
                <AnnouncementWidget
                    :selected-asset="selectedAsset"
                    class="mb-4"
                ></AnnouncementWidget>
            </template>
        </Summary>
        <slot name="readme"></slot>
        <RelatedTermsWidget :asset="selectedAsset"/>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed } from 'vue'

    import Summary from '@common/widgets/summary/index.vue'
    import RelatedTermsWidget from '@common/widgets/relatedTerms.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import BulkUploadProgress from '~/components/common/widgets/bulkUploadProgress/progressWidget.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import {
        featureEnabledMap,
        PREFERRED_TERMS,
    } from '~/composables/labs/labFeatureList'

    export default defineComponent({
        name: 'GlossaryOverview',
        components: { AnnouncementWidget, Summary,  RelatedTermsWidget },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            readmeEditPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const showPreferredTerms = computed(
                () => featureEnabledMap.value[PREFERRED_TERMS]
            )
            const { preferredTerms, preferredToTerms } = useAssetInfo()
            return { showPreferredTerms, preferredTerms, preferredToTerms }
        },
    })
</script>
