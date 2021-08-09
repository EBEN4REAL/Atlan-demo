import { reactive, Ref } from 'vue';
import { Search } from '~/api2/search';
import { useConnectionsStore } from '~/store/connections';
import { SearchParameters } from '~/types/atlas/attributes';

export default function useConnectionInit() {
    const body: Ref<SearchParameters> = reactive({
        typeName: 'Connection',
    });
    const {} = Search.BasicSearch(body);
    return { body };
}
