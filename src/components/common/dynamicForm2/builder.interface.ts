import { SelectTypes } from 'ant-design-vue/es/select';

export interface TreeDataItem {
    value: string;
    key: string;
    title?: string;
    disabled?: boolean;
    children?: TreeDataItem[];
}
export interface Rule {
    type: String,
    enabled?: Boolean,
    errorMessage?: String
    typeName?: String
}

export interface Schema {
    id: String,
    label: String,
    type: String,
    isVisible?: Boolean,
    isStringified?: Boolean,
    template?: string,
    stringifyValue?: Boolean,
    includeAll?: Boolean,
    allowIncludeAll?: Boolean,
    includeAllVal?: any,
    rules?: Rule[],
    default?: any,
    exclude?: Boolean,
    conditional?: { refID: String, refValue: any }
    value?: any,
    options?: TreeDataItem[] | SelectTypes['options'],
    children?: Schema[]
}

export interface ProcessedSchema extends Schema {
    children?: Schema[]
    parent?: String,
    parentType?: String
}

export interface ProcessedRule {
    message: string,
    trigger: string,
    required?: boolean,
    type: string,
    min?: number,
    max?: number,
    pattern?: RegExp,
}