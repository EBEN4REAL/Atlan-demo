
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';

import { SearchBasic } from '~/api/atlas/searchbasic';
import { BaseAttributes, BotsAttributes } from '~/constant/projection';
import axios, { CancelTokenSource } from 'axios';

import swrvState from '../utils/swrvState';
import { Components } from '~/api/atlas/client';
import { ConnectionType } from '~/types/atlas/connection';
import { BotsType } from '~/types/atlas/bots';
import { Avatar } from '~/api/auth/avatar';



export default function uploadAvatar() {
    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());
    let options = ref({
        cancelToken: cancelTokenSource?.value.token,
        revalidateOnFocus: false,
        dedupingInterval: 1,
        immediate: false,
        resetOnExecute: false,
    });
    let formData = ref();

    let uploadKey = ref(Date.now().toString());

    const { data, mutate, isReady, error } = Avatar.UploadAvatar("", formData, options);

    watch(data, () => {
        console.log("changed");
        uploadKey.value = Date.now().toString();
    });

    const upload = (imageData: any) => {
        const formDataObject = new FormData();
        formDataObject.append("image", imageData)
        formData.value = formDataObject;
        mutate();
    };

    return {
        upload,
        error,
        isReady,
        data,
        uploadKey
    }
}