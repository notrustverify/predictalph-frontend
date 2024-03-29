import React from 'react';
import {Box} from "@mui/material"; // Import CSS file for styling

type  HorizontalBarType = {
    polls: number[],
    height: string
}

export function HorizontalBar({polls, height}: HorizontalBarType) {
        const max = polls.reduce((a, b) => a + b);
        const pct = max === 0
    ? polls.map(_ => 100 / polls.length)
            : polls.map(p => 100 * p / max);

        console.log('POLL', polls, max, pct);
    return (
        <Box
            sx={{
                width: '100%',
                height: height,
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    height: '100%',
                    backgroundColor: 'secondary.main',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${pct[0]}%`,
                }}
            />
            <Box
                sx={{
                    height: '100%',
                    backgroundColor: 'warning.main',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: `${pct[1]}%`,
                }}
            />
        </Box>
    );
};

