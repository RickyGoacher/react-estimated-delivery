import { useEffect, useState } from "react";

interface CountdownTimerInfterface {
    cutOffTime: string;
    currentDate: Date;
    timerText: {[key: string]: string}
}

const CountdownTimer = (props: CountdownTimerInfterface) => {

    const CurrentDate = props.currentDate;
    const Hour = Number(props.cutOffTime.split(':')[0]);
    const Minutes = Number(props.cutOffTime.split(':')[1]);
    const SetDateTimeFromParams: Date = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), CurrentDate.getDate(), Hour, Minutes);
    const NextDay: Date = new Date(SetDateTimeFromParams.setDate(CurrentDate.getDate() + 1));

    const [getCountdown, setCountdown] = useState(
        Number(NextDay) - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(Number(NextDay) - new Date().getTime());
        }, 1000);
        
        return () => clearInterval(interval);
    }, [NextDay]);

    return (
        <div className="countdown-wrapper">
            <p>{props.timerText.hours} { Math.floor((getCountdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) } </p>
            <p>{props.timerText.minutes} { Math.floor((getCountdown % (1000 * 60 * 60)) / (1000 * 60))}</p>
            <p>{props.timerText.seconds} { Math.floor((getCountdown % (1000 * 60)) / 1000) }</p>
        </div>
    );
}

export default CountdownTimer;