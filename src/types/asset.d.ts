import { Components } from '~/api/atlas/client'

export interface BaseAttributes {
    name?: string
    description?: string
    certificateStatus?: string
    createTime: Date
    qualifiedName: string
}

export interface AtlanTableAttributes extends BaseAttributes {
    rowCount?: number
}

export interface AtlanConnectionAttributes extends BaseAttributes {
    integrationName?: string
    allowQuery?: boolean
    allowQueryPreview?: boolean
}
