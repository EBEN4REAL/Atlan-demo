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
            :treeCheckable="true"
            :tree-data-simple-mode="true"
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
                    <span>{{ label }}</span>
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

    import { useMetadataCredential } from '~/composables/credential/useMetadataCredential'
    import { useMetadataCredentialByID } from '~/composables/credential/useMetadataCredentialID'

    export default defineComponent({
        name: 'APITreeSelect',
        props: {
            modelValue: {
                required: false,
            },
            credential: {
                type: Object,
                required: false,
            },
            credentialID: {
                type: String,
                required: false,
                default: () => '',
            },
            templateConfig: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { credential, templateConfig, credentialID } = toRefs(props)

            const path = computed(() => ({
                id: credentialID.value,
            }))

            const body = computed(() => ({
                ...credential?.value,
                ...templateConfig.value,
            }))

            const { data, refresh, isLoading, error } =
                useMetadataCredential(body)

            const {
                data: credByID,
                refresh: refreshCredByID,
                isLoading: isLoadingByID,
                error: errorByID,
            } = useMetadataCredentialByID(path, body, false)

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

            const handleChange = () => {
                console.log('localValue', localValue.value)
                modelValue.value = localValue.value
                emit('change')
            }

            const fetchCreds = () => {
                if (credentialID.value) {
                    refreshCredByID()
                } else {
                    refresh()
                }
            }

            const handleClick = () => fetchCreds()
            const treeData = ref([])

            const recursionTransform = (root, rootId, queue) => {
                root?.children?.forEach((element) => {
                    const temp = {
                        title: element.title,
                        value: `${rootId}:${element.value}`,
                        rootId: `${rootId}`,
                        children: element.children,
                    }

                    queue.push(temp)
                })
            }

            const transformData = (data) => {
                console.log('data', data.value)
                const queue = data.value.results
                while (queue.length > 0) {
                    const item = queue.pop()
                    treeData.value.push({
                        id: item.value,
                        value: item.value.toString(), // The API expects strings, so we convert numbers into strings
                        title:
                            item.title ||
                            item.value.toString()?.split(':').slice(-1)[0],
                        pId: item.rootId,
                    })
                    recursionTransform(item, item.value, queue)
                }
            }

            watch(data, () => {
                transformData(data)
            })

            watch(credByID, () => {
                transformData(credByID)
            })

            const handleDropdownVisibleChange = (open) => {
                if (treeData.value?.length === 0 && open) fetchCreds()
            }

            if (credentialID.value) refreshCredByID()

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
                error,
                handleDropdownVisibleChange,
                handleChange,
                localValue,
                handleClick,
                path,
                credByID,
                refreshCredByID,
                isLoadingByID,
                errorByID,
                transformData,
                displayLabel,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" module></style>
