<template>
    <div class="flex items-center justify-between h-24">
        <div class="flex justify-between w-full">
            <img
                v-if="logoUrl && !logoNotFound"
                :src="logoUrl"
                class="w-auto h-12"
                @error="onLogoNotFound"
            />
            <p
                v-else
                class="mb-auto text-2xl font-bold text-gray-600 bg-white cursor-pointer text-primary"
            >
                {{ logoName }}
            </p>
            <aside class="flex gap-6">
                <div v-for="m in metadata" :key="m.id" class="flex flex-col">
                    <span class="text-gray-500 uppercase">{{ m.label }}</span>
                    <span class="text-gray-700">{{ m.value || '-' }}</span>
                </div>
            </aside>
        </div>
    </div>

    <SearchAndFilter
        placeholder="Search across atlan..."
        class=""
        @click="showModal"
    />
    <!-- <CmndK
        :isCmndKVisible="isCmndKVisible"
        @closeModal="isCmndKVisible = false"
    /> -->

    <div class="flex items-center justify-end gap-1 mt-2">
        <router-link to="/assets" class="font-bold cursor-pointer text-primary">
            Discover assets
            <AtlanIcon icon="ArrowRight" />
        </router-link>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, watch, inject } from 'vue'
    import defaultLogo from '~/assets/images/your_company.png'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    // import CmndK from '~/components/common/commandK/cmndK.vue'
    import { getAggregations } from '~/composables/home/useHomeDSL'
    import { useTenantStore } from '~/store/tenant'

    export default defineComponent({
        name: 'SearchAndStats',
        components: {
            SearchAndFilter,
        },
        setup() {
            const toggleCMDK: Function = inject('togglecmdK')
            const tenantStore = useTenantStore()

            const showModal = (e) => {
                e.preventDefault()
                toggleCMDK()
            }
            const logoNotFound = ref(false)

            const logoUrl = computed(
                () => `${window.location.origin}/api/service/avatars/_logo_`
            )

            const logoName = computed(() => tenantStore.displayName)

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
                        // agg.key === 'atlasglossarycategory' ||
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
            const onLogoNotFound = () => {
                logoNotFound.value = true
            }

            return {
                logoUrl,
                metadata,
                showModal,
                defaultLogo,
                onLogoNotFound,
                logoName,
                logoNotFound,
            }
        },
    })
</script>
