<template>
    <div class="flex items-center">
        <span>
            <b> {{ found?.displayName || found?.name }} </b> was updated</span
        >
    </div>

    <div class="p-2 my-3 border border-gray-200 rounded">
        <div
            v-for="(value, attributeName, index) in data.value?.attributes"
            :key="index"
        >
            <div class="flex flex-col">
                <div class="text-gray-500">
                    {{
                        getAttribute(found, attributeName)?.displayName ||
                        getAttribute(found, attributeName)?.name
                    }}
                </div>
                <div class="mb-2 mt-1">{{ value }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        name: 'BusinessMetadataActivity',
        components: {
            PreviewTabsIcon,
        },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: {} }
                },
            },
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)

            const { customMetadataList } = useTypedefData()

            const found = computed(() =>
                customMetadataList.value.find(
                    (item) => item.name === data.value?.value.typeName
                )
            )

            const getAttribute = (foundCM, name) =>
                foundCM?.attributeDefs?.find((attr) => attr?.name === name)

            return { data, customMetadataList, found, getAttribute }
        },
    })
</script>
