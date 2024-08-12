# React Estimated Delivery Component

React component for estimated delivery with config and holiday options.

## How it works

- If it's a business day & the time is before the cut off point, for example 11:00, the timer & next day delivery will display.
- If it's a business day & the time is past the cut off point, it will add 2 days to the current day.
- If it's a business day & the time is past the cut off point & tomorrow or the following days are not business days it sets the delivery date to the day after the next business day.
- If it's not a business day & tomorrow or the following days are not business days it set the delivery date to the day after the next next business day.

- The same above applies for holiday days, it will add one day for each holiday and attempt to deliver the day after the next business day.

## How to use

### Install

Installation: `npm install react-estimated-delivery`

### Usage

Import the package into your app:

`import { EstimatedDeliveryComponent } from "react-estimated-delivery";`

#### Component options:
```
            <EstimatedDeliveryComponent
                businessDays={{
                    "monday": true,
                    "tuesday": true,
                    "wednesday": true,
                    "thursday": true,
                    "friday": true,
                    "saturday": false,
                    "sunday": false
                }}
                cutOffTime={"12:00"} 
                holidays={["07/08/2024", "08/08/2024", "09/08/2024", "10/08/2024", "11/08/2024", "12/08/2024" , "13/08/2024", "14/08/2024"]}
                timezone={"Europe/London"}
                dateFormat={"en-GB"}
                enableCountDownTimer={true}
                nextDayDeliveryAvailableText={"Next day delivery available."}
                nextDayDeliveryNotAvailableText={"Next day delivery NOT available."}
                estimatedDeliveryText={"Estimated delivery date:"}
                timerText={{hours: "Hours:", minutes: "Minutes:", seconds: "Seconds:"}}
            >

                <img alt="" src={TheIcon} height={40} width={40}></img>
            </EstimatedDeliveryComponent>

    The <EstimatedDeliveryComponent> can accept any element between the opening and closing tag this is to be used for the icon. 

    -  businessDays={{
            "monday": true,
            "tuesday": true,
            "wednesday": true,
            "thursday": true,
            "friday": true,
            "saturday": false,
            "sunday": false
        }}

        Set which days the business is open.

    -  cutOffTime={"12:00"}
        Cut off time for next day delivery.

    -  holidays={["07/08/2024", "08/08/2024"]}
        Pass in an array of holidays, dd/mm/yyyy, this is to be used for bank holidays.

    -  timezone={"Europe/London"}
        Set the timezone to diplay to the customer.

    -  dateFormat={"en-GB"}
        Used when passing in holidays, the format should match the format of your holidays (dd/mm/yy or mm/dd/yyy).

    - enableCountDownTimer={true}
        Have the countdown show if next day delivery is available.

    - nextDayDeliveryAvailableText={"Next day delivery available."}
        Text for next day delivery available.

    - nextDayDeliveryNotAvailableText={"Next day delivery NOT available."}
        Text for next day delivery not available.

    - estimatedDeliveryText={"Estimated delivery date:"}
        Text for estimated delivery.

    - timerText={{hours: "Hours:", minutes: "Minutes:", seconds: "Seconds:"}}
        Text for timer.
    
```
 ## Example

### Estimated Delivery with timer (Next Day available)

![Estimated delivery timer example](https://raw.githubusercontent.com/RickyGoacher/react-estimated-delivery/main/assets/images/estimated-delivery-timer.png)

### Estimated Delivery wthout timer (Next day not available)

![Estimated delivery example](https://raw.githubusercontent.com/RickyGoacher/react-estimated-delivery/main/assets/images/estimated-delivery.png)