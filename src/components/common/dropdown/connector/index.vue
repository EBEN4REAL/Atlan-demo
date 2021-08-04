<template>
    <div class="">
        <div class="">
            <div class="flex gap-x-2">
                <a-popover placement="bottomLeft" trigger="click">
                    <template #content>
                        <p class="mb-0 text-gray-500">Connector</p>
                        <ConnectorSelector
                            v-model="connector"
                            :connector="connector"
                            style="width: 200px"
                            placeholder="All Connectors"
                            @change="handleConnectorChange"
                        ></ConnectorSelector>
                        <p class="mt-2 mb-0 text-gray-500">Connections</p>
                        <ConnectionSelector
                            v-model="connection"
                            :disabled="isDisabled"
                            :connector="connector"
                            style="width: 200px"
                            placeholder="All Connections"
                            @change="handleConnectionChange"
                        ></ConnectionSelector>
                    </template>

                    <div v-if="connector" class="flex py-2 cursor-pointer">
                        <div
                            class="flex items-center text-xs text-gray-900 align-middle"
                        >
                            <img
                                :src="getImage(connector)"
                                class="w-auto h-4 mr-1"
                            />

                            <fa
                                v-if="connectionObject"
                                icon="fal chevron-right"
                                class="text-xs text-gray-300"
                            ></fa>
                            <div v-if="connectionObject" class="text-xs">
                                {{
                                    connectionObject.attributes.displayName ||
                                        connectionObject.attributes.name
                                }}
                            </div>

                            <div
                                v-else-if="connector"
                                class="text-xs tracking-wide"
                            >
                                {{
                                    connector?.charAt(0).toUpperCase() +
                                        connector?.substr(1).toLowerCase()
                                }}
                            </div>
                            <fa
                                icon="fas caret-down"
                                class="text-primary-500"
                            ></fa>
                        </div>
                        <fa
                            v-if="connectionObject"
                            icon="fal chevron-right"
                            class="text-xs text-gray-300"
                        ></fa>
                    </div>
                    <div v-else class="flex py-2 cursor-pointer">
                        <p
                            class="flex items-center mb-0 text-xs tracking-wide text-gray-900 align-middle hover:bg-gray-50"
                        >
                            <fa icon="fal plug" class="mr-1"></fa>All Connectors
                            <fa
                                icon="fas caret-down"
                                class="text-primary-500"
                            ></fa>
                        </p>
                    </div>
                </a-popover>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, watch, toRaw } from 'vue';

    import ConnectionSelector from '@common/selector/connections/index.vue';
    import ConnectorSelector from '@common/selector/connectors/index.vue';
    import { useConnectionsStore } from '~/store/connections';

    export default defineComponent({
        components: { ConnectionSelector, ConnectorSelector },

        props: {
            data: {
                type: Object,
                required: false,
                default() {
                    return {};
                },
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const connectorPayload = props.data;

            watch(connectorPayload, () => {
                console.log(connectorPayload, 'payload');
            });

            const connector = ref('' || connectorPayload.connector);
            const connection = ref('' || connectorPayload.connection);

            const store = useConnectionsStore();
            const getImage = (id: string) => store.getImage(id);

            const connectionObject = computed(() => store.getList.find(
                    (item) => item.attributes.qualifiedName === connection.value
                ));

            const isDisabled = computed(() => {
                if (connector.value?.length > 0) {
                    return false;
                }
                return true;
            });

            const handleConnectorChange = (value) => {
                if (!value) {
                    connection.value = '';
                } else if (connector.value && connection.value) {
                        if (
                            connection?.value.split('/')[0] !== connector.value
                        ) {
                            connection.value = '';
                        }
                    }

                emit('change', {
                    connector: connector.value,
                    connection: connection.value,
                });
            };
            const handleConnectionChange = (value) => {
                emit('change', {
                    connector: connector?.value,
                    connection: connection.value,
                });
            };
            return {
                connector,
                connection,
                isDisabled,
                handleConnectorChange,
                handleConnectionChange,
                getImage,
                connectionObject,
            };
        },
        computed: {},
        mounted() {},
        methods: {},
    });
</script>
