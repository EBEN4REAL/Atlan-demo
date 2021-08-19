// * Composables
import useEnums from "@/admin/enums/composables/useEnums";
import { computed } from "vue";
import { useBusinessMetadataStore } from '~/store/businessMetadata'

export default function useBusinessMetadataHelper() {
    const { enumListData: enumsList } = useEnums();
    const businessMetadataStore = useBusinessMetadataStore()
    const getDatatypeOfAttribute = (typeName: string | string[]) => {
        if (typeName && typeof typeName !== "undefined") {
            if (
                typeName.includes("int") ||
                typeName.includes("double") ||
                typeName.includes("float") ||
                typeName.includes("byte") ||
                typeName.includes("short") ||
                typeName.includes("long")
            ) {
                if (typeName.includes("array")) {
                    return `array<number>`;
                }
                return `number`;
            } if (typeName.includes("date")) {
                if (typeName.includes("array")) {
                    return `array<date>`;
                }
                return `date`;
            } if (typeName.includes("boolean")) {
                return `boolean`;
            } if (typeName.includes("string")) {
                if (typeName.includes("array")) {
                    return `array<text>`;
                }
                return `text`;
            } if (typeName) {
                const reqIndex = enumsList.value.findIndex(enumitem =>
                    typeName.includes(enumitem.name)
                );
                if (reqIndex > -1) {
                    return {
                        typeName,
                        type: "enum",
                        isMultivalues: typeName.includes("array"),
                        enum: JSON.parse(JSON.stringify(enumsList.value[reqIndex])),
                    };
                }
                return typeName;
            }
        }

        return typeName || "";
    };

    const bmFiltersList = computed(() => {
        if (businessMetadataStore.getBusinessMetadataList?.length) {
            const bmFiltersList =
                businessMetadataStore.getBusinessMetadataList
                    .filter((bm) =>
                        bm.attributeDefs.some(
                            (a) => a.options?.isFacet === 'true'
                        )
                    )
                    .map((bm) => ({
                        id: bm.name,
                        label: bm.options.displayName,
                        component: 'businessMetadata',
                        image: bm.options.image || '',
                        overallCondition: 'OR',
                        filters: [
                            {
                                attributeName: '',
                                condition: 'OR',
                                isMultiple: false,
                                operator: 'eq',
                            },
                        ],
                        isDeleted: false,
                        isDisabled: false,
                        exclude: false,
                    }))
            return [...bmFiltersList]
        }
        return []
    })

    /**
             * @desc consist of BM objects items with isFacet set to true, excluding isFacet false attribtues
             * */
    const bmDataMap = computed(() => {
        if (businessMetadataStore.getBusinessMetadataList?.length) {
            const filterableList =
                businessMetadataStore.getBusinessMetadataList
                    .filter((bm) =>
                        bm.attributeDefs.some(
                            (a) => a.options?.isFacet === 'true'
                        )
                    )
                    .map((bm) => ({
                        [bm.name]: {
                            applied: {},
                            list: {
                                ...bm,
                                attributeDefs: bm.attributeDefs.filter(
                                    (a) => a.options?.isFacet === 'true'
                                ),
                            },
                        },
                    }))
            return Object.assign({}, ...filterableList)
        }
        return {}
    })
    return {
        getDatatypeOfAttribute,
        businessMetadataStore,
        bmFiltersList,
        bmDataMap
    }
}