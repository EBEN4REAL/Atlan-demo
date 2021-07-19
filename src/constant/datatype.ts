


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
      "int4",
      "int2"
    ],
    image: number,
  },
  {
    id: "decimal",
    label: "Decimal",
    type: [
      "number",
      "numeric",
      "decimal",
      "float4",
      "float8",
      "double",
      "double precision",
      "real",
    ],
    image: float1,
  },
  {
    id: "text",
    label: "Text",
    type: [
      "varchar",
      "char",
      "character",
      "string",
      "text",
      "binary",
      "varbinary",
      "bpchar",
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
      "date",
      "time",
      "timestamp",
      "timestamp_ltz",
      "timestamp_ntz",
      "timestamp_tz",
      "timestampltz",
      "timestampntz",
      "timestamptz",
    ],
    image: date,
  },
  {
    id: "array",
    label: "Array",
    type: ["array"],
    image: array,
  },
  {
    id: "object",
    label: "Object",
    type: ["variant", "object"],
    image: struct,
  },
  {
    id: "geography",
    label: "Geography",
    type: ["geography", "object"],
    image: geography,
  },
];