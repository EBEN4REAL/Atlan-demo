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

    function filterList(type: string) {
        let all = [
            {
                key: 'number',
                includes: [...numbers],
                functions: [
                    {
                        key: 'equal',
                        type: 'input',
                        name: 'Equal',
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
            return el?.includes.find((el) => el === type?.toUpperCase())
            // return true
        })

        return filtersList
    }

    function getInputTypeFromColumnType(columnType: string) {
        if (numbers.includes(columnType)) return 'number'
        if (text.includes(columnType)) return 'text'
        if (date.includes(columnType)) return 'date'
        if (boolean.includes(columnType)) return 'boolean'
        if (array.includes(columnType)) return 'array'
        if (object.includes(columnType)) return 'object'
        if (geography.includes(columnType)) return 'geography'
    }
    return {
        nameMap,
        getInputTypeFromColumnType,
        filterList,
    }
}
