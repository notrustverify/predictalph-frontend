import React  from 'react';
import Countdown from 'react-countdown'

interface Timestamp {
    drawTimestamp: number
}

interface Time {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    completed: boolean
}

export const Timer = ( { drawTimestamp }: Timestamp ) => {
    const dateNow = Date.now()
    const Completionist = () => <span>progress</span>;

    const renderer = ({ days ,hours, minutes, seconds, completed }: Time) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
          } else {
            // Render a countdown
            if (days > 0)
              return <span>{days}d {hours}h {minutes}m {seconds}s</span>;

            return <span>{hours}h {minutes}m {seconds}s</span>; 
          }
        };
    return (
      <React.Fragment>
            <Countdown 
            date={dateNow + (drawTimestamp - dateNow)} 
            renderer={renderer} 
            /> 
      </React.Fragment>
    )

}