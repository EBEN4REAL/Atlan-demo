<template>
    <div class="flex items-start justify-between parent-ellipsis-container">
        <div class="flex flex-col parent-ellipsis-container-base">
            <div class="flex items-center">
                <component
                    v-if="
                        suggestion?.documentation?.entity?.typeName === 'Column'
                    "
                    :is="getSuggestionsListIcon(suggestion)"
                    class="h-4 text-gray-500 mr-1.5"
                    style="min-width: 16px"
                />
                <AtlanIcon
                    v-else
                    :icon="getSuggestionsListIcon(suggestion)"
                    class="mr-1.5 parent-ellipsis-container-extension"
                    style="min-width: 16px"
                    :class="suggestion.iconClass"
                ></AtlanIcon
                ><span
                    class="text-sm truncate plex-mono-medium text-new-gray-700 parent-ellipsis-container-base"
                    style="font-weight: 500"
                    v-html="suggestion.label"
                ></span>

                <AtlanIcon
                    v-if="
                        suggestion?.documentation?.entity?.typeName === 'Table'
                    "
                    :icon="getAnnouncementIcon(suggestion)"
                    class="mr-1.5 ml-1 -mt-0.5 w-4 h-4"
                    style="min-width: 16px"
                ></AtlanIcon>
                <CertificateBadge
                    v-if="
                        suggestion?.documentation?.entity?.typeName ===
                            'Column' &&
                        certificateStatus(suggestion?.documentation?.entity)
                    "
                    :status="
                        certificateStatus(suggestion?.documentation?.entity)
                    "
                    :username="
                        certificateUpdatedBy(suggestion?.documentation?.entity)
                    "
                    :timestamp="
                        certificateUpdatedAt(suggestion?.documentation?.entity)
                    "
                    class="ml-1 mr-0.5 parent-ellipsis-container-extension"
                ></CertificateBadge>
                <span
                    class="ml-1 text-xs text-gray-500 truncate plex-mono parent-ellipsis-container-base"
                    v-if="
                        isActive &&
                        suggestion?.documentation?.entity?.typeName === 'Column'
                    "
                >
                    {{
                        getTableNameFromColumnQualifiedName(
                            qualifiedName(suggestion?.documentation?.entity)
                        )
                    }}
                </span>
            </div>
        </div>
        <div
            class="justify-end parent-ellipsis-container-extension"
            v-if="suggestion?.documentation?.entity?.typeName === 'Column'"
        >
            <span class="pr-2 text-xs normal-case text-new-gray-600">
                {{
                    capitalizeFirstLetter(
                        suggestion?.documentation?.entity?.attributes?.dataType?.toLowerCase()
                    )
                }}
            </span>
        </div>
        <div
            class="justify-end parent-ellipsis-container-extension"
            v-if="!suggestion?.documentation?.entity"
        >
            <span class="pr-2 text-xs normal-case text-new-gray-600">
                {{ getSuggestionsListType(suggestion) }}
            </span>
        </div>
        <div
            class="justify-end parent-ellipsis-container-extension"
            v-if="suggestion?.documentation?.entity?.typeName === 'Table'"
        >
            <span class="pr-2 text-xs normal-case text-new-gray-600">
                {{ rowCount(suggestion?.documentation?.entity) }} rows,
                {{ columnCount(suggestion?.documentation?.entity) }} cols
            </span>
        </div>
    </div>
    <div
        style="max-width: 99%"
        class="truncate"
        v-if="isActive && description(suggestion?.documentation?.entity)"
    >
        <span class="ml-6 text-sm truncate plex-mono text-new-gray-700">
            {{ description(suggestion?.documentation?.entity) }}
        </span>
    </div>
    <div
        style="max-width: 99%"
        class="truncate"
        v-if="suggestion?.kind === 'snippet'"
    >
        <span class="ml-6 text-sm truncate text-new-gray-700 plex-mono">
            {{ suggestion?.insertText }}
        </span>
    </div>
</template>
<script lang="ts">
    import { defineComponent, toRefs, computed, inject, toRaw, Ref } from 'vue'
    import { capitalizeFirstLetter } from '~/utils/string'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import {
        getSuggestionsListIcon,
        getAnnouncementIcon,
        getSuggestionsListType,
    } from './useUtils'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { getTableNameFromColumnQualifiedName } from './useUtils'

    export default defineComponent({
        name: 'SuggestionListItem',
        props: {
            suggestion: {
                type: Object,
                default: () => {},
            },
            isActive: {
                type: Boolean,
                required: true,
            },
        },
        components: { PopoverAsset, CertificateBadge },
        setup(props, { emit }) {
            const {
                rowCount,
                columnCount,
                description,
                qualifiedName,
                certificateUpdatedBy,
                certificateStatus,
                certificateUpdatedAt,
            } = useAssetInfo()
            const { suggestion, isActive } = toRefs(props)

            return {
                getSuggestionsListType,
                rowCount,
                columnCount,
                getAnnouncementIcon,
                description,
                isActive,
                qualifiedName,
                getTableNameFromColumnQualifiedName,
                certificateUpdatedBy,
                certificateUpdatedAt,
                certificateStatus,
                capitalizeFirstLetter,
                getSuggestionsListIcon,
                suggestion,
            }
        },
    })
</script>
<style lang="less">
    @font-face {
        font-family: Hack;
        src: url('~/assets/fonts/hack/Hack-Regular.ttf');
    }
    .hack-font {
        font-family: Hack;
    }
    @font-face {
        font-family: PlexMono;
        src: url('~/assets/fonts/ibmPlexMono/IBMPlexMono-Regular.ttf');
    }
    @font-face {
        font-family: PlexMonoMedium;
        src: url('~/assets/fonts/ibmPlexMono/IBMPlexMono-Medium.ttf');
    }

    .plex-mono {
        font-family: PlexMono !important;
    }
    .plex-mono-medium {
        font-family: PlexMonoMedium !important;
    }
</style>
<style lang="less" scoped>
    .parent-ellipsis-container {
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .parent-ellipsis-container-extension {
        flex-shrink: 0;
    }
</style>
