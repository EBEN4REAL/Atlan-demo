<template>
    <span
        >Say 👋 Hello, to the newly added
        <b>{{ data.value.length > 1 ? 'Owners' : 'Owner' }}</b></span
    >
    <div class="flex flex-wrap mt-3 text-sm border border-transparent rounded">
        <template v-for="user in splittedOwners.a" :key="user">
            <div
                class="
                    flex
                    items-center
                    px-3
                    py-1.5
                    mb-3
                    mr-3
                    font-bold
                    rounded-full
                    bg-gray-light
                    text-gray-700
                    group
                    hover:bg-primary hover:text-white
                    cursor-pointer
                "
                @click.stop="() => handleClickUser(user)"
            >
                <img
                    src="https://picsum.photos/id/237/50/50"
                    alt="view"
                    class="w-4 h-4 mr-2 rounded-full"
                />
                <div class="mb-0 text-sm font-bold capitalize truncate">
                    {{ user }}
                </div>
            </div></template
        ><template v-if="showAll"
            ><template v-for="user in splittedOwners.b" :key="user">
                <div
                    class="
                        flex
                        items-center
                        px-3
                        py-1.5
                        mb-3
                        mr-3
                        font-bold
                        rounded-full
                        bg-gray-light
                        text-gray-700
                        group
                        hover:bg-primary hover:text-white
                        cursor-pointer
                    "
                    @click.stop="() => handleClickUser(user)"
                >
                    <img
                        src="https://picsum.photos/id/237/50/50"
                        alt="view"
                        class="w-4 h-4 mr-2 rounded-full"
                    />
                    <div
                        class="mb-0 text-sm font-bold capitalize truncate  max-owner-name-width"
                    >
                        {{ user }}
                    </div>
                </div></template
            ></template
        >
        <div
            v-if="splittedOwners.b.length > 0 && !showAll"
            class="flex items-center mb-3 mr-3 cursor-pointer"
            @click="() => toggleAllOwners(true)"
        >
            <span class="px-1 py-0.5 text-sm font-bold rounded text-primary">
                and {{ splittedOwners.b.length }} more
            </span>
        </div>
        <div
            v-if="splittedOwners.b.length > 0 && showAll"
            class="flex items-center justify-center mb-3 mr-3 cursor-pointer"
            @click="() => toggleAllOwners(false)"
        >
            <span class="px-1 py-0.5 text-sm font-bold rounded text-primary">
                show less
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import { useUserPreview } from '~/composables/user/showUserPreview'

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
            const showAll = ref<boolean>(false)

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about'] })
            }
            const toggleAllOwners = (state: boolean) => {
                showAll.value = state
            }

            const splitArray = (sizeofSplit: number, arr: any[]) => {
                if (sizeofSplit >= arr.length) {
                    return {
                        a: [...arr],
                        b: [],
                    }
                }
                const a: any[] = arr.slice(0, sizeofSplit)
                const b: any[] = arr.slice(sizeofSplit, arr.length)
                return {
                    a,
                    b,
                }
            }
            const splittedOwners = ref(splitArray(5, props.data.value))

            return { handleClickUser, splittedOwners, showAll, toggleAllOwners }
        },
    })
</script>

<style lang="less" scoped>
    .max-owner-name-width {
        max-width: 10rem;
    }
</style>
