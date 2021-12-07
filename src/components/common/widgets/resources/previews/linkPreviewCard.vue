<template>
    <div class="flex p-2 border rounded">
        <div class="mr-2 min-w-link-left-col">
            <img
                :src="`https://www.google.com/s2/favicons?domain=${item?.attributes?.link}&sz=64`"
                :alt="item?.attributes?.name"
                class="h-7"
            />
        </div>
        <div class="flex flex-col">
            <a
                class="flex cursor-pointer gap-x-2 hover:underline"
                :href="`//${item?.attributes?.link}`"
                target="_blank"
                rel="noreferrer"
            >
                <span class="font-bold">{{ item?.attributes?.name }}</span>
            </a>
            <span class="text-sm text-gray-500"
                >Added by Rohan 10 minutes ago</span
            >
        </div>
    </div>
</template>

<script lang="ts">
// Vue
import { defineComponent } from 'vue'

export default defineComponent({
    components: {},
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    setup() {
        return {}
    },
})
</script>
<style lang="less" scoped>
.min-w-link-left-col {
    min-width: 2rem;
}
</style>
