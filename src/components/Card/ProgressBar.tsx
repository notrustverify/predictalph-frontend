import React from 'react';

type thisColor = {
    color: string,
    width: number,
    number: number
}

const ProgressBar = ({ color, width , number }: thisColor) => {
    return (
        <div className={"containerProgress"}>
            <div
                className={"progressBar"}
                style={{ background: color, width: (width * 2) + "%" }}
            >
                <div className="progressBarText">
                    {number}
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;
