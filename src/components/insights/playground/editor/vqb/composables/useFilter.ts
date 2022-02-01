import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'
export function useFilter() {
    let numbers = [
        'NUMBER',
        'NUMERIC',
        'INT',
        'INTEGER',
        'BIGINT',
        'SMALLINT',
        'DECIMAL',
        'FLOAT4',
        'FLOAT8',
        'DOUBLE',
        'DOUBLE PRECISION',
        'REAL',
        'INT4',
        'INT2',
        'NUMBER',
        'PRIMITIVE_DOUBLE',
        'BOOLEAN',
    ]

    const nameMap = {
        equal: '=',
        not_equal: '<>',
        before: '<',
        after: '>',
        between: 'BETWEEN',
        exists: 'IS NOT NULL',
        does_not_exists: 'IS NULL',
        on_or_after: '>=',
        on_or_before: '<=',
        is_not_one_of: 'NOT IN',
        is_one_of: 'IN',
        start_like: 'LIKE',
        end_like: 'LIKE',
        not_contains: 'NOT LIKE',
        contains: 'LIKE',
    }

    let text = [
        'CHAR',
        'CHARACTER',
        'STRING',
        'TEXT',
        'BINARY',
        'VARBINARY',
        'BPCHAR',
        'VARCHAR',
        'ANY',
        'VARIANT',
        'OBJECT',
        'ARRAY',
    ]

    let date = [
        'DATE',
        'TIME',
        'TIMESTAMP',
        'TIMESTAMP_LTZ',
        'TIMESTAMP_NTZ',
        'IMESTAMP_TZ',
        'TIMESTAMPLTZ',
        'TIMESTAMPNTZ',
        'TIMESTAMPTZ',
    ]

    let boolean = ['BOOLEAN']
    let array = ['ARRAY']
    let object = ['VARIANT', 'OBJECT']
    let geography = ['GEOGRAPHY', 'OBJECT']

    const totalFiledsMapWithInput = {
        multi_input: 2,
        range_input: 2,
        input: 1,
        none: 1,
    }

    function filterList(type: string) {
        let all = [
            {
                key: 'number',
                includes: [...numbers],
                functions: [
                    {
                        key: 'equal',
                        type: 'input',
                        name: 'Equal to',
                    },
                    {
                        key: 'not_equal',
                        type: 'input',
                        name: 'Does not equal',
                    },
                    {
                        key: 'after',
                        type: 'input',
                        name: 'Greater than',
                    },
                    {
                        key: 'before',
                        type: 'input',
                        name: 'Smaller than',
                    },

                    {
                        key: 'exists',
                        type: 'none',
                        name: 'Exists',
                    },
                    {
                        key: 'does_not_exists',
                        type: 'none',
                        name: 'Does not exists',
                    },

                    {
                        key: 'between',
                        type: 'range_input',
                        name: 'Between',
                    },
                    {
                        key: 'is_one_of',
                        type: 'multi_input',
                        name: 'Is one of',
                    },
                    {
                        key: 'is_not_one_of',
                        type: 'multi_input',
                        name: 'Is not one of',
                    },
                ],
            },
            {
                key: 'boolean',
                includes: [...numbers],
                functions: [
                    {
                        key: 'equal',
                        type: 'input',
                        name: 'Equal to',
                    },
                    {
                        key: 'not_equal',
                        type: 'input',
                        name: 'Does not equal',
                    },
                    {
                        key: 'after',
                        type: 'input',
                        name: 'Greater than',
                    },
                    {
                        key: 'before',
                        type: 'input',
                        name: 'Smaller than',
                    },

                    {
                        key: 'exists',
                        type: 'none',
                        name: 'Exists',
                    },
                    {
                        key: 'does_not_exists',
                        type: 'none',
                        name: 'Does not exists',
                    },

                    {
                        key: 'between',
                        type: 'range_input',
                        name: 'Between',
                    },
                ],
            },
            {
                key: 'text',
                includes: [...text],
                functions: [
                    {
                        key: 'equal',
                        type: 'input',
                        name: 'Equal to',
                    },
                    {
                        key: 'not_equal',
                        type: 'input',
                        name: 'Not equal to',
                    },
                    {
                        key: 'contains',
                        type: 'input',
                        name: 'Contains',
                    },
                    {
                        key: 'not_contains',
                        type: 'input',
                        name: 'Does not contains',
                    },
                    {
                        key: 'exists',
                        type: 'none',
                        name: 'Exists',
                    },
                    {
                        key: 'does_not_exists',
                        type: 'none',
                        name: 'Does not exists',
                    },
                    {
                        key: 'start_like',
                        type: 'input',
                        name: 'Starts with',
                    },
                    {
                        key: 'end_like',
                        type: 'input',
                        name: 'Ends with',
                    },
                    {
                        key: 'is_one_of',
                        type: 'multi_input',
                        name: 'Is one of',
                    },
                    {
                        key: 'is_not_one_of',
                        type: 'multi_input',
                        name: 'Is not one of',
                    },
                ],
            },
            {
                key: 'date',
                includes: [...date],
                functions: [
                    {
                        key: 'equal',
                        type: 'input',
                        name: 'Equal to',
                    },
                    {
                        key: 'not_equal',
                        type: 'input',
                        name: 'Not equal to',
                    },
                    {
                        key: 'before',
                        type: 'input',
                        name: 'Before',
                    },
                    {
                        key: 'after',
                        type: 'input',
                        name: 'After',
                    },

                    {
                        key: 'between',
                        type: 'range_input',
                        name: 'Between',
                    },
                    {
                        key: 'exists',
                        type: 'none',
                        name: 'Exists',
                    },

                    {
                        key: 'does_not_exists',
                        type: 'none',
                        name: 'Does not exists',
                    },
                ],
            },
        ]

        let filtersList = all.filter((el) => {
            let t = el?.includes.find(
                (el) => el?.toUpperCase() === type?.toUpperCase()
            )
            return t
            // return true
        })

        return filtersList
    }

    function getInputTypeFromColumnType(columnType: string) {
        if (numbers.includes(columnType?.toUpperCase())) return 'number'
        else if (text.includes(columnType?.toUpperCase())) return 'text'
        else if (date.includes(columnType?.toUpperCase())) return 'date'
        else if (boolean.includes(columnType?.toUpperCase())) return 'number'
        else if (array.includes(columnType?.toUpperCase())) return 'array'
        else if (object.includes(columnType?.toUpperCase())) return 'text'
        else if (geography.includes(columnType?.toUpperCase()))
            return 'geography'
        return 'text'
    }

    function isFilterIsInteractive(subpanels: SubpanelFilter[]) {
        let isInteractive = false
        subpanels?.forEach((subpanel) => {
            if (subpanel?.filter?.isVariable) {
                isInteractive = true
            }
        })
        return isInteractive
    }

    return {
        totalFiledsMapWithInput,
        nameMap,
        getInputTypeFromColumnType,
        filterList,
        isFilterIsInteractive,
    }
}
