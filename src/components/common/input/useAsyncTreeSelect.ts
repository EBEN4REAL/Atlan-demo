

import { ref, computed, watch } from 'vue'
import { useAPIPromise } from '~/services/api/useAPI';

interface TreeDataItem {
    value: string;
    key: string;
    title?: string;
    disabled?: boolean;
    children?: TreeDataItem[];
}

export default function useAsyncTreeSelect(rootData, reqConfig, resConfig) {

    const getData = (res: any) => {
        const { rootPath, labelPath, valuePath } = resConfig;

        const rootPathParts = rootPath.split('.').slice(1)

        let root = res

        rootPathParts.forEach((p: string) => {
            if (p)
                root = root[p]
        });


        const data = root.map((o: any) => {
            // labelPath - {{.name}} - a - {{.attribute.displayName}}
            const r = /\{\{(\.\w*?)\}\}/g
            const varArr = labelPath.match(r);
            let label = '';
            if (varArr?.length) {
                label = labelPath
                varArr.forEach(p => {
                    const pathParts = p.split('{{')[1].split('}}')[0].split('.').slice(1)
                    let word = o;
                    pathParts.forEach((pp: string) => {
                        word = word[pp]
                    })
                    label = label.replace(p, word)
                })
            } else {
                label = o;
                const labelPathParts = labelPath.split('.').slice(1)
                labelPathParts.forEach((p: string) => {
                    label = label[p]
                })
            }

            let value = o;
            const valuePathParts = valuePath.split('.').slice(1)
            valuePathParts.forEach((p: string | number) => {
                value = value[p]
            })

            return {
                value,
                label
            }
        })

        return data;

    }

    const onLoadData = async (n: {
        [key: string]: any
        dataRef
    }) => {
        console.log('onLoadData', n);
        const { url, method, params, body } = reqConfig
        let parsedUrl = url;
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        if (parsedUrl.includes('{{parent}}'))
            parsedUrl = parsedUrl.replace('{{parent}}', n.value)

        try {
            const response = await useAPIPromise(parsedUrl, method, { params, body })
            // eslint-disable-next-line no-param-reassign
            n.dataRef.children = [...getData(response)].map(r => ({ pid: n.value, value: r.value, title: r.label, children: undefined, isLeaf: true, key: r.value }));
        } catch (e) {
            console.log(e)
        }
    }

    const data = ref([]);


    const init = () => {
        data.value = rootData.value.map(r => ({ value: r.value, title: r.label, children: [], key: r.value }))
    }





    return {
        treeData: data,
        init,
        onLoadData

    }
};


