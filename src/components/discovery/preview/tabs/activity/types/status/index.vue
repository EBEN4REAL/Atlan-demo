<template>
    <div v-if="newStatus?.label" class="mb-3">
        <b>Status</b> changed to
        <component
            :is="newStatus.icon"
            class="inline-flex self-center w-auto h-4 mb-1"
        /><b>{{ ' ' }}{{ newStatus.label }}</b>
    </div>
    <div v-if="data.value?.assetStatusMessage" class="flex mb-3">
        <div class="w-1.5 ml-2 mr-4 bg-gray-500 rounded-full min-h-6"></div>
        <div class="my-0.5 text-sm">
            <div class="text-xs text-gray-500">Status Message</div>
            <div>
                {{ data.value.assetStatusMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, onMounted } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import { List as statusList } from '~/constant/status'

    export default defineComponent({
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup(props) {
            const newStatus = ref<any>()

            onMounted(() => {
                if (props.data.value.assetStatus) {
                    newStatus.value = statusList.find(
                        (stat) => stat.id === props.data.value.assetStatus
                    )
                }
            })
            return {
                newStatus,
            }
        },
    })
</script>
