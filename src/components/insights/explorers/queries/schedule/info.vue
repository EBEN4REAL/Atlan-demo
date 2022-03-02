<template>
    <div class="w-full h-full p-6 bg-white" style="min-height: 430px">
        <div class="mb-12">
            <p class="mb-1 font-bold text-gray-500 required">Name</p>
            <a-input
                @blur="onNameBlur"
                :ref="
                    (el) => {
                        nameRef = el
                    }
                "
                v-model:value="infoTabeState.name"
                class="input"
                placeholder="Enter a name for your report"
            />
        </div>
        <div class="flex mb-12">
            <div class="mr-4 item-1">
                <p class="mb-1 font-bold text-gray-500 required">
                    Refresh frequency
                </p>
                <Frequency
                    v-model="infoTabeState.frequency"
                    placeholder="None"
                    @change="handleChangeFrequency"
                ></Frequency>
            </div>
            <div class="mr-4 item-2">
                <p class="mb-1 font-bold text-gray-500 required">Run Time</p>
                <a-time-picker
                    class="w-full"
                    format="HH:mm"
                    :showNow="false"
                    placeholder=""
                    valueFormat="HH:mm"
                    :minuteStep="15"
                    v-model:value="infoTabeState.time"
                />
            </div>
            <div class="item-3">
                <p class="mb-1 font-bold text-gray-500 required">Timezone</p>
                <Timezone
                    v-model="infoTabeState.timezone"
                    placeholder=""
                    @change="buildCron"
                ></Timezone>
            </div>
        </div>
        <div class="flex items-center justify-between mb-5 text-sm">
            <div class="w-full">
                <p class="mb-1 font-bold text-gray-500">Share Results</p>
                <p class="pb-2 text-gray-400 border-b border-gray-200">
                    Data will be sent as an attachment email
                </p>
            </div>
            <!-- <div>
                <AtlanIcon icon="Mail" />
            </div> -->
        </div>
        <div class="text-sm text-gray-700">
            <div class="flex items-center">
                <a-button
                    shape="circle"
                    size="small"
                    class="mr-2 text-center shadow"
                    :class="{
                        editPermission:
                            'hover:bg-primary-light hover:border-primary',
                    }"
                    @click="() => (isEdit = true)"
                >
                    <span><AtlanIcon icon="Add" class="h-3.5"></AtlanIcon></span
                ></a-button>
                <p class="mt-0.5">Add users</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import Frequency from '~/components/common/select/frequency.vue'
    import Timezone from '~/components/common/select/timezone.vue'

    export default defineComponent({
        name: 'Schedule Query Body',
        components: { Frequency, Timezone },
        props: {},
        setup(props) {
            const nameRef = ref()
            const infoTabeState = ref({
                name: '',
                frequency: 'daily',
                time: '00:00',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })

            const rules = ref({
                name: {
                    text: 'Enter a name!',
                    show: false,
                },
                connection: {
                    text: 'Connection is required!',
                    show: false,
                },
                assets: { text: 'Select atleast 1 asset!', show: false },
                metadata: {
                    text: 'Select atleast 1 permission!',
                    show: false,
                },
            })

            const onNameBlur = () => {
                if (!infoTabeState.value.name) rules.value.name.show = true
                else rules.value.name.show = false
            }
            return {
                infoTabeState,
                onNameBlur,
                nameRef,
                rules,
            }
        },
    })
</script>
<style lang="less" scoped>
    .required:after {
        content: ' *';
        color: red;
    }
    .input::placeholder {
        @apply text-gray-400 !important;
    }
    .item-1 {
        flex: 0.35;
    }
    .item-2 {
        flex: 0.25;
    }
    .item-3 {
        flex: 0.4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
