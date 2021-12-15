/* eslint-disable vue/require-default-prop */
<template>
    <a-input-group compact class="flex w-full mb-0">
        <a-tree-select
            style="width: 80%"
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
            <template #title="node">
                {{ node.title }}
            </template>
        </a-tree-select>
        <a-button style="width: 20%" @click="handleClick">
            <a-spin size="small" v-if="isLoading" class="mt-1"></a-spin>
            <AtlanIcon
                icon="Error"
                v-else-if="error && !isLoading"
                style="height: 12px"
            ></AtlanIcon>
            <AtlanIcon icon="Refresh" v-else></AtlanIcon>
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
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { credential, query, exclude, include } = toRefs(props)

            const body = computed(() => ({
                ...credential?.value,
                query: query?.value,
                schemaExcludePattern: exclude?.value,
                schemaIncludePattern: include.value,
            }))
            const { data, refresh, isLoading, error } = useQueryCredential(body)

            onMounted(() => {
                if (modelValue.value.length > 0) {
                    refresh()
                }
            })

            // watch(credential, () => {
            //     refresh()
            // })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const handleClick = () => {
                refresh()
            }

            const treeData = ref([])
            watch(data, () => {
                const db = [
                    ...new Set(
                        data.value.results?.map((item) => item.TABLE_CATALOG)
                    ),
                ]
                db.forEach((element) => {
                    treeData.value.push({
                        id: element,

                        value: element,
                        isLeaf: false,
                        title: element,
                    })
                })
                data.value.results?.forEach((element) => {
                    treeData.value.push({
                        id: `${element.TABLE_CATALOG}:${element.TABLE_SCHEM}`,

                        isLeaf: true,
                        pId: element.TABLE_CATALOG,
                        value: `${element.TABLE_CATALOG}:${element.TABLE_SCHEM}`,
                        title: element.TABLE_SCHEM,
                    })
                })
            })

            const handleDropdownVisibleChange = (open) => {
                if (treeData.value?.length === 0 && open) {
                    refresh()
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
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" module></style>
