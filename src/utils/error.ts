 /**
     * param:
     * error: {
     *  status: NUMBER,
     *  data: Object
     * }
     * */
 
export const getErrorMessage = (error: { status: number; data: { errorMessage: any; }; }) => {
      if (error && error.status === 403) {
        return "Oops, you are not authorized to make this request, please check with admin!";
      } else if (error && error.data && error.data.errorMessage) {
        return `Error - ${error.data.errorMessage}`;
      }
    return "Unexpected error occurred, please try again!";
}