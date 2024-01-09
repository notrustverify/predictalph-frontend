import React  from 'react';
import Countdown from 'react-countdown'

interface Timestamp {
    drawTimestamp: number,
    resetCounterId: number

}

interface Time {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    completed: boolean,
}

export const Timer = ( { drawTimestamp, resetCounterId }: Timestamp ) => {
    const dateNow = Date.now()
    const Completionist = () => <span>round is locked for 5 minutes, ending</span>;

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
            key={resetCounterId}
            /> 
      </React.Fragment>
    )

}
