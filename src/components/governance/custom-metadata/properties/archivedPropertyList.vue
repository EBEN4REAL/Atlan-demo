<template>
    <div class="">
        <div class="overflow-hidden">
            <div class="flex items-center bg-gray-100" style="height: 40px">
                <div class="flex flex-grow text-gray-500 uppercase">
                    <div class="ml-4 cursor-pointer" style="flex-basis: 35%">
                        Property
                    </div>
                    <div class="uppercase" style="flex-basis: 25%">Type</div>
                    <div class="uppercase">Deleted on</div>
                </div>
            </div>
            <div
                class="overflow-y-auto bg-white rounded-b-lg"
                style="max-height: calc(100vh - 18.6rem)"
            >
                <div
                    v-for="(property, index) in properties"
                    :id="`prop-${property.name}`"
                    :key="property.name"
                    :data-property="property"
                    class="relative flex items-center px-5 last:rounded-b hover:bg-gray-light"
                    style="height: 44px"
                    :class="{
                        'bg-gray-light': selected === property.name,
                        'border-b': properties.length !== index + 1,
                    }"
                >
                    <!-- name -->
                    <div
                        class="leading-none cursor-pointer align-center"
                        style="flex-basis: 36%"
                        @click="
                            $emit('openEditDrawer', {
                                property,
                                archived: true,
                            })
                        "
                    >
                        <div class="flex items-center">
                            <Truncate
                                :tooltip-text="property.displayName"
                                classes="text-primary"
                                :rows="2"
                            />

                            <a-tooltip>
                                <template #title>
                                    <span>{{
                                        property.options.description
                                    }}</span>
                                </template>
                                <div
                                    v-if="property.options.description"
                                    class="mr-2"
                                >
                                    <AtlanIcon
                                        class="inline h-4 ml-2 text-gray-400 hover:text-gray-500"
                                        :icon="'Info'"
                                    />
                                </div>
                            </a-tooltip>
                        </div>
                    </div>

                    <!-- type -->
                    <div class="flex capitalize" style="flex-basis: 26%">
                        <AtlanIcon
                            v-if="
                                mapTypeToIcon(
                                    property.options.primitiveType ??
                                        property.typeName,
                                    property
                                )
                            "
                            class="inline h-4 mr-2"
                            :icon="
                                mapTypeToIcon(
                                    property.options.primitiveType ??
                                        property.typeName,
                                    property
                                )
                            "
                        />
                        {{ resolveType(property) }}
                    </div>
                    <!-- other info -->
                    <!-- <div style="">Delete by samiran, on 26/03/2022</div> -->
                    <div v-if="property.options.archivedAt" style="">
                        {{
                            new Date(
                                Number(property.options.archivedAt)
                            ).toDateString()
                        }}
                        at
                        {{
                            new Date(
                                Number(property.options.archivedAt)
                            ).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            })
                        }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        toRefs,
        ref,
        reactive,
        computed,
        onMounted,
        watch,
        nextTick,
    } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import { Types } from '~/services/meta/types'
    import { useTypedefStore } from '~/store/typedef'
    import { ATTRIBUTE_TYPES } from '~/constant/businessMetadataTemplate'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import Truncate from '@/common/ellipsis/index.vue'
    import PropertyActions from '@/governance/custom-metadata/properties/propertyActions.vue'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        components: { Truncate, PropertyActions },
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
            selected: {
                type: String,
                required: false,
                default: '',
            },
            properties: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['openEditDrawer', 'archiveProperty'],
        setup(props, { emit }) {
            const store = useTypedefStore()
            const { metadata, properties } = toRefs(props)

            // map icon to type
            const attributesTypes = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_TYPES))
            )

            const mapTypeToIcon = (id, property) => {
                const foundIcon = attributesTypes.find(
                    (x) =>
                        x.id ===
                        (property.options?.customType
                            ? property.options?.customType
                            : id) // if has customType property, use it instead of id to search for icon
                )?.icon // find icon in attributesTypes
                if (property.options?.isEnum === 'true') return 'Enum'
                return foundIcon
            }

            const resolveType = (property) => {
                if (property.options?.customType) {
                    return property.options?.customType
                }
                const label = attributesTypes.find(
                    (x) =>
                        x.id ===
                        (property.options?.customType
                            ? property.options?.customType
                            : property.options.primitiveType ??
                              property.typeName) // if has customType property, use it instead of id to search for icon
                )?.label
                return (
                    (label || property.options.primitiveType) ??
                    property.typeName
                )
            }

            const { userId } = whoami()

            return {
                userId,
                mapTypeToIcon,
                resolveType,
                map,
            }
        },
    })
</script>

<style>
    .grap {
        cursor: grab;
    }
</style>
