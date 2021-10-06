
import { AsyncStateOptions } from '@vueuse/core';
import { Ref, ref } from 'vue';
import { Components } from '~/api/auth/client';
import { Credential } from '~/api/auth/credential';

export default function updateCredential(
    id: Ref<string>,
    initialBody: Ref<Components.Schemas.Credential>,
    asyncOpts: AsyncStateOptions
) {
    const body = ref({
        ...initialBody
    });

    const { data, mutate, error: isError, isReady, isLoading } = Credential.UpdateCredential(id.value, body, {}, asyncOpts);


    const replaceBody = (payload: any) => {
        body.value = payload;
        mutate();
    }

    return {
        data, mutate, isReady, isError, replaceBody, isLoading
    }
}