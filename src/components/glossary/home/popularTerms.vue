<template>
    <div class="w-2/3 mt-5">
        <span class="self-start text-lg font-bold">Popular Terms</span>
        <div v-if="isLoading" class="flex justify-center w-full">
            <a-spin size="small" class="mt-2 mr-2 leading-none"></a-spin>
        </div>
        <div
            v-else
            class="flex flex-wrap items-center justify-center pt-4"
            :class="$style.menuClasses"
        >
            <template v-for="item in popularTerms" :key="item.guid">
                <div
                    class="
                        flex
                        items-center
                        px-3
                        py-1
                        m-2
                        bg-white
                        border
                        cursor-pointer
                        rounded-2xl
                    "
                    @click="redirectToProfile(item.typeName, item.guid)"
                >
                    <atlan-icon
                        :icon="
                            getEntityStatusIcon(
                                'term',
                                item.attributes.certificateStatus
                            )
                        "
                        class="w-auto h-4 mr-1"
                    />
                    {{ item.displayText }}
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    // components
    import LoadingView from '@common/loaders/page.vue'
    // composables
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'
    // utils
    import getEntityStatusIcon from '@/glossary/utils/getEntityStatusIcon'
    import redirect from '@/glossary/utils/redirectToProfile';

    export default defineComponent({
        components: { LoadingView },
        setup() {
            const searchQuery = ref<string>()
            const router = useRouter()
            const { entities, isLoading, fetchAssetsPaginated } = useGtcSearch(
                undefined,
                ref(true),
                'AtlasGlossaryTerm',
                15
            )

            const popularTerms = computed(() => entities.value.slice(-12))

            const onSearch = useDebounceFn(() => {
                fetchAssetsPaginated({
                    query: `${searchQuery.value ? `${searchQuery.value}` : ''}`,
                    offset: 0,
                })
            }, 400)
            const redirectToProfile = redirect(router)

            return {
                entities,
                onSearch,
                searchQuery,
                redirectToProfile,
                isLoading,
                popularTerms,
                getEntityStatusIcon,
            }
        },
    })
</script>
<style lang="less" module>
    .menuClasses {
        :global(.ant-dropdown-menu-item) {
            @apply bg-gray-100 !important;
        }
    }
</style>
