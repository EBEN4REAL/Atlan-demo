import { computed, ref, Ref } from "vue";
import { Components } from "~/api/atlas/client";
import store from "../utils/local-storage";

export default function useDiscoveryPreferences() {

    let localProjection: Ref<any[]> = ref([]);
    const projection = computed({
        get: () => {
            if (localProjection.value.length > 0) {
                return localProjection.value;
            }
            return store.get('discovery_projectiion') || [];
        },
        set: (val: any[]) => {
            localProjection.value = val;
            store.set('discovery_projectiion', val);
        }
    });


    let localAssetType: Ref<string> = ref("Table");
    const assetType = computed({
        get: () => {
            if (localAssetType) {
                return localAssetType.value;
            }
            return store.get('discovery_assettype') || "Table";
        },
        set: (val: string) => {
            localAssetType.value = val;
            store.set('discovery_assettype', val);
        }
    });


    let localFilterCriteria: Ref<Components.Schemas.FilterCriteria> = ref();
    const filterCritera = computed({
        get: () => {
            if (localFilterCriteria?.value) {
                return localFilterCriteria.value;
            }
            return store.get('discovery_filters') || {
                condition: "AND" as Components.Schemas.Condition,
                criterion: [],
            };
        },
        set: (val: Components.Schemas.FilterCriteria) => {
            localFilterCriteria.value = val;
            store.set('discovery_filters', val);
        }
    });


    return {
        projection,
        assetType,
        filterCritera
    }
}
