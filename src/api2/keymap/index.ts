
import searchmap from "./search";
import tenantmap from "./tenant";
import workflowmap from "./workflow";
import connectionmap from "./connection";
import credentialmap from "./credential";

export default {
    ...searchmap,
    ...tenantmap,
    ...workflowmap,
    ...connectionmap,
    ...credentialmap
};
