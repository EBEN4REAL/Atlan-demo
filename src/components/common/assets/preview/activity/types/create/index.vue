<template>
    <div v-if="isGTCByType(data?.value?.typeName)" class="mb-0 capitalize">
        <b>{{ glossaryLabel[data?.value?.typeName] }}</b> was created
    </div>
    <div v-else class="mb-0"><b>Asset</b> was created</div>
    <div class="border rounded-lg mt-2 p-1">
        <div v-for="el in attributesData" :key="el?.component" class="p-2">
            <component
                :is="el.component"
                v-if="el?.component"
                :data="el"
                :typeName="data.typeName"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        defineAsyncComponent,
        onMounted,
        ref,
    } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { default as glossaryLabel } from '@/glossary/constants/assetTypeLabel'

    export default defineComponent({
        name: 'DescriptionActivity',
        components: {
            Certificate: defineAsyncComponent(
                () => import('../certificate/index.vue')
            ),
            Description: defineAsyncComponent(
                () => import('../description/index.vue')
            ),
            Name: defineAsyncComponent(() => import('../name/index.vue')),
            Owners: defineAsyncComponent(() => import('../owners/index.vue')),
        },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup(props) {
            const { isGTCByType } = useAssetInfo()
            const attributesToDisplay = [
                'name',
                'certificateStatus',
                'ownerUsers',
                'userDescription',
                'description',
            ]
            const componentMap = {
                certificateStatus: 'Certificate',
                name: 'Name',
                ownerUsers: 'Owners',
                userDescription: 'Description',
                description: 'Description',
            }
            const attributesData = ref<[]>([])
            const contructAttributesData = () => {
                if (props?.data?.value) {
                    const { attributes } = props.data.value
                    console.log(attributes)
                    if (Object.keys(attributes)?.length)
                        Object.keys(attributes).forEach((el) => {
                            if (attributesToDisplay.includes(el)) {
                                if (
                                    ['ownerUsers', 'ownerGroups'].includes(el)
                                ) {
                                    const data = { value: {} }
                                    if (attributes?.ownerUsers) {
                                        data.value.ownerUsers =
                                            attributes.ownerUsers
                                    }
                                    if (attributes.ownerGroups) {
                                        data.value.ownerGroups =
                                            attributes.ownerGroups
                                    }

                                    data.component = 'Owners'

                                    attributesData.value.push(data)
                                } else if (el === 'certificateStatus') {
                                    const data = { value: props.data.value }
                                    data.value.attributes = [
                                        { [el]: attributes[el] },
                                    ]

                                    attributesData.value.push({
                                        component: componentMap[el],
                                        value: data.value,
                                    })
                                } else
                                    attributesData.value.push({
                                        component: componentMap[el],
                                        value: attributes[el],
                                    })
                            }
                        })
                }
           }
            onMounted(contructAttributesData)
            return {
                glossaryLabel,
                isGTCByType,
                attributesToDisplay,
                attributesData,
            }
        },
    })
</script>
