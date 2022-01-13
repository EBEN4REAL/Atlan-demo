import iconMap from '~/components/common/icon/iconMap'
import { RequestAttributes, RequestType } from '~/types/atlas/requests'

export const primaryText: Record<
    RequestType,
    (arg: RequestAttributes) => string
> = {
    attribute: () => 'Update asset attribute',
    create_typedef: () => 'Create new classification',
    create_glossary: () => 'Create new glossary',
    create_category: () => 'Create new category',
    create_term: () => 'Create new term',
    bm_attribute: () => 'Custom metadata request',
    term_link: () => 'Link term to asset',
    attach_classification: () => 'Classification attachment request',
    purpose_policy_access: () => 'lorem ipsum',
    persona_access: () => 'lorem ipsum',
}

// Check iconMap.ts for available icons
export const requestTypeIcon: Record<RequestType, keyof typeof iconMap> = {
    attribute: 'Edit',
    create_typedef: 'Shield',
    create_glossary: 'Glossary',
    create_category: 'Category',
    create_term: 'Term',
    bm_attribute: 'Edit',
    term_link: 'Link',
    attach_classification: 'Link',
    purpose_policy_access: 'Link',
    persona_access: 'Link',
}

export const attributeCopyMapping: Record<string, string> = {
    certificateStatus: 'Certificate',
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
    attach_classification: 'Link Classification',
}

export const requestTypeTabList: { id: string; value: RequestType[] }[] = [
    { id: 'All', value: [] },
    { id: 'Metadata', value: ['attribute'] },
    {
        id: 'Glossary',
        value: [
            'create_glossary',
            'create_category',
            'create_term',
            'term_link',
        ],
    },
    {
        id: 'Classification',
        value: ['create_typedef', 'attach_classification'],
    },
    { id: 'Business metadata', value: ['bm_attribute'] },
]
