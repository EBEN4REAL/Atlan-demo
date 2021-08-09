import { reactive, watchEffect } from "vue";
import { toRefs } from "@vueuse/core";
import { useAPI } from "~/api/useAPI"
import { Components } from '~/api/atlas/client';

import { GET_ASSET_AUDIT } from "~/api/keyMaps/asset/index";


const useAssetAudit = (params: any, guid: string) => {
    const response = reactive({
        audits: [] as any,
        error: null as any,
        isLoading: false,
        isFetchingMore: false,
        isAllLogsFetched: true
    })



    const fetchAudits = (params: any, guid: string) => {
        const { data, error, isLoading } = useAPI<Components.Schemas.EntityAuditEventV2[]>(GET_ASSET_AUDIT, 'GET', { params, pathVariables: { guid }, cache: false })
        response.audits = data as Components.Schemas.EntityAuditEventV2[] | any
        response.error = error
        response.isLoading = isLoading.value;
        // @ts-ignore
        response.isAllLogsFetched = data?.value?.length < params.count;
    }

    const fetchMoreAudits = (fetchmoreParams: any) => {
        const { data, isLoading } = useAPI<Components.Schemas.EntityAuditEventV2[]>(GET_ASSET_AUDIT, 'GET', { params: fetchmoreParams, pathVariables: { guid }, cache: false });
        watchEffect(() => {

            if (data.value && fetchmoreParams?.startKey.length > 0) {
                response.audits.push(...data.value);
                response.isAllLogsFetched = data?.value?.length < fetchmoreParams.count
                response.isFetchingMore = isLoading.value;
            }

        })
    }
    const eventMap: any = [
        {
            id: "ENTITY_CREATE",
            color: "green",
            label: "Asset created"
        },
        {
            id: "ENTITY_UPDATE",
            color: "green",
            label: "Asset updated"
        },
        {
            id: "ENTITY_DELETE",
            color: "red",
            label: "Asset deleted"
        },
        {
            id: "TERM_ADD",
            color: "green",
            label: "Term linked"
        },
        {
            id: "TERM_DELETE",
            color: "red",
            label: "Term unlinked"
        },
        {
            id: "CLASSIFICATION_UPDATE",
            color: "green",
            label: "Classification updated"
        },
        {
            id: "CLASSIFICATION_DELETE",
            color: "red",
            label: "Classification unlinked"
        },
        {
            id: "CLASSIFICATION_ADD",
            color: "green",
            label: "Classification linked"
        },
        {
            id: "PROPAGATED_CLASSIFICATION_UPDATE",
            color: "green",
            label: "Propagated Classification updated"
        },
        {
            id: "PROPAGATED_CLASSIFICATION_DELETE",
            color: "red",
            label: "Propagated Classification unlinked"
        },
        {
            id: "PROPAGATED_CLASSIFICATION_ADD",
            color: "green",
            label: "Propagated Classification linked"
        },
        {
            id: "BUSINESS_ATTRIBUTE_UPDATE",
            color: "green",
            label: "Business metadata updated"
        }
    ];

    const getEventByAction = (asset: any) => eventMap.find((event: any) => event.id === asset.action)

    const filterClassificationTypeNameDisplayName = (parsedDetails: any) => (typeof (parsedDetails) === "object") ? parsedDetails?.typeName ?? "" :
            (typeof (parsedDetails) === "string") ? parsedDetails : ""

    const filterTermTypeNameDisplayName = (parsedDetails: any) => parsedDetails?.name ?? ""

    const getEntityUpdateLogs = (logs: any) => {
        const data = {
            displayValue: "Asset updated",
            moreinfo: false,
            value: []
        }
        console.log(logs);
        if ("attributes" in logs) {
            const { attributes } = logs;
            const owners = "ownerUsers" in attributes;
            const experts = "expertUsers" in attributes;
            const status = "assetStatus" in attributes;
            const userDescription = "userDescription" in attributes;
            if (owners) {
                const users = attributes.ownerUsers.split(",");
                if (attributes.ownerUsers === "") {
                    data.displayValue = "Removed all owners";
                    return data;
                }
                data.displayValue = "Owner details updated";
                data.moreinfo = true;
                data.value = users;
                return data;
            }
            if (experts) {
                const users = attributes.expertUsers.split(",");
                if (attributes.expertUsers === "") {
                    data.displayValue = "Removed all experts";
                    return data;
                }
                data.displayValue = "Experts details updated";
                data.moreinfo = true;
                data.value = users;
                return data;
            }

            if (status) {
                let value = attributes.assetStatus;
                value = value[0].toUpperCase() + value.slice(1);
                data.displayValue = value === "Is_null" ? "Updated status to <b>No Status</b>" : value === "Wip" ? `Updated status to <b>Draft</b>` : `Updated status to <b>${value}</b>`;
                return data;
            }

            if (userDescription) {
                const value = attributes.userDescription;
                data.displayValue = "Updated asset description"
                return data;
            }
        }
        return data;
    }

    const getDetailsForEntityAuditEvent = (auditEvent: any) => {
        if (auditEvent.details) {
            const eventDetail = auditEvent.details.split(/:(.+)/);
            let parsedDetails: any = {};
            const data = {
                displayValue: "",
                moreinfo: false,
                value: []
            }

            if (eventDetail && eventDetail.length > 2) {
                switch (auditEvent.action) {
                    case "LABEL_ADD":
                        data.displayValue = `Label <b>${eventDetail[1].trim()}</b> added`;
                        return data;
                    case "LABEL_DELETE":
                        data.displayValue = `Label <b>${eventDetail[1].trim()}</b> removed`;
                        return data;
                    case "CLASSIFICATION_ADD":
                        try {
                            // This handles the case when classification is linked using Atlan Bot user
                            // In this case, classification object comes in details
                            parsedDetails = JSON.parse(eventDetail[1].trim());

                            if (parsedDetails.typeName) {
                                data.displayValue = `Classification <b>${filterClassificationTypeNameDisplayName(
                                    parsedDetails
                                )}</b> linked`;
                                return data;
                            }
                            return null;
                        } catch (error) {
                            data.displayValue = `Classification <b>${eventDetail[1].trim()}</b> linked`;
                            return data;
                        }
                    case "CLASSIFICATION_DELETE":
                        parsedDetails = eventDetail[1].trim();
                        data.displayValue = `Classification <b>${filterClassificationTypeNameDisplayName(
                            parsedDetails
                        )}</b> unlinked`;
                        return data;
                    case "PROPAGATED_CLASSIFICATION_ADD":
                        parsedDetails = JSON.parse(eventDetail[1].trim());
                        data.displayValue = `Classification <b>${filterClassificationTypeNameDisplayName(
                            parsedDetails
                        )}</b> linked via propagation`;
                        return data;
                    case "PROPAGATED_CLASSIFICATION_DELETE":
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim());
                            data.displayValue = `Classification <b>${filterClassificationTypeNameDisplayName(
                                parsedDetails
                            )}</b> unlinked via propagation`;
                            return data;
                        } catch (error) {
                            parsedDetails = eventDetail[1].trim();
                            if (parsedDetails) {
                                data.displayValue = `Classification <b>${parsedDetails}</b> unlinked via propagation`;
                                return data;
                            }
                            return null;
                        }
                    case "TERM_ADD":
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim());
                            data.displayValue = `Term <b>${filterTermTypeNameDisplayName(
                                parsedDetails
                            )}</b> linked`;
                            return data;
                        } catch (error) {
                            return null;
                        }
                    case "TERM_DELETE":
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim());
                            data.displayValue = `Term <b>${filterTermTypeNameDisplayName(
                                parsedDetails
                            )}</b> unlinked`;
                            return data;
                        } catch (error) {
                            return null;
                        }
                    case "ENTITY_UPDATE":
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim());
                            return getEntityUpdateLogs(parsedDetails);
                        } catch (error) {
                            return null;
                        }

                    default:
                        return null;
                }
            }
        }
        return null;
    }

    const getActionUser = (user: any) => {
        if (user.startsWith("service-account"))
            return "using Atlan services";
        return `by ${user}`
    }

    fetchAudits(params, guid)
    return {
        ...toRefs(response),
        fetchAudits,
        getEventByAction,
        getDetailsForEntityAuditEvent,
        getActionUser,
        fetchMoreAudits
    }
}

export default useAssetAudit;