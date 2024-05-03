import Chart from "chart.js/auto";
import ProgressBar from "./components/Card/ProgressBar";
import React from "react";

export const displayCircle = (pollAmounts: number[], round: any, game: any) => {
    if (round) {
        const updatedPollAmounts = pollAmounts.map(value => value === 0 ? 1 : value);
        const data = {
            datasets: [{
                label: '',
                data: updatedPollAmounts,
                backgroundColor: [
                    '#ffac56',
                    '#60ff75',
                    '#ff2e5f',
                    '#262324',
                    '#9abaff',
                    '#0990ff',
                    '#ffee2e',
                    '#b6b6b6',
                    '#ea2eff',
                    '#2effee'
                ],
                hoverOffset: 4
            }],
            labels: pollAmounts.map((_, index) => game.choiceDescriptions[index])
        };


        const options = {
            responsive: true,
            aspectRatio: 1,
            cutout: 50,
            plugins: {
                legend: {
                    position: 'top' as const,
                    align: 'center' as const,
                    labels: {
                        color: "#ACA5FF",
                        backgroundColor: "#ff0054"
                    }
                }
            },
        };



        const canvas = document.createElement('canvas');

        const chartContainer = document.getElementById('chartContainer');

        if (chartContainer) {
            chartContainer.appendChild(canvas);

            new Chart(canvas, {
                type: 'pie',
                data: data,
                options: options
            });
        }
    } else {
        return null
    }
};


export const displayProgressBar = (index: number, roundAmount: number, round: any, pollAmounts: number []) => {

    if (!round) return null;
    const totalAmount = pollAmounts.reduce((acc, amount) => acc + amount, 0);
    const percentage = totalAmount === 0 ? 0 : (roundAmount / totalAmount) * 100;

    return (
        <ProgressBar
            index={index}
            width={percentage === 0 ? 50 : percentage}
            number={percentage}
        />
    )
}
