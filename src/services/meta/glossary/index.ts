/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'

import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'
import { Components } from '~/types/atlas/client'

const CreateGlossary = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI<Components.Schemas.AtlasGlossary>(
        map.CREATE_GLOSSARY,
        'POST',
        { body },
        options || {}
    )

const CreateCategory = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI<Components.Schemas.AtlasGlossaryCategory>(
        map.CREATE_GLOSSARY_CATEGORY,
        'POST',
        { body },
        options || {}
    )

const CreateTerm = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI<Components.Schemas.AtlasGlossaryTerm>(
        map.CREATE_GLOSSARY_TERM,
        'POST',
        { body },
        options || {}
    )

const deleteGTC = (guid: string) =>
    useAPI(
        map.DELETE_GTC,
        'DELETE',
        {
            pathVariables: {
                guid,
            },
        },
        {}
    )
export const Glossary = {
    CreateGlossary,
    CreateCategory,
    CreateTerm,
    deleteGTC,
}
