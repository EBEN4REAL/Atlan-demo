import { AsyncStateOptions, useAsyncState } from '@vueuse/core';
import { Ref } from 'vue';
import { Components } from '~/api/atlas/client';
import { Entity } from '~/api/atlas/entity';

export default function updateAsset(body: Ref<Components.Schemas.AtlasEntitiesWithExtInfo>, options: AsyncStateOptions) {
    const { state, execute, isReady, error } = useAsyncState(() => Entity.BulkUpdate(body.value), {}, options);
    return {
        state, execute, isReady, error
    }
}