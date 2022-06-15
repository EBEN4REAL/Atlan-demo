<template>
    <div class="flex flex-col p-6 gap-y-4">
        <!-- hidden for GA -->
        <div
            v-if="
                selectedAsset?.typeName === 'AtlasGlossaryTerm' &&
                (preferredTerms(selectedAsset)?.length ||
                    preferredToTerms(selectedAsset)?.length) &&
                showPreferredTerms
            "
            class="rounded-lg p-4 bg-white flex flex-wrap items-center"
        >
            <atlan-icon icon="Info" class="mx-1 mr-1.5 text-primary h-5" />
            <div>
                <div
                    v-if="preferredTerms(selectedAsset)?.length"
                    class="flex items-center flex-wrap"
                >
                    <div
                        v-for="(el, i) in preferredTerms(selectedAsset)"
                        :key="el?.guid"
                        class="ml-1"
                    >
                        <router-link
                            :to="`/glossary/${el?.guid}`"
                            class="font-bold text-primary hover:underline"
                        >
                            {{ el?.attributes?.name }}
                            <span
                                v-if="
                                    i !==
                                    preferredTerms(selectedAsset)?.length - 1
                                "
                                >,</span
                            >
                        </router-link>
                    </div>
                    <span class="mx-1"> is preferred over </span>

                    <router-link
                        :to="`/glossary/${selectedAsset?.guid}`"
                        class="font-bold text-primary hover:underline"
                    >
                        {{
                            selectedAsset?.attributes?.name ||
                            selectedAsset?.displayText
                        }}
                    </router-link>
                </div>
                <div
                    v-if="preferredToTerms(selectedAsset)?.length"
                    class="flex items-center flex-wrap"
                >
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
                    <span class="mx-1"> is preferred over </span>
                    <div
                        v-for="(el, i) in preferredToTerms(selectedAsset)"
                        :key="el?.guid"
                    >
                        <router-link
                            :to="`/glossary/${el?.guid}`"
                            class="font-bold text-primary hover:underline"
                        >
                            {{ el?.attributes?.name }}
                            <span
                                v-if="
                                    i !==
                                    preferredToTerms(selectedAsset)?.length - 1
                                "
                                >,</span
                            >
                        </router-link>
                    </div>
                </div>
            </div>
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
        <RelatedTermsWidget
            v-if="
                selectedAsset?.typeName === 'AtlasGlossaryTerm' &&
                (seeAlso(selectedAsset)?.length ||
                    antonyms(selectedAsset)?.length)
            "
            :asset="selectedAsset"
        />
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
        components: { AnnouncementWidget, Summary, RelatedTermsWidget },
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
            const { preferredTerms, seeAlso, antonyms, preferredToTerms } =
                useAssetInfo()
            return {
                showPreferredTerms,
                preferredTerms,
                preferredToTerms,
                antonyms,
                seeAlso,
            }
        },
    })
</script>
