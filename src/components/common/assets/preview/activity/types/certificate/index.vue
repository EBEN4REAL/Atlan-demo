<template>
    <div v-if="newCertificate?.label" class="mb-3">
        <b>Certification</b> updated to
        <component
            :is="newCertificate.icon"
            class="inline-flex self-center w-auto h-4 mb-1"
        /><b>{{ ' ' }}{{ newCertificate.label }}</b>

        <div v-if="data.value?.certificateStatusMessage" class="flex">
            <div class="w-1 mr-3 bg-gray-500 rounded-full min-h-6"></div>
            <div class="my-0.5 text-sm">
                <div class="text-xs text-gray-500">Certification Message</div>
                <div>
                    {{ data.value.certificateStatusMessage }}
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if="data.value?.certificateStatusMessage === ''">
            <div class="mb-3"><b>Certification message</b> was deleted</div>
        </div>
        <div v-else>
            <div><b>Certification message</b> was updated</div>
            <div class="my-3 text-sm text-gray-500">
                {{ data.value.certificateStatusMessage }}
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
            const newCertificate = ref<any>()

            onMounted(() => {
                if (props.data.value.certificateStatus) {
                    newCertificate.value = statusList.find(
                        (stat) => stat.id === props.data.value.certificateStatus
                    )
                }
            })
            return {
                newCertificate,
            }
        },
    })
</script>
