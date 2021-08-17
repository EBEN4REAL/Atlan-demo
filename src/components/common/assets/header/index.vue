<template>
    <div class="border-b rounded-tl-lg rounded-tr-lg bg-gray-100">
        <ConnectorDropdown
            :data="props.connectorsPayload"
            @change="handleChangeConnectors"
        ></ConnectorDropdown>
    </div>
    <div class="flex items-center mx-3 mt-3">
        <a-input
            v-model:value="queryText"
            placeholder="Search"
            :allow-clear="true"
            size="default"
            class="rounded-full"
            @change="handleSearchChange"
        >
            <template #prefix>
                <div class="flex -space-x-2">
                    <template
                        v-for="item in props.filteredConnectorList"
                        :key="item.id"
                    >
                        <img
                            :src="item.image"
                            class="
                                w-auto
                                h-6
                                mr-1
                                bg-white
                                rounded-full
                                border-5
                            "
                        />
                    </template>
                </div>
            </template>
            <template #suffix>
                <a-popover placement="bottomLeft">
                    <template #content>
                        <Preferences
                            :default-projection="props.projection"
                            @change="handleChangePreferences"
                            @sort="handleChangeSort"
                            @state="handleState"
                        ></Preferences>
                    </template>
                    <fa icon="fal cog"></fa>
                </a-popover>
            </template>
        </a-input>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue'
    import ConnectorDropdown from '~/components/common/dropdown/connectorDropdown.vue'
    import Preferences from '@/discovery/asset/preference/index.vue'

    export interface Connector {
        connector: string
        connection: string
    }

    export default defineComponent({
        components: {
            ConnectorDropdown,
            Preferences,
        },
        props: {
            connectorsPayload: {
                type: Object,
                required: true,
                default() {
                    return {}
                },
            },
            filteredConnectorList: {
                type: Array,
                required: true,
                default() {
                    return []
                },
            },
            projection: {
                type: Array,
                required: true,
                default() {
                    return []
                },
            },
        },
        setup(props, { emit }) {
            const queryText = ref('')
            const handleChangeConnectors = (e: Connector) => {
                emit('handleChangeConnectors', e)
            }
            const handleSearchChange = (e: Event) => {
                emit('handleSearchChange', e)
            }
            const handleChangePreferences = (e: {
                [index: string]: string
            }) => {
                console.log('handleChangePreferences', e)
                emit('handleChangePreferences', e)
            }
            const handleChangeSort = (e: string) => {
                emit('handleChangeSort', e)
            }
            const handleState = (e: string) => {
                emit('handleState', e)
            }
            return {
                props,
                handleChangeConnectors,
                handleSearchChange,
                handleChangePreferences,
                handleChangeSort,
                handleState,
                queryText,
            }
        },
    })
</script>

<style scoped></style>
