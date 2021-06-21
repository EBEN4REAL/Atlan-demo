import { useAPI } from "~/api/useAPI";
// import { reactive, Ref, toRefs } from 'vue';
import differenceWith from "lodash/differenceWith";

import { GET_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";
import { ADD_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";
const useBusinessMetadata = () => {

    let { data: bmResponse, error, isLoading: loading } = useAPI(
        GET_BUSINESS_METADATA,
        "GET",
        { params: { type: "BUSINESS_METADATA" }, cache: true }
    );

    // methods

    const getBusinessMetadatAttributesNames = () => {
        const reqBmAttrNames: string[] = [];
        if (
            bmResponse?.value?.businessMetadataDefs &&
            bmResponse.value.businessMetadataDefs.length
        ) {
            bmResponse.value.businessMetadataDefs.forEach(
                (bm: { attributeDefs: any[]; name: any }) => {
                    if (bm.attributeDefs && bm.attributeDefs.length) {
                        bm.attributeDefs.forEach(attr => {
                            reqBmAttrNames.push(`${bm.name}.${attr.name}`);
                        });
                    }
                }
            );
        }
        return reqBmAttrNames;
    };

    const getBusinessMetadataAttributesForTypeNames = (
        types: string | any[],
        appliedBmAttributesToAsset: any[]
    ) => {
        const reqBms: any[] = [];
        if (
            types &&
            types.length &&
            bmResponse?.value?.businessMetadataDefs &&
            bmResponse.value.businessMetadataDefs.length
        ) {
            bmResponse.value.businessMetadataDefs.forEach(bm => {
                if (bm.attributeDefs && bm.attributeDefs.length && !bm.isArchived) {
                    const reqBmAttrs: any[] = [];
                    const selectedBmCollection = appliedBmAttributesToAsset.find(
                        c => c.bm === bm.name
                    );
                    let attributesList = [...bm.attributeDefs];
                    if (selectedBmCollection && selectedBmCollection.attributes) {
                        attributesList = differenceWith(
                            bm.attributeDefs,
                            selectedBmCollection.attributes,
                            (a: { name: any }, b: { name: any }) => a.name === b.name
                        );
                    }
                    attributesList.forEach(attr => {
                        if (attr.options && attr.options.applicableEntityTypes) {
                            try {
                                const applicableEntityTypes = JSON.parse(
                                    attr.options.applicableEntityTypes
                                );
                                if (
                                    Array.isArray(applicableEntityTypes) &&
                                    applicableEntityTypes.some(
                                        item => types.includes(item) || item.includes("AtlanAsset")
                                    )
                                ) {
                                    reqBmAttrs.push(attr);
                                }
                            } catch (error) {
                                console.log("error", error);
                            }
                        }
                    });
                    if (reqBmAttrs && reqBmAttrs.length) {
                        reqBms.push({
                            ...bm,
                            attributeDefs: reqBmAttrs,
                        });
                    }
                }
            });
        }
        return reqBms;
    };

    const getBusinessMetadataAttributeProjection = () => {
        const reqBmAttrNames: string[] = [];
        if (
            bmResponse?.value?.businessMetadataDefs &&
            bmResponse.value.businessMetadataDefs.length
        ) {
            bmResponse.value.businessMetadataDefs.forEach(bm => {
                if (bm.attributeDefs && bm.attributeDefs.length && !bm.isArchived) {
                    bm.attributeDefs.forEach(attr => {
                        reqBmAttrNames.push(`${bm.name}.${attr.name}`);
                    });
                }
            });
        }
        return reqBmAttrNames;
    };

    const businessMetadataAppendToList = (value: { guid: any }) => {
        bmResponse.value.businessMetadataDefs = bmResponse.value.businessMetadataDefs.map(
            item => {
                if (item.guid === value.guid) {
                    return { ...item, ...value };
                }
                return item;
            }
        );
    };

    const updateBusinessMetadataInList = (value: { guid: any }) => {
        bmResponse.value.businessMetadataDefs = bmResponse.value.businessMetadataDefs.map(
            (item: { guid: any }) => {
                if (item.guid === value.guid) {
                    return { ...item, ...value };
                }
                return item;
            }
        );
    };
    const addNewBusinessMetadata = (payload: any) => {
        const { data: promise, error } = useAPI(ADD_BUSINESS_METADATA, "POST", { cache: false, body: payload, getPromise: true })
        return { promise, error };
    }

    const updateNewBusinessMetadata = (payload: any) => {
        const { data: promise, error, } = useAPI(ADD_BUSINESS_METADATA, "PUT", { cache: false, body: payload, getPromise: true })
        return { promise, error };
    }

    return {
        bmResponse,
        error,
        loading,
        getBusinessMetadatAttributesNames,
        getBusinessMetadataAttributesForTypeNames,
        getBusinessMetadataAttributeProjection,
        businessMetadataAppendToList,
        addNewBusinessMetadata,
        updateBusinessMetadataInList,
        updateNewBusinessMetadata
    };
};
export default useBusinessMetadata;
