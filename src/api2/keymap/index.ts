
import searchmap from "./search";
import tenantmap from "./tenant";
import workflowmap from "./workflow";
import connectionmap from "./connection";
import runmap from "./run";

export default {
    ...searchmap,
    ...tenantmap,
    ...workflowmap,
    ...connectionmap,
    ...runmap
};
