export function calculateDuration(startDate, endDate) {
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("Invalid date provided");
        return 0; 
    }

    const differenceInMillis = end - start;

    if (differenceInMillis < 0) {
        console.warn("End date is earlier than start date");
        return 0;
    }

    const days = differenceInMillis / (1000 * 60 * 60 * 24);

    return Math.ceil(days); 
}
