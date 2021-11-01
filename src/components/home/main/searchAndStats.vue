<template>
   <p class="flex items-center justify-between h-24">
        <img :src="logoUrl" class="w-auto h-12 " />
        <aside class="flex gap-6">
            <div v-for="m in metadata" :key="m.id" class="flex flex-col">
                <span class="text-gray-500 uppercase">{{m.label}}</span>
                <span class="text-gray-700">{{m.value || '-'}}</span>
            </div>
            
        </aside>
    </p>

    <SearchAndFilter
        placeholder="Search accross atlan..."
        class=""
        @click="showModal"
    />
    <CmndK
        :isCmndKVisible="isCmndKVisible"
        @closeModal="isCmndKVisible = false"
    />
    
    <router-link to="/assets" class="flex items-center justify-end gap-1 mt-2 font-bold cursor-pointer text-primary">Discover assets <AtlanIcon icon="ArrowRight"/></router-link>
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { metadata } from './metadata'
    import useIndexSearch from '~/composables/reporting/useIndexSearch'
    import CmndK from '~/components/common/commandK/cmndK.vue'

    export default defineComponent({
        name: "SearchAndStats",
        components: {
                SearchAndFilter,
                CmndK,
            },
        setup() {
                const isCmndKVisible = ref<boolean>(false)
                const showModal = () => {
                    isCmndKVisible.value = true
                }

            const logoUrl = computed(
                    () => `${window.location.origin}/api/service/avatars/_logo_`
                )

            return {logoUrl, metadata ,showModal ,isCmndKVisible}
        }
    })
</script>