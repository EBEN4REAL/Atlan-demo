<template>
    <div style="width: 400px">
        <a-button-group>
            <a-button
                type="secondary"
                :disabled="pagination.current === 1"
                @click="handlePagination(pagination.current - 1)"
            >
                <AtlanIcon icon="CaretLeft" class="h-3"></AtlanIcon>
            </a-button>
            <a-popover>
                <template #content>
                    <span
                        v-for="item in pagination.pageSize - 1"
                        :key="item"
                        class="block px-5 py-1 text-center bg-white rounded  hover:bg-gray-50"
                        >{{ item }}</span
                    >
                </template>
                <a-button type="secondary">
                    {{ pagination.current }} of
                    {{ pagination.pageSize - 1 }}</a-button
                >
            </a-popover>
            <a-button
                type="secondary"
                :disabled="pagination.current === pagination.pageSize"
                @click="handlePagination(pagination.current + 1)"
            >
                <AtlanIcon icon="CaretRight" class="h-3"></AtlanIcon>
            </a-button>
        </a-button-group>
    </div>
</template>
