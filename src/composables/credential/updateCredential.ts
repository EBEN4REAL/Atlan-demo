
import { AsyncStateOptions, useAsyncState } from '@vueuse/core';
import { Ref } from 'vue';
import { Components } from '~/api/auth/client';
import { Credential } from '~/api/auth/credential';

export default function updateCredential(id: Ref<string>, body: Ref<Components.Schemas.Credential>, options: AsyncStateOptions) {
    const { state, execute, isReady, error } = useAsyncState(() => Credential.UpdateCredential(id.value, body.value), {}, options);
    return {
        state, execute, isReady, error
    }
}