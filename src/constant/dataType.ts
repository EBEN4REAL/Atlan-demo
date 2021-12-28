import number from '~/assets/images/dataType/number.svg'
import float1 from '~/assets/images/dataType/float1.svg'
import boolean from '~/assets/images/dataType/boolean.svg'
import string from '~/assets/images/dataType/string.svg'
import date from '~/assets/images/dataType/date.svg'
import array from '~/assets/images/dataType/array.svg'
import struct from '~/assets/images/dataType/struct.svg'
import geography from '~/assets/images/dataType/geography.svg'
import variant from '~/assets/images/dataType/variant.svg'

export const images = {
    Number: number,
    Decimal: float1,
    Boolean: boolean,
    Text: string,
    DateTime: date,
    Array: array,
    Object: struct,
    Geography: geography,
    Variant: variant,
}

export const dataTypeCategoryList = [
    {
        id: 'number',
        label: 'Number',
        type: [
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
        ],
        image: number,
        imageText: 'number',
    },
    {
        id: 'decimal',
        label: 'Decimal',
        type: [
            'NUMERIC',
            'DECIMAL',
            'FLOAT4',
            'FLOAT8',
            'DOUBLE',
            'DOUBLE PRECISION',
            'REAL',
            'PRIMITIVE_DOUBLE',
        ],
        image: float1,
        imageText: 'float1',
    },
    {
        id: 'text',
        label: 'Text',
        type: [
            'CHAR',
            'CHARACTER',
            'STRING',
            'TEXT',
            'BINARY',
            'VARBINARY',
            'BPCHAR',
            'VARCHAR',
        ],
        image: string,
        imageText: 'string',
    },
    {
        id: 'boolean',
        label: 'Boolean',
        type: ['BOOLEAN'],
        image: boolean,
        imageText: 'boolean',
    },
    {
        id: 'dateTime',
        label: 'DateTime',
        type: [
            'DATE',
            'TIME',
            'TIMESTAMP',
            'TIMESTAMP_LTZ',
            'TIMESTAMP_NTZ',
            'IMESTAMP_TZ',
            'TIMESTAMPLTZ',
            'TIMESTAMPNTZ',
            'TIMESTAMPTZ',
        ],
        image: date,
        imageText: 'date',
    },
    {
        id: 'array',
        label: 'Array',
        type: ['ARRAY'],
        image: array,
        imageText: 'array',
    },
    {
        id: 'variant',
        label: 'Variant',
        type: ['VARIANT', 'ANY'],
        image: variant,
    },
    {
        id: 'object',
        label: 'Object',
        type: ['OBJECT'],
        image: struct,
        imageText: 'struct',
    },
    {
        id: 'geography',
        label: 'Geography',
        type: ['GEOGRAPHY'],
        image: geography,
        imageText: 'geography',
    },
]
