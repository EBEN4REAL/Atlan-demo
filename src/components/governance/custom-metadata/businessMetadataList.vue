<template>
    <ExplorerList
        :list="finalList"
        :selected="selectedBm?.guid"
        data-key="guid"
        :item-class="{ normal: 'bg-blue-50', hovered: 'hover:bg-blue-50' }"
        @update:selected="selectBm"
    >
        <template #default="{ item, isSelected }">
            <div class="flex items-center ">
                    <div
                        class="mr-1 overflow-hidden bg-gray-100 rounded cursor-pointer "
                        style="width: 16px; height: 16px"
                    >
                        <img
                            v-if="item?.options?.imagePath"
                            :src="imageUrl(item)"
                            alt=""
                            class="object-cover w-full"
                            style="height: 16px"
                        />
                        <AtlanIcon v-else icon="NoAvatar" />
                    </div>
                    <p
                        class="pr-2 m-0 overflow-hidden text-sm truncate"
                        :class="isSelected ? 'text-primary' : 'text-gray'"
                    >
                        {{ item.displayName || item.name }}
                        <sup v-if="item && item.guid === 'new'"> * </sup>
                    </p>
            </div>
        </template>
    </ExplorerList>
</template>
<script lang="ts">
    import { defineComponent, toRefs, computed } from 'vue'
    import ExplorerList from '@/admin/common/explorerList.vue'

    export default defineComponent({
        components: { ExplorerList },
        props: {
            finalList: { type: Object, required: true },
            selectedBm: { type: Object, required: true },
        },
        emits: ['selectBm'],
        setup(props, context) {
            const { finalList, selectedBm } = toRefs(props)

            // * Methods
            const selectBm = (id: string) => {
                const item = finalList.value.find((bm) => bm.guid === id)
                context.emit('selectBm', item)
            }

            const imageUrl = (bm) =>
                `${window.location.origin}/api/service${bm?.options?.imagePath}`

            return {
                selectBm,
                imageUrl,
            }
        },
    })
</script>
