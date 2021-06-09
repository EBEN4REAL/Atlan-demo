

import { Components } from "~/api/atlas/client";
import { BaseAttributes } from "../asset";

export interface ConnectionAttributes extends BaseAttributes {
    integrationName?: string;
    host?: string;
    port?: string;
    extra?: { [key: string]: any },
    integrationCredentialQualifiedName?: string;
    [key: string]: any
}

export interface ConnectionType extends Components.Schemas.AtlasEntity {
    attributes: ConnectionAttributes
}