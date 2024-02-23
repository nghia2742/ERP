'use client';
import { useEffect } from 'react';
import { Chart } from 'chart.js';
import { useMyContext } from '@/context/context';
function MyChart() {
    const isEmpty = (obj) => Object.keys(obj).length === 0;
    const { myData } = useMyContext();

    useEffect(() => {
        if (isEmpty(myData)) {
            return;
        }
        const keysArray = Object.keys(myData[4]);
        const valuesArray = Object.values(myData[4]);
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: keysArray,
                datasets: [
                    {
                        data: valuesArray,
                        label: 'Close',
                        borderColor: '#3e95cd',
                        backgroundColor: '#7bb6dd',
                        fill: false,
                    },
                ],
            },
        });
    }, [myData]);

    return (
        <>
            <h1 className="w-[110px] mx-auto mt-10 text-xl font-semibold capitalize ">
                line Chart
            </h1>
            <div className="w-[1100px] h-screen flex mx-auto my-auto">
                <div className="border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl">
                    <canvas id="myChart"></canvas>
                </div>
            </div>
        </>
    );
}

export default MyChart;
