import { AsyncStateOptions, useAsyncState } from '@vueuse/core';
import { Connection } from '~/api/auth/connection';


export default function deleteConnection(id: string, options: AsyncStateOptions) {
    console.log(id);
    const { state, execute, isReady, error } = useAsyncState(() => Connection.Archive(id), {}, options);
    return {
        state, execute, isReady, error
    }
}