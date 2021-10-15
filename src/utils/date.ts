/**
 * 
 * @param date date timestamp
 * @returns human readable date string without time eg. 
 */
export const formatDate = (date: string | number | Date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2)
        month = `0${month}`;
    if (day.length < 2)
        day = `0${day}`;

    return [year, month, day].join('-');
}

export const formatDateTime = (date: Date, locale = 'en-US') => {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'medium' }).format(date)
}

export function timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    console.log('calculated days', days);

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    console.log('calculated hours', hours);

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    console.log('minutes', minutes);

    // calculate seconds
    const seconds = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= seconds * 60;
    console.log('seconds', seconds);

    let difference = '';
    if (days > 0) {
        difference += (days === 1) ? `${days} d, ` : `${days} d, `;
    }

    difference += (hours === 0 || hours === 1) ? `${hours} h, ` : `${hours} h, `;

    difference += (minutes === 0 || hours === 1) ? `${minutes} m` : `${minutes} m`;

    difference += (minutes === 0 || hours === 1) ? `${seconds} s` : `${seconds} s`;

    return difference;
}