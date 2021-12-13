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
                        name: 'Equal to'
                    },
                    {
                        key: 'not_equal',
                        type: 'input',
                        name: 'Not equal to'
                    },
                    {
                        key: 'is_one_of',
                        type: 'multi_input',
                        name: 'Is one of'
                    },
                    {
                        key: 'is_not_one_of',
                        type: 'multi_input',
                        name: 'Is not one of'
                    },
                    // {
                    //     key: 'is_null',
                    //     type: 'none',
                    //     name: 'Is null'
                    // },
                    // {
                    //     key: 'is_not_null',
                    //     type: 'none',
                    //     name: 'Is not null'
                    // },
                    {
                        key: 'exists',
                        type: 'none',
                        name: 'Exists'
                    },
                    {
                        key: 'does_not_exists',
                        type: 'none',
                        name: 'Does not exists'
                    },
                    {
                        key: 'greater_than',
                        type: 'input',
                        name: 'Greater than'
                    },
                    {
                        key: 'greater_than_equal',
                        type: 'input',
                        name: 'Greater than equal to'
                    },
                    {
                        key: 'less_than',
                        type: 'input',
                        name: 'Less than'
                    },
                    {
                        key: 'less_than_equal',
                        type: 'input',
                        name: 'Less than equal to'
                    },
                    {
                        key: 'between_and_includes',
                        type: 'range_input',
                        name: 'Between and includes'
                    },
                ]
            },
            {
                key: 'text',
                includes: [...text],
                functions: [
                    {
                        key: 'equal',
                        type: 'input',
                        name: 'Equal to'
                    },
                    {
                        key: 'not_equal',
                        type: 'input',
                        name: 'Not equal to'
                    },
                    {
                        key: 'is_one_of',
                        type: 'multi_input',
                        name: 'Is one of'
                    },
                    {
                        key: 'is_not_one_of',
                        type: 'multi_input',
                        name: 'Is not one of'
                    },
                    {
                        key: 'exists',
                        type: 'none',
                        name: 'Exists'
                    },
                    {
                        key: 'does_not_exists',
                        type: 'none',
                        name: 'Does not exists'
                    },
                    // {
                    //     key: 'like',
                    //     type: 'input',
                    //     name: 'Like'
                    // },
                    // {
                    //     key: 'is_not_like',
                    //     type: 'input',
                    //     name: 'Is not like'
                    // },
                    {
                        key: 'contains',
                        type: 'input',
                        name: 'Contains'
                    },
                    {
                        key: 'not_contains',
                        type: 'input',
                        name: 'Not contains'
                    },
                ]
            },
            {
                key: 'date',
                includes: [...date],
                functions: [
                    {
                        key: 'between_and_includes',
                        type: 'range_input',
                        name: 'Between and includes'
                    },
                    {
                        key: 'is',
                        type: 'input',
                        name: 'Is'
                    },
                    {
                        key: 'before',
                        type: 'input',
                        name: 'Earlier than /  before'
                    },
                    {
                        key: 'after',
                        type: 'input',
                        name: 'Later than /  after'
                    },
                    // {
                    //     key: 'is_one_of',
                    //     type: 'multi_input',
                    //     name: 'Is one of'
                    // },
                    // {
                    //     key: 'is_not_one_of',
                    //     type: 'multi_input',
                    //     name: 'Is not one of'
                    // },
                    // {
                    //     key: 'exists',
                    //     type: 'none',
                    //     name: 'Exists'
                    // },
                    // {
                    //     key: 'does_not_exists',
                    //     type: 'none',
                    //     name: 'Does not exists'
                    // },
                    // {
                    //     key: 'like',
                    //     type: 'input',
                    //     name: 'Like'
                    // },
                    // {
                    //     key: 'is_not_like',
                    //     type: 'input',
                    //     name: 'Is not like'
                    // },
                    // {
                    //     key: 'contains',
                    //     type: 'input',
                    //     name: 'Contains'
                    // },
                    // {
                    //     key: 'not_contains',
                    //     type: 'input',
                    //     name: 'Not contains'
                    // },
                ]
            },
            
        ]

        let filtersList = all.filter((el) => {
            return el?.includes.find((el) => el === type?.toUpperCase())
            // return true
        })

        return filtersList
    }
    return {
    filterList,
    }
}
