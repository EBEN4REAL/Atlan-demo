import { reactive, Ref } from 'vue';
import { Search } from '~/api2/search';
import { useConnectionsStore } from '~/pinia/connections';
import { SearchParameters } from '~/types/atlas/attributes';

export default function useConnectionInit() {
    let body: Ref<SearchParameters> = reactive({
        typeName: "Connection"
    })
    const { } = Search.BasicSearch(body)
    return { body };
}