<template>
    <div class="mb-0">
        <b>Certification</b>
        <span
            v-if="
                data.value?.attributes.certificateStatusMessage &&
                !data.value?.attributes.certificateStatus
            "
        >
            Message
        </span>
        was updated

        <!-- <component
            :is="newCertificate.icon"
            class="inline-flex self-center w-auto h-4 mb-1"
        /><b>{{ ' ' }}{{ newCertificate.label }}</b> -->

        <Certificate :selected-asset="data.value" :showMessage="true" />

        <!-- <div v-if="data.value?.certificateStatusMessage" class="flex">
            <div class="w-1 mr-3 bg-gray-500 rounded-full min-h-6"></div>
            <div class="my-0.5 text-sm">
                <div class="text-xs text-gray-500">Certification Message</div>
                <div>
                    {{ data.value.certificateStatusMessage }}
                </div>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, onMounted } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import { List as statusList } from '~/constant/status'
    import Certificate from '@/common/input/certificate/index.vue'

    export default defineComponent({
        name: 'StatusActivity',
        components: {
            Certificate,
        },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: {} }
                },
            },
        },
        setup(props) {
            const newCertificate = ref<any>()

            onMounted(() => {
                if (props.data.value.certificateStatus) {
                    newCertificate.value = statusList.find(
                        (stat) =>
                            stat.id ===
                            props.data.value.attributes.certificateStatus
                    )
                }
            })
            return {
                newCertificate,
            }
        },
    })
</script>
