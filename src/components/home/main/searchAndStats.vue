<template>
    <div class="flex items-center justify-between h-24">
        <img
            :src="logoUrl"
            class="w-auto h-12"
            @error="(e: any) => e.target.src = defaultLogo"
        />
        <aside class="flex gap-6">
            <div v-for="m in metadata" :key="m.id" class="flex flex-col">
                <span class="text-gray-500 uppercase">{{ m.label }}</span>
                <span class="text-gray-700">{{ m.value || '-' }}</span>
            </div>
        </aside>
    </div>

    <SearchAndFilter
        placeholder="Search accross atlan..."
        class=""
        @click="showModal"
    />
    <!-- <CmndK
        :isCmndKVisible="isCmndKVisible"
        @closeModal="isCmndKVisible = false"
    /> -->

    <router-link
        to="/assets"
        class="flex items-center justify-end gap-1 mt-2 font-bold cursor-pointer  text-primary"
        >Discover assets <AtlanIcon icon="ArrowRight"
    /></router-link>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, watch } from 'vue'
    import defaultLogo from '~/assets/images/your_company.png'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    // import CmndK from '~/components/common/commandK/cmndK.vue'
    import { getAggregations } from '~/composables/home/useHomeDSL'

    export default defineComponent({
        name: 'SearchAndStats',
        components: {
            SearchAndFilter,
        },
        setup() {
            const isCmndKVisible = ref<boolean>(false)
            const showModal = () => {
                isCmndKVisible.value = true
            }

            const logoUrl = computed(
                () => `${window.location.origin}/api/service/avatars/_logo_`
            )

            const metadata = ref([
                {
                    id: 'connections',
                    label: 'CONNECTIONS',
                    value: 0,
                },
                {
                    id: 'SQLAssets',
                    label: 'SQL Assets',
                    value: 0,
                },
                {
                    id: 'businessTerms',
                    label: 'Business Terms',
                    value: 0,
                },
            ])

            const { list } = getAggregations([
                'Connection',
                'Table',
                'View',
                'AtlasGlossaryTerm',
                'AtlasGlossaryCategory',
            ])

            watch(list, () => {
                list.value.map((agg) => {
                    if (agg.key === 'connection') {
                        metadata.value.map((obj) => {
                            if (obj.id === 'connections') {
                                obj.value += agg.doc_count
                            }
                        })
                    } else if (agg.key === 'table' || agg.key === 'view') {
                        metadata.value.map((obj) => {
                            if (obj.id === 'SQLAssets') {
                                obj.value += agg.doc_count
                            }
                        })
                    } else if (
                        agg.key === 'atlasglossarycategory' ||
                        agg.key === 'atlasglossaryterm'
                    ) {
                        metadata.value.map((obj) => {
                            if (obj.id === 'businessTerms') {
                                obj.value += agg.doc_count
                            }
                        })
                    }
                })
            })

            return { logoUrl, metadata, showModal, isCmndKVisible, defaultLogo }
        },
    })
</script>
