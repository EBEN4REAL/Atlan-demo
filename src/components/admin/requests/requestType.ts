import { iconName } from '~/components/common/icon/iconMap'
import { RequestAttributes, RequestType } from '~/types/atlas/requests'

export const primaryText: Record<
    RequestType,
    (arg: RequestAttributes) => string
> = {
    attribute: () => 'Attribute update request',
    create_typedef: () => 'Typedef creation request',
    create_glossary: () => 'Glossary creation request',
    create_category: () => 'Category creation request',
    create_term: () => 'Term creation request',
    bm_attribute: () => 'Custom metadata request',
    term_link: () => 'Term linkage request',
    attach_classification: () => 'Classification attachment request',
}

// Check iconMap.ts for available icons
export const requestTypeIcon: Record<RequestType, iconName> = {
    attribute: 'Edit',
    create_typedef: 'Link',
    create_glossary: 'Link',
    create_category: 'Link',
    create_term: 'Link',
    bm_attribute: 'Link',
    term_link: 'Link',
    attach_classification: 'Link',
}

export const attributeCopyMapping: Record<string, string> = {
    assetStatus: 'Status',
    userDescription: 'Description',
}

export const typeCopyMapping: Record<string, string> = {
    attribute: 'Update',
    create_typedef: 'Create Classification',
    create_glossary: 'Create Glossary',
    create_category: 'Create Category',
    create_term: 'Create Term',
    bm_attribute: 'Update',
    term_link: 'Link Term',
    attach_classification: 'Attach Classification',
}
