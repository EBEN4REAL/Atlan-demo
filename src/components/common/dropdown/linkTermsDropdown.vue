<template>
    <div class="flex flex-col overflow-y-auto w-72">
        <div v-if="!showLinkTermPopover">
            <p class="mb-2 text-sm text-gray-700">Link Terms</p>
            <a-select
                v-model:value="selectedTermNames"
                mode="multiple"
                :allow-clear="true"
                :autofocus="true"
                :show-search="true"
                placeholder="Search for terms"
                :loading="searchLoading"
                @change="emitTermsData"
            >
                <!-- term list -->
                <template v-for="term in termsList" :key="term.guid">
                    <a-select-option :value="term.guid">{{
                        term.displayText
                    }}</a-select-option>
                </template>
            </a-select>
        </div>
        <div v-else>
            <p v-if="searchLoading">loading</p>

            <p v-else class="mb-2 text-sm text-gray-700">No data</p>
            <p v-if="createErrorText" class="mt-4 mb-0 text-sm text-red-500">
                {{ createErrorText }}
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import {
    computed,
    defineComponent,
    PropType,
    ref,
    toRefs,
    Ref,
    watch,
} from 'vue'
import useGtcSearch from '~/components/glossary/composables/useGtcSearch'
import { Components } from '~/api/atlas/client'

export default defineComponent({
    name: 'LinkTermsDropdown',
    props: {
        // if not provided it shows all the classifications in the store
        availableTermsList: {
            type: Array as unknown as PropType<
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[]
            >,
            default: () => [],
        },
        selectedTermsList: {
            type: Array as unknown as PropType<
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[]
            >,
            default: () => [],
        },
    },
    emits: ['changeTerms'],
    setup(props, { emit }) {
        const showLinkTermPopover = ref(false)
        const { terms, isLoading: searchLoading } = useGtcSearch(
            undefined,
            ref(true),
            'AtlasGlossaryTerm'
        ) // gets all the terms using basic search
        const { availableTermsList, selectedTermsList } = toRefs(props)
        const termsList = ref(
            availableTermsList?.value.length
                ? [...availableTermsList.value]
                : [...terms.value]
        )
        const createErrorText = ref('')
        const selectedTermNames: Ref<string[]> = ref([])
        const termNameMap = computed(() => {
            const termMap: Record<
                string,
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[]
            > = {}
            termsList.value?.forEach((term) => {
                termMap[term.guid || term.termGuid] = term
            })
            return termMap
        })
        const selectedTerms: Ref<Components.Schemas.AtlasClassification[]> =
            ref([])
        // initialise with selcted classifcations from props, if present
        selectedTermNames.value = [
            ...selectedTermsList.value.map(
                (term) => term?.guid || term?.termGuid
            ),
        ]
        const emitTermsData = () => {
            selectedTerms.value = [
                ...selectedTermNames.value.map(
                    (term) => termNameMap.value[term]
                ),
            ]
            emit('changeTerms', selectedTerms)
        }
        const clearSelection = () => {
            selectedTermNames.value = []
            selectedTerms.value = []
        }
        const updateAvailableTerms = () => {
            termsList.value = [...terms.value]
        }
        //  watchers
        watch(
            terms,
            () => {
                // updated with fetched terms only if no terms are passed as props.
                // ideally it wouldn't even fetch the terms if this is the case
                if (!availableTermsList?.value.length) updateAvailableTerms()
            },
            { immediate: true }
        )
        return {
            selectedTermNames,
            createErrorText,
            emitTermsData,
            termsList,
            termNameMap,
            selectedTerms,
            clearSelection,
            searchLoading,
        }
    },
})
</script>

<style lang="less" module>
.borderless {
    @apply border-none shadow-none px-4 !important;

    &:global(.ant-input-affix-wrapper-focused) {
        @apply border-none shadow-none;
    }
}
:global(.ant-form-item-label
        > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
    @apply hidden;
}
// Aesterik in right side
:global(.ant-form-item-label
        > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
    display: inline-block;
    margin-left: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
}
</style>
<style lang="less" scoped>
._bg-primary-light {
    background: rgba(34, 81, 204, 0.05);
}
.classification-cross-btn {
    height: 100%;
    right: 6px;
    @apply -top-0;
    background: linear-gradient(
        -90deg,
        rgba(82, 119, 215, 1) 60%,
        rgba(0, 0, 0, 0) 100%
    );
}
.classification-name-width {
    max-width: 12rem;
}
</style>