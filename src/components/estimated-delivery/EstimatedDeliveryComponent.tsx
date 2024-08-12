import { ReactNode, useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";

interface EstimatedDeliveryPropsInterface {
    businessDays: {[key: string]: boolean};
    cutOffTime: string;
    holidays: Array<string>;
    timezone: string;
    dateFormat: string;
    enableCountDownTimer: boolean;
    children: ReactNode;
    nextDayDeliveryAvailableText: string;
    nextDayDeliveryNotAvailableText: string;
    estimatedDeliveryText: string;
    timerText: {[key: string]: string}
}

const EstimatedDeliveryComponent = (props:EstimatedDeliveryPropsInterface) => {

    function getTimeZone(timeZone: string) {

        const dateFormat = new Date().toLocaleString('en-US', {timeZone: timeZone});
        
        return dateFormat;
    }

    const CurrentDate = new Date(getTimeZone(props.timezone));
    const GetHours = CurrentDate.getHours();
    const GetMinutes = CurrentDate.getMinutes();
    const isMinutesLessThan10 = GetMinutes < 10 ? '0' + GetMinutes : GetMinutes;
    const IsPastCutOffPoint = Number(props.cutOffTime.split(':').join('')) < Number(GetHours + '' + isMinutesLessThan10);
    const Hour = Number(props.cutOffTime.split(':')[0]);
    const Minutes = Number(props.cutOffTime.split(':')[1]);
    const SetDateTimeFromParams: Date = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), CurrentDate.getDate(), Hour, Minutes);
    const NextDay: Date = new Date(SetDateTimeFromParams.setDate(CurrentDate.getDate() + 1));

    const [getEstDate, setEstDate] = useState(NextDay.toDateString());
    const [getLoader, setLoader] = useState(true);

    useEffect(() => {
        findDeliveryDate(NextDay);
    }, [findDeliveryDate]);

    function dayOfWeekAsString(dayIndex: number) {
        return ["sunday", "monday","tuesday","wednesday","thursday","friday","saturday"][dayIndex] || '';
    }   
    
    function findDeliveryDate(nextDay: Date) {
        
        if(props.businessDays[dayOfWeekAsString(nextDay.getDay())] == false) {
            findDeliveryDate(new Date(nextDay.setDate(nextDay.getDate() + 1)));
        }

        if(props.businessDays[dayOfWeekAsString(nextDay.getDay())] == true) {
            if(checkHolidays(nextDay) !== true) {
                setEstDate(new Date(nextDay.setDate(nextDay.getDate() + 1)).toDateString());
                setLoader(false);
                return;
            } else {
                findDeliveryDate(new Date(nextDay.setDate(nextDay.getDate() + 1)))
            }
        }
    }

    function checkHolidays (deliveryDate:Date) {
        const HolidayArray = props.holidays.map((item) => {
            return item.replace(/-/g,"/");
        });
        return HolidayArray.includes(deliveryDate.toLocaleDateString(props.dateFormat));
    }

    return (
        <div className="estimated-delivery-container">
            {(!IsPastCutOffPoint && props.businessDays[dayOfWeekAsString(NextDay.getDay())] == true && props.businessDays[dayOfWeekAsString(CurrentDate.getDay())] == true ) &&
                <div className="delivery-wrapper">
                    {props.enableCountDownTimer && 
                        <CountdownTimer 
                            cutOffTime={props.cutOffTime} 
                            currentDate={new Date(CurrentDate.toLocaleDateString(props.dateFormat))}
                            timerText={props.timerText}
                            dateFormat={props.dateFormat}
                            timezone={props.timezone}
                        />
                    }
                    <div className="text-container">
                        <span>{props.children} <span>{props.nextDayDeliveryAvailableText}</span></span>
                        <p>{props.estimatedDeliveryText} {NextDay.toDateString()} </p>
                    </div>
                </div>
            }
            {(IsPastCutOffPoint || props.businessDays[dayOfWeekAsString(CurrentDate.getDay())] == false || props.businessDays[dayOfWeekAsString(NextDay.getDay())] == false) &&
                <div className="delivery-wrapper">
                    <div className="text-container">
                        <span>{props.children} <span>{props.nextDayDeliveryNotAvailableText}</span></span>
                        <p>{props.estimatedDeliveryText} { !getLoader ? getEstDate : 'loading...'} </p>
                    </div>
                </div>
            }
        </div>
    );
}

export default EstimatedDeliveryComponent;