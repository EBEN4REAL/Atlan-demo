

import { Components } from "~/types/atlas/client";
import { SourceList } from "~/constant/source";
import { BaseAttributes } from "../asset";


export interface ConfigAttributes {
    id: string,
    label: string,
    allowCustom: boolean
    default: string | number,
    enumConfig: any[],
    info: string,
    isMandatory: boolean,
    isVisible: boolean,
    order: number,
    placeholder: string,
    prefix: string,
    rules: any[],
    type: string,
}

export interface Config {
    attributes: ConfigAttributes
}


export interface CredentialAuthConfigAttributes {
    id: string,
    label: string,
    config: ConfigAttributes[]
}

export interface CredentialAuthConfig {
    attributes: CredentialAuthConfigAttributes
    typeName: string
}


export interface CredentialConfigAttributes {
    auth: CredentialAuthConfig[],
    connType: Config,
    extra: Config[],
    database: Config,
    host: Config,
    port: Config,
    [key: string]: any
}

export interface CredentialConfig {
    attributes: CredentialConfigAttributes
    typeName: string
}

export interface BotConfigAttributes {
    argumentsTemplate: { [key: string]: any },
    credential: CredentialConfig,
    frontend: Config[],
    jdbcConfigTemplate: { [key: string]: any },
    [key: string]: any
}

export interface BotConfig {
    attributes: BotConfigAttributes
    typeName: string
}

export interface BotsAttributes extends BaseAttributes {
    integrationName?: string
    config: BotConfig
    [key: string]: any
}

export interface BotsType extends Components.Schemas.AtlasEntity {
    attributes: BotsAttributes,
}

