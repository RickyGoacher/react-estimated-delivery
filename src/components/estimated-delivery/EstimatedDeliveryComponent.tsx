import { ReactNode, useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";

interface EstimatedDeliveryPropsInterface {
    businessDays: {[key: string]: boolean};
    deliveryDays: {[key: string]: boolean};
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
    orderWithinText: string;
    isNextDayAvailable: boolean;
    deliveryDayIncrement: number;
    showDateRange: boolean;
    dateRange: number;
    loadingText: string;
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

    const [getEstDate, setEstDate] = useState(SetDateTimeFromParams);
    const [getLoader, setLoader] = useState(true);
    const [getNextDay, setNextDay] = useState(false);

    useEffect(() => {
        if(getLoader == true) {
            findDeliveryDate(SetDateTimeFromParams, false);
        }
    }, [getLoader, findDeliveryDate]);

    function dayOfWeekAsString(dayIndex: number) {
        return ["sunday", "monday","tuesday","wednesday","thursday","friday","saturday"][dayIndex] || '';
    }   
    
    function findDeliveryDate(checkDay: Date, businessDayPassed: boolean) {

        const firstIncrement = businessDayPassed ? props.deliveryDayIncrement : 1;

        let tomorrow = new Date(new Date().setDate(checkDay.getDate() + firstIncrement));

        if(checkHolidays(checkDay) !== true) {

            if(CurrentDate.getDate() == checkDay.getDate() && !IsPastCutOffPoint && props.isNextDayAvailable) {
                if(
                    props.businessDays[dayOfWeekAsString(CurrentDate.getDay())] == true && 
                    props.deliveryDays[dayOfWeekAsString(tomorrow.getDay())] == true
                ) {
                    setEstDate(tomorrow);
                    setLoader(false);
                    setNextDay(true);
                    return;
                } else {
                    findDeliveryDate(tomorrow, false);
                }
            } else {
                if(CurrentDate.getDate() == checkDay.getDate()) {
                    findDeliveryDate(tomorrow, false);
                } else {
                    if(businessDayPassed) {
                        if(props.deliveryDays[dayOfWeekAsString(tomorrow.getDay())] == true) {
                            setEstDate(tomorrow);
                            setLoader(false);
                            return;
                        } else {
                            findDeliveryDate(tomorrow, true);
                        }
                    } else {
                        if(props.businessDays[dayOfWeekAsString(checkDay.getDay())] == true) {
                            if(props.deliveryDays[dayOfWeekAsString(tomorrow.getDay())] == true) {
                                findDeliveryDate(checkDay, true);
                            } else {
                                findDeliveryDate(tomorrow, true);
                            }
                        } else {
                            findDeliveryDate(tomorrow, false);
                        }
                    }
                }
            }            
        } else {
            findDeliveryDate(tomorrow, false);
        }
    }

    function checkHolidays (deliveryDate:Date) {
        const Holidays = props.holidays.map((item) => {
            return item.replace(/-/g,"/");
        });
        return Holidays.includes(deliveryDate.toLocaleDateString(props.dateFormat));
    }

    return (
        <div className="estimated-delivery-container">
                {!getLoader && <div className="delivery-wrapper">
                    <div className="text-container">
                        <span>{props.children} <span>{getNextDay ? props.nextDayDeliveryAvailableText : props.nextDayDeliveryNotAvailableText }</span></span>
                        {props.enableCountDownTimer && !IsPastCutOffPoint && props.isNextDayAvailable &&
                            <CountdownTimer 
                                cutOffTime={props.cutOffTime} 
                                currentDate={new Date(CurrentDate.toLocaleDateString('en-US', {timeZone: props.timezone}))}
                                timerText={props.timerText}
                                dateFormat={props.dateFormat}
                                timezone={props.timezone}
                                orderWithinText={props.orderWithinText}
                            />
                        } 
                        <p>{props.estimatedDeliveryText} <span>{ !getLoader ? `${props.showDateRange && !getNextDay ? getEstDate.toDateString() +  ' - ' +  new Date(new Date().setDate(getEstDate.getDate() + props.dateRange)).toDateString() : getEstDate.toDateString()}` : `${props.loadingText}`}</span></p>
                    </div>
                </div>
                }
        </div>
    );
}

export default EstimatedDeliveryComponent;