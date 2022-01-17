<template>
    <div class="flex flex-col w-full h-full px-5 py-4 overflow-auto gap-y-3">
        <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-500">Details</span>
        </div>
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Name</span>

            <div class="flex flex-col">
                <div class="flex mb-2">
                    {{
                        item?.metadata?.annotations[
                            'orchestration.atlan.com/name'
                        ]
                    }}
                </div>
            </div>
        </div>
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Description</span>

            <div class="flex flex-col">
                <div class="flex mb-2">
                    {{
                        item?.metadata?.annotations[
                            'package.argoproj.io/description'
                        ]
                    }}
                </div>
            </div>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-1">Package</span>
            <div class="flex">
                {{ item?.metadata.annotations['package.argoproj.io/name'] }}
                ({{ item?.metadata.labels['package.argoproj.io/version'] }})
            </div>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Type</span>
            <div class="flex capitalize">
                {{ item?.metadata.labels['orchestration.atlan.com/type'] }}
            </div>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Publisher</span>
            <div class="flex">
                {{ item?.metadata.annotations['package.argoproj.io/author'] }}
            </div>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Use cases</span>
            <div class="flex">
                {{
                    item?.metadata.annotations[
                        'orchestration.atlan.com/usecase'
                    ]
                }}
            </div>
        </div>
        <div
            class="flex flex-col text-sm"
            v-if="
                item?.metadata.annotations[
                    'orchestration.atlan.com/dependentPackage'
                ]
            "
        >
            <span class="mb-1 text-gray-500">Dependent Package</span>
            <div class="flex">
                {{
                    item?.metadata.annotations[
                        'orchestration.atlan.com/dependentPackage'
                    ]
                }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        name: 'PropertiesWidget',
        components: {
            UserPill,
            PopOverUser,
        },
        props: {
            item: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { item } = toRefs(props)

            const {} = useWorkflowInfo()

            return { item }
        },
    })
</script>
