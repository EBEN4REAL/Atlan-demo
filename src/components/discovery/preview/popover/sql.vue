<template>
    <a-popover
        placement="left"
        :visible="isVisible"
        @mouseenter="handleHover"
        @mouseleave="handleHover"
    >
        <template #content>
            <pre>{{ displaySQL }}</pre>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs, ref } from 'vue'
    import { format } from 'sql-formatter'

    export default defineComponent({
        props: {
            sql: {
                type: String,
                required: true,
                default: () => '~',
            },
        },
        setup(props) {
            const { sql } = toRefs(props)

            const displaySQL = computed(() => {
                return format(sql.value, {})
            })
            const isVisible = ref(false)

            const handleHover = () => {
                if (!displaySQL.value) return
                isVisible.value = !isVisible.value
            }

            return {
                displaySQL,
                handleHover,
                isVisible,
            }
        },
    })
</script>

<style lang="less">
    code.sql {
        font-family: monospace;
    }

    .sql-hl-keyword {
        @apply font-bold;
        color: #f000f0;
    }

    .sql-hl-function {
        color: #ff0000;
    }
    .sql-hl-number {
        color: #282c34;
    }
    .sql-hl-string {
        color: #282c34;
    }
    .sql-hl-special {
        color: #56b6c2;
    }
    .sql-hl-bracket {
        color: #56b6c2;
    }
</style>
