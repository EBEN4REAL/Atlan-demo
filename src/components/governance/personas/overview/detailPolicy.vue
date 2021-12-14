<template>
    <div class="p-5 border-b border-bottom border-slate-300">
        <div class="flex justify-between">
            <div class="text-lg font-bold">{{ selectedPolicy.name }}</div>
            <AtlanBtn
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
            >
                <AtlanIcon icon="Delete" class="-mx-1 text-black" />
            </AtlanBtn>
        </div>
        <div class="flex items-center">
            <AtlanIcon icon="Policies" class="mr-1" />
            <span class="text-neutral-600">{{ selectedPolicy.type }} </span>
        </div>
    </div>
    <div class="p-5">
        <div class="font-bold base text-neutral-500">Detailed Info</div>
        <div class="mt-4">
            <div class="text-gray-500">Name</div>
            <div class="mt-1">{{ selectedPolicy.name }}</div>
        </div>
        <div class="mt-4">
            <div class="text-gray-500">Connection</div>
            <div class="flex items-center mt-1">
                <img
                    :src="getImage(connectionQfName?.split('/')[1])"
                    class="w-auto h-6 p-1 rounded-tl rounded-bl"
                />
                <span class="px-1 text-sm text-gray-700">
                    {{ connectionQfName?.split('/')?.slice(-1)[0] }}
                </span>
            </div>
        </div>
        <div class="mt-4">
            <div class="flex justify-between">
                <div class="text-gray-500">Asset</div>
                <AtlanBtn
                    class="flex-none"
                    size="sm"
                    color="minimal"
                    padding="compact"
                >
                    <span class="text-primary"> Add asset </span>
                    <AtlanIcon icon="ArrowRight" class="ml-1 text-primary" />
                </AtlanBtn>
            </div>
            <div
                class="flex justify-between p-3 mt-4 border rounded-sm border-bottom border-slate-300"
            ></div>
        </div>
        <div class="mt-4">
            <div class="flex justify-between">
                <div class="text-gray-500">Metadata permissions</div>
                <AtlanBtn
                    class="flex-none"
                    size="sm"
                    color="minimal"
                    padding="compact"
                >
                    <span class="text-primary"> Manage </span>
                    <AtlanIcon icon="ArrowRight" class="ml-1 text-primary" />
                </AtlanBtn>
            </div>
            <div class="flex items-center mt-1">
                <span class="px-1 text-sm text-gray-700"> Partial </span>
            </div>
        </div>
        <div
            class="flex justify-between p-3 mt-4 border rounded-sm border-bottom border-slate-300"
        >
            <span>Deny permissions</span>
            <a-switch />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import { useConnectionStore } from '~/store/connection'

    export default defineComponent({
        name: 'DetailPolicy',
        components: { AtlanBtn },
        props: {
            selectedPolicy: {
                type: Object,
                required: true,
                default: () => ({}),
            },
        },
        emits: [],
        setup(props) {
            const { selectedPolicy } = toRefs(props)
            const connStore = useConnectionStore()
            const getImage = (id: string) => connStore.getImage(id)
            const connectionQfName = computed(() => {
                console.log(selectedPolicy)
                if (selectedPolicy.value.type === 'meta') {
                    const found = connStore.getList.find(
                        (conn) =>
                            conn.guid === selectedPolicy.value.connectionId
                    )
                    return found?.attributes?.qualifiedName
                }
                return selectedPolicy.value.connectionName
            })
            return {
                getImage,
                connectionQfName,
            }
        },
    })
</script>
<style lang="less" scoped></style>
