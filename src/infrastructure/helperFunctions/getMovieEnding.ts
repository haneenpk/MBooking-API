export function getEndingTime(startTime: string, duration: any) {
    
    let [startHourS, startMinuteS, startMeridian] = startTime.split(/:|(?=[AP]M)/);
    let startHour = parseInt(startHourS);
    let startMinute = parseInt(startMinuteS);

    if(startMeridian === "PM" && startHour !== 12){
        startHour += 12
    } else if(startHour === 12 && startMeridian === "AM"){
        startHour = 0
    }

    let startTimeObj = {
        hour: startHour,
        minute: startMinute
    }
    
    let [durationHour, durationMinute] = duration.split(':').map(Number);
    let endHour = startHour + durationHour;
    let endMinute = startMinute + durationMinute;
    
    
    // // Adjust the end time if it exceeds 59 minutes or 23 hours
    if (endMinute >= 60) {
        endHour += Math.floor(endMinute / 60);
        endMinute %= 60;
    }

    let endTimeObj = {
        hour: endHour,
        minute: endMinute
    }
    
    return [startTimeObj, endTimeObj]
}