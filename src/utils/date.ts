/**
 * 
 * @param date date timestamp
 * @returns human readable date string without time eg. 'Sun May 11,2014'
 */
export const formatDate = (date: string | number | Date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}