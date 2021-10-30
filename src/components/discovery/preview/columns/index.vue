<template>
    <div>
        <div class="px-3 py-1 border-b border-gray-200">
            <SearchAdvanced v-model:value="queryText" :autofocus="true">
                <template #postFilter>
                    <Preferences />
                </template>
            </SearchAdvanced>

            {{ list }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Preferences from '@/discovery/preference.vue'
    import { useColumnListing } from '~/composables/discovery/useColumnListing'
    import {
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        components: {
            SearchAdvanced,
            Preferences,
        },
        setup(props, { emit }) {
            const queryText = ref('')
            const limit = ref(20)
            const offset = ref(0)
            const facetMap = ref({})
            const totalCount = ref(0)
            const cacheKey = ref('DEFAULT_COLUMNS')

            if (!facetMap.value.dataType) {
                facetMap.value.dataType = '__all'
            }

            const { list } = useColumnListing(
                cacheKey,
                queryText,
                facetMap,
                limit,
                offset,
                totalCount,
                [...InternalAttributes, ...SQLAttributes],
                [...AssetRelationAttributes]
            )

            return {
                list,
            }
        },
    })
</script>
