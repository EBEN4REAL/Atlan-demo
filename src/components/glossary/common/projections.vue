<template>
    <a-popover trigger="click" placement="leftTop">
        <template #content>
            <div class="pt-3 w-60">
                <!-- projections -->
                <p class="mb-3 text-gray-500">DISPLAY PROPERTIES</p>
                <div class="flex flex-wrap">
                    <template
                        v-for="item in projectionOptions"
                        :key="item.value"
                    >
                        <div
                            class="px-2 py-1 mb-1 mr-1 rounded cursor-pointer  text-gray"
                            :class="
                                isProjectionSelected(item)
                                    ? 'bg-primary-light border border-white hover:bg-primary-light'
                                    : 'border'
                            "
                            @click="() => togglePropertySelect(item)"
                        >
                            {{ item.label }}
                        </div>
                    </template>
                </div>

                <!-- filters -->
            </div>
        </template>
        <a-button class="p-1 ml-2 rounded">
            <AtlanIcon icon="FilterDot" class="h-6" />
        </a-button>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        components: {},
        props: {
            projectionOptions: {
                type: Object,
                required: true,
                default: () => {},
            },
        },
        emits: ['projectionChange'],
        setup(props, { emit }) {
            // data
            const projection = ref([
                'status',
                'description',
                'owners',
                'linkedAssets',
            ])
            // to check if projection is already selected
            const isProjectionSelected = (property) =>
                projection.value.includes(property.value)

            // toggle projection
            const togglePropertySelect = (property) => {
                if (projection.value.includes(property.value)) {
                    const index = projection.value.indexOf(property.value)
                    projection.value.splice(index, 1)
                } else {
                    projection.value.push(property.value)
                }
                emit('projectionChange', projection)
            }

            return {
                projection,
                isProjectionSelected,
                togglePropertySelect,
            }
        },
    })
</script>
