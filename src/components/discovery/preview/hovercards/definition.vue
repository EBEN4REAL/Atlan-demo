<template>
    <a-popover placement="left">
        <template #content>
            <pre v-html="displaySQL"></pre>
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
                return highlight(
                    format(sql.value, {
                        language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                        indent: '    ', // Defaults to two spaces

                        linesBetweenQueries: 1, // Defaults to 1
                    }),
                    {
                        html: true,
                    }
                )

                return format(sql.value, {
                    language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                    indent: '    ', // Defaults to two spaces

                    linesBetweenQueries: 1, // Defaults to 1
                })
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
    }
</style>
