<template>
    <div v-if="newStatus?.label" class="mb-3">
        <b>Certification</b> changed to
        <component
            :is="newStatus.icon"
            class="inline-flex self-center w-auto h-4 mb-1"
        /><b>{{ ' ' }}{{ newStatus.label }}</b>

        <div v-if="data.value?.assetStatusMessage" class="flex my-3">
            <div class="w-1 mr-3 bg-gray-500 rounded-full min-h-6"></div>
            <div class="my-0.5 text-sm">
                <div class="text-xs text-gray-500">Certification Message</div>
                <div>
                    {{ data.value.assetStatusMessage }}
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if="data.value?.assetStatusMessage === ''">
            <div class="mb-3"><b>Certification message</b> removed</div>
        </div>
        <div v-else>
            <div><b>Certification message</b> updated</div>
            <div class="my-3 text-sm text-gray-500">
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
        name: 'StatusActivity',
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
                if (props.data.value.certificateStatus) {
                    newStatus.value = statusList.find(
                        (stat) => stat.id === props.data.value.certificateStatus
                    )
                }
            })
            return {
                newStatus,
            }
        },
    })
</script>
