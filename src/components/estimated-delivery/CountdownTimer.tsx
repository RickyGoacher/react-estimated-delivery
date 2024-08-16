import { useEffect, useState } from "react";

interface CountdownTimerInfterface {
    cutOffTime: string;
    currentDate: Date;
    timerText: {[key: string]: string}
    dateFormat: string;
    timezone: string;
    orderWithinText: string;
}

const CountdownTimer = (props: CountdownTimerInfterface) => {

    const CurrentDate = props.currentDate;

    const Hour = Number(props.cutOffTime.split(':')[0]);
    const Minutes = Number(props.cutOffTime.split(':')[1]);
    const SetDateTimeFromParams: Date = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), CurrentDate.getDate(), Hour, Minutes);
    const NextDay: Date = new Date(SetDateTimeFromParams.setDate(CurrentDate.getDate() + 1));
    const TimeVar = new Date().toLocaleString("en-US", {timeZone: props.timezone});
    
    const [getCountdown, setCountdown] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(Number(NextDay) - new Date(TimeVar).getTime())
           
        }, 1000);
        
        return () => clearInterval(interval);
    }, [NextDay]);

    const TimerHours = Math.floor((getCountdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const TimerMinutes = Math.floor((getCountdown % (1000 * 60 * 60)) / (1000 * 60));
    const TimerSeconds = Math.floor((getCountdown % (1000 * 60)) / 1000);

    return (
        <div className="countdown-wrapper">
           <span>{props.orderWithinText}</span> 
           {TimerHours > 0 && <p>{ TimerHours }{props.timerText.hours} </p> }
           {TimerMinutes > 0 && <p>{ TimerMinutes }{props.timerText.minutes} </p> }
           {TimerSeconds > 0 && <p>{ TimerSeconds }{props.timerText.seconds}</p> }
        </div>
    );
}

export default CountdownTimer;