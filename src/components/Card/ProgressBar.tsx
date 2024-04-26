import React from 'react';

type thisColor = {
    color: string,
}

const ProgressBar = ({ color }: thisColor) => {
    return (
        <div className="progressBar" style={{ background: color }}>
            <div className="progressBarText">4</div>
        </div>
    );
}

export default ProgressBar;
