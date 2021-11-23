<template>
    <a-form-item :label="property.ui?.label" v-if="!property.ui?.hidden">
        <SQLSelect
            v-bind="componentProps"
            :list="list"
            v-model="localValue"
            :body="body"
            @change="handleChange"
        ></SQLSelect>
    </a-form-item>
</template>

<script>
    import { defineComponent, toRefs, computed, ref } from 'vue'

    import SQLSelect from '@common/select/sql.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            SQLSelect,
        },
        props: {
            property: {
                required: false,
                type: Object,
                default: () => {},
            },
            modelValue: {
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const { modelValue } = useVModels(props, emit)

            const localValue = ref(modelValue.value)

            const list = computed(() => {
                const temp = []
                return temp
            })

            const body = ref({
                className: 'net.snowflake.client.jdbc.SnowflakeDriver',
                jarLink:
                    'https://atlan-public.s3-eu-west-1.amazonaws.com/atlan/jdbc/snowflake.tar.gz',
                url: 'jdbc:snowflake://jv22371.ap-south-1.aws.snowflakecomputing.com?loginTimeout=5&networkTimeout=5&CLIENT_SESSION_KEEP_ALIVE=true&application=atlan',
                username: 'atlanadmin',
                password: 'Atlan#2020',
                query: property.value.ui?.query,
                extra: {
                    role: 'ACCOUNTADMIN',
                    warehouse: 'COMPUTE_WH',
                },
                connector: 'snowflake',
                authType: 'basic',
                driverProperties: {
                    username: 'atlanadmin',
                    password: 'Atlan#2020',
                },
            })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change', localValue.value)
            }

            const componentProps = computed(() => property.value.ui)
            return {
                property,
                componentProps,
                list,
                localValue,
                handleChange,
                body,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
