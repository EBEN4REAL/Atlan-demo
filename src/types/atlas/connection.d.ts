import { Components } from '~/api/atlas/client'
import { BaseAttributes } from '../asset'

export interface ConnectionAttributes extends BaseAttributes {
    connectorName?: string
    host?: string
    port?: string
    extra?: { [key: string]: any }
    integrationCredentialQualifiedName?: string
    botQualifiedName?: string
    [key: string]: any
}

export interface ConnectionType extends Components.Schemas.AtlasEntity {
    attributes: ConnectionAttributes
}
