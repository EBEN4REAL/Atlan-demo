/* eslint-disable vue/require-default-prop */
<template>
    <a-tree-select
        style="width: 100%"
        :dropdown-style="{
            maxHeight: '400px',
            maxWidth: '300px;',
            overflow: 'auto',
        }"
        :multiple="true"
        :tree-data="treeData"
        :class="$style.connector"
        placeholder=""
        dropdown-class-name="sqlDropdown"
        :allow-clear="true"
        :tree-data-simple-mode="true"
        :treeCheckable="true"
    >
        <template #title="node">
            {{ node.title }}
        </template>

        <template #suffixIcon>
            <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
        </template>
    </a-tree-select>
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
                type: [Array, String],
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
        setup(props, { emit }) {
            // const { modelValue } = useVModels(props, emit)
            // const localValue = ref(modelValue.value)
            const { credential, query, exclude, include } = toRefs(props)

            const body = computed(() => ({
                ...credential?.value,
                query: query?.value,
                schemaExcludePattern: exclude?.value,
                schemaIncludePattern: include.value,
            }))
            const { data, refresh, isLoading, error } = useQueryCredential(body)

            const handleClick = () => {
                refresh()
            }

            onMounted(() => {
                refresh()
            })

            // watch(credential, () => {
            //     refresh()
            // })

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
                        key: element,
                        value: element,
                        isLeaf: false,
                        title: element,
                    })
                })

                console.log(treeData)
                data.value.results?.forEach((element) => {
                    treeData.value.push({
                        id: `${element.TABLE_CATALOG}_${element.TABLE_SCHEM}`,
                        key: `${element.TABLE_CATALOG}_${element.TABLE_SCHEM}`,
                        isLeaf: true,
                        pId: element.TABLE_CATALOG,
                        value: `${element.TABLE_CATALOG}_${element.TABLE_SCHEM}`,
                        title: element.TABLE_SCHEM,
                    })
                })
            })

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
                handleClick,
                isLoading,
                credential,
                query,
                exclude,
                include,
            }
        },
    })
</script>
<style lang="less">
    .sqlDropdown {
        .ant-select-tree-switcher {
            width: 18px !important;
            height: 24px !important;
            line-height: 24px !important;
            margin-top: -12px !important;
        }
        .ant-select-switcher-icon {
            font-weight: normal !important;
        }
    }
</style>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
            @apply rounded-lg !important;
        }
    }
</style>
