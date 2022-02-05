/* eslint-disable vue/require-default-prop */
<template>
    <a-input-group compact class="flex w-full mb-0">
        <a-tree-select
            class="flex-1 flex-grow w-full"
            :dropdown-style="{
                maxHeight: '400px',
                maxWidth: '300px;',
                overflow: 'auto',
            }"
            v-model:value="localValue"
            :alwaysOpen="true"
            :multiple="true"
            :tree-data="treeData"
            placeholder=""
            :allow-clear="true"
            :tree-data-simple-mode="true"
            :treeCheckable="true"
            showCheckedStrategy="SHOW_PARENT"
            @dropdownVisibleChange="handleDropdownVisibleChange"
            @change="handleChange"
        >
            <template
                #notFoundContent
                v-if="isLoading || isLoadingByID || errorByID || error"
            >
                <div
                    class="flex items-center justify-center w-full h-10"
                    v-if="isLoading || isLoadingByID"
                >
                    <a-spin size="small" class="mt-1 mr-2" /> Loading
                </div>
                <div
                    class="flex items-center justify-center w-full h-10 text-red-500"
                    v-if="errorByID || error"
                >
                    <AtlanIcon icon="Error" class="mr-1"></AtlanIcon> Please
                    check your credential and try again.
                </div>
            </template>
            <template #suffixIcon>
                <AtlanIcon icon="CaretDown" />
            </template>

            <template #tagRender="{ label, closable, onClose, option }">
                <a-tag
                    :closable="closable"
                    color="blue"
                    style="margin-right: 3px"
                    @close="onClose"
                >
                    <AtlanIcon
                        icon="Schema"
                        class="mr-1 text-gray-500"
                        v-if="isSchema(label, option)"
                    ></AtlanIcon>
                    <AtlanIcon
                        icon="Database"
                        class="mr-1 text-gray-500"
                        v-else
                    ></AtlanIcon>
                    <span>{{ displayLabel(label) }}</span>
                </a-tag>
            </template>
            <template #title="node">
                {{ node.title }}
            </template>
        </a-tree-select>

        <a-button @click="handleClick" class="px-2">
            <a-spin
                size="small"
                class="mt-1"
                v-if="isLoading || isLoadingByID"
            ></a-spin>
            <AtlanIcon icon="Retry" class="text-primary" v-else></AtlanIcon>
        </a-button>
    </a-input-group>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        onMounted,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
    } from 'vue'

    import { useVModels } from '@vueuse/core'

    import { useQueryCredential } from '~/composables/credential/useQueryCredential'
    import { useTestCredential } from '~/composables/credential/useTestCredential'
    import { useQueryCredentialByID } from '~/composables/credential/useQueryCredentialByID'

    export default defineComponent({
        props: {
            modelValue: {
                required: false,
            },
            query: {
                type: String,
                required: false,
                default: () => '',
            },
            credential: {
                type: Object,
                required: false,
            },
            exclude: {
                required: false,
            },
            include: {
                required: false,
            },
            credentialID: {
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { credential, query, exclude, include, credentialID } =
                toRefs(props)

            const path = computed(() => {
                return {
                    id: credentialID.value,
                }
            })

            const body = computed(() => ({
                ...credential?.value,
                query: query?.value,
                schemaExcludePattern: exclude?.value,
                schemaIncludePattern: include.value,
            }))
            const { data, refresh, isLoading, error } = useQueryCredential(body)

            const {
                data: credByID,
                refresh: refreshCredByID,
                isLoading: isLoadingByID,
                error: errorByID,
            } = useQueryCredentialByID(path, { query: query?.value }, false)

            onMounted(() => {
                if (credentialID.value) {
                    // refreshCredByID()
                } else if (modelValue.value.length > 0) {
                    refresh()
                }
            })

            const displayLabel = (label) => {
                if (label.includes(':')) {
                    return label.split(':').pop()
                }
                return label
            }

            const isSchema = (label, options) => {
                if (label.includes(':') || options.isLeaf) {
                    return true
                }
                return false
            }

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const handleClick = () => {
                if (credentialID.value) {
                    refreshCredByID()
                } else {
                    refresh()
                }
            }
            const treeData = ref([])
            const transformData = (data) => {
                treeData.value = []
                const db = [
                    ...new Set(
                        data.value.results?.map((item) => item.TABLE_CATALOG)
                    ),
                ]
                db.forEach((element) => {
                    if (element) {
                        treeData.value.push({
                            id: element,

                            value: element,
                            isLeaf: false,
                            title: element,
                        })
                    }
                })
                data.value.results?.forEach((element) => {
                    if (element.TABLE_CATALOG) {
                        treeData.value.push({
                            id: `${element.TABLE_CATALOG}:${element.TABLE_SCHEM}`,

                            isLeaf: true,
                            pId: element.TABLE_CATALOG,
                            value: `${element.TABLE_CATALOG}:${element.TABLE_SCHEM}`,
                            title: element.TABLE_SCHEM,
                        })
                    }
                })
            }

            watch(data, () => {
                transformData(data)
            })

            watch(credByID, () => {
                transformData(credByID)
            })

            const handleDropdownVisibleChange = (open) => {
                if (treeData.value?.length === 0 && open) {
                    if (credentialID.value) {
                        refreshCredByID()
                    } else {
                        refresh()
                    }
                }
            }

            // const treeData = computed(() => {
            //     const mappedConnection = list.map((i) => ({
            //         id: i.attributes.qualifiedName,
            //         key: i.attributes.qualifiedName,
            //         pId: i.attributes.connectorName,
            //         name: i.attributes.displayName || i.attributes.name,
            //         value: i.attributes.qualifiedName,
            //         connector: i.attributes.connectorName,
            //         image: sourceList.find(
            //             (s) => s.id === i.attributes.connectorName
            //         )?.image,
            //         count: i.attributes.assetCount,
            //         type: 'connection',
            //         isLeaf: true,
            //         children: null,
            //         slots: {
            //             title: 'title',
            //         },
            //     }))
            //     const mappedConnector = sourceList.map((i) => ({
            //         id: i.id,
            //         name: i.id,
            //         key: i.id,
            //         value: i.id,
            //         connector: i.id,
            //         image: i.image,
            //         isLeaf: false,
            //         children: null,
            //         type: 'connector',
            //         slots: {
            //             title: 'title',
            //         },
            //     }))
            //     mappedConnection.push(...mappedConnector)
            //     return mappedConnection
            // })  //     value: item.name,
            //     label: item.name,
            //     slots: {
            //         title: 'title',

            return {
                treeData,

                isLoading,
                credential,
                query,
                exclude,
                include,
                error,
                handleDropdownVisibleChange,
                isLoading,
                handleChange,
                localValue,
                handleClick,
                credentialID,
                path,
                credByID,
                refreshCredByID,
                isLoadingByID,
                errorByID,
                transformData,
                displayLabel,
                isSchema,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" module></style>
