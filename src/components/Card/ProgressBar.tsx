import React from 'react';

type thisColor = {
    index: number,
    width: number,
    number: number
}

const ProgressBar = ({ index, width , number }: thisColor) => {

    return (
        <div className={"containerProgress"}>
            <div
                className={"progressBar"}
                style={{
                    background: index === 0 ?
                        'linear-gradient(to right, var(--PGColor1), var(--PGColor2))'
                        :
                        'linear-gradient(to right, var(--PGColor1), var(--PGColor3))',
                    width: (width * 2) + "%"
                }}
            >
                <div className="progressBarText">
                    {number.toFixed(0) + " ℵ"}
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;
