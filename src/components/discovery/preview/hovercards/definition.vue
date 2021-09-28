<template>
    <a-popover placement="left">
        <template #content>
            <pre>{{ displaySQL }}</pre>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import { format } from 'sql-formatter'
    import { highlight } from 'sql-highlight'

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

                // return format(sql.value, {
                //     language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                //     indent: '    ', // Defaults to two spaces

                //     linesBetweenQueries: 1, // Defaults to 1
                // })
            })

            return {
                displaySQL,
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
