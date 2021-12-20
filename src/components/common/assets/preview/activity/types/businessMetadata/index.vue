<template>
    <div><b>Business Metadata </b>updated</div>
    <div class="my-3">
        {{ name }}
        <div class="mb-1 font-bold">{{ data.value?.typeName }}</div>
        <div
            v-for="(value, attributeName, index) in data.value?.attributes"
            :key="index"
        >
            <div>
                <b>{{ attributeName }}</b> set to
                <b>{{ value }}</b>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        name: 'BusinessMetadataActivity',
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)

            const { customMetadataList } = useTypedefData()

            const name = computed(() => {
                console.log(customMetadataList.value)
                console.log(data.value?.typeName)

                const found = customMetadataList.value.find(
                    (item) => item.name === data.value?.typeName
                )
                console.log(found)
                console.log(found)
                return found?.displayName || data.value?.typeName
            })

            return { data, customMetadataList, name }
        },
    })
</script>
