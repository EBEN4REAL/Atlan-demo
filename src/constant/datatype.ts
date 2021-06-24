


import number from "~/assets/images/dataType/number.svg";
import float1 from "~/assets/images/dataType/float1.svg";
import boolean from "~/assets/images/dataType/boolean.svg";
import string from "~/assets/images/dataType/string.svg";
import date from "~/assets/images/dataType/date.svg";
import array from "~/assets/images/dataType/array.svg";
import struct from "~/assets/images/dataType/struct.svg";
import geography from "~/assets/images/dataType/geography.svg";

export const dataTypeList = [
  {
    id: "number",
    label: "Number",
    type: [
      "NUMBER",
      "NUMERIC",
      "INT",
      "INTEGER",
      "BIGINT",
      "SMALLINT",
      "DECIMAL",
      "FLOAT4",
      "FLOAT8",
      "DOUBLE",
      "DOUBLE PRECISION",
      "REAL",
    ],
    image: number,
  },
  {
    id: "decimal",
    label: "Decimal",
    type: [
      "NUMBER",
      "NUMERIC",
      "DECIMAL",
      "FLOAT4",
      "FLOAT8",
      "DOUBLE",
      "DOUBLE PRECISION",
      "REAL",
    ],
    image: float1,
  },
  {
    id: "text",
    label: "Text",
    type: [
      "VARCHAR",
      "CHAR",
      "CHARACTER",
      "STRING",
      "TEXT",
      "BINARY",
      "VARBINARY",
    ],
    image: string,
  },
  {
    id: "boolean",
    label: "Boolean",
    type: ["BOOLEAN"],
    image: boolean,
  },
  {
    id: "date",
    label: "Date/Timestamp",
    type: [
      "DATE",
      "TIME",
      "TIMESTAMP",
      "TIMESTAMP_LTZ",
      "TIMESTAMP_NTZ",
      "IMESTAMP_TZ",
      "TIMESTAMPLTZ",
      "TIMESTAMPNTZ",
      "TIMESTAMPTZ",
    ],
    image: date,
  },
  {
    id: "array",
    label: "Array",
    type: ["ARRAY"],
    image: array,
  },
  {
    id: "object",
    label: "Object",
    type: ["VARIANT", "OBJECT"],
    image: struct,
  },
  {
    id: "geography",
    label: "Geography",
    type: ["GEOGRAPHY", "OBJECT"],
    image: geography,
  },
];