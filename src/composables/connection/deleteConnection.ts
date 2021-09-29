import { AsyncStateOptions, useAsyncState } from '@vueuse/core';
import { Connection } from '~/api/auth/connection';


export default function deleteConnection(id: string, options: AsyncStateOptions) {
    console.log(id);
    const { data, mutate, isReady, error, isLoading } = Connection.Archive(id, {
        deleteAssets: true,
        deleteType: "HARD",
    }, {}, options);
    return {
        data, mutate, isReady, error, isLoading
    }
}