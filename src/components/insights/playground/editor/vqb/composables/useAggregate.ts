export function useAggregate() {
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

    function aggregateList(type: string) {
        let all = [
            {
                key: 'count',
                label: 'Count',
                excludes: [...array, ...object, ...geography],
                sort: 1,
            },
            {
                key: 'unique',
                label: 'Unique Count',
                excludes: [...array, ...object, ...geography],
                sort: 2,
            },

            {
                key: 'sum',
                label: 'Sum',
                excludes: [...text, ...date, ...array, ...object, ...geography],
                sort: 3,
            },
            {
                key: 'max',
                label: 'Max',
                excludes: [
                    ...text,
                    ...date,
                    ...boolean,
                    ...array,
                    ...object,
                    ...geography,
                ],
                sort: 4,
            },
            {
                key: 'min',
                label: 'Min',
                excludes: [
                    ...text,
                    ...date,
                    ...boolean,
                    ...array,
                    ...object,
                    ...geography,
                ],
                sort: 5,
            },
            {
                key: 'avg',
                label: 'Average',
                excludes: [...text, ...date, ...array, ...object, ...geography],
                sort: 6,
            },
        ]

        let aggregations = all.filter((el) => {
            if (el?.includes) {
                return el?.includes.find((el) => el === type?.toUpperCase())
            }
            if (el?.excludes) {
                return !el?.excludes.find((el) => el === type?.toUpperCase())
            }
            return true
        })

        return aggregations
    }
    return {
        aggregateList,
    }
}
