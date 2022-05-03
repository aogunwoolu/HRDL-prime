import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from "react";


// profit graph
// does not display in the current iteration of HRDL
// as it needs to be integrated with the trading history of trading bot
function Profit(props) {
    const [data, setData] = useState({});
    const [dimensions, setDimensions] = useState({});
    const [profit, setProfit] = useState([]);


    // set width and height of the graph
    useEffect( (props) => {
        var chart = document.getElementsByClassName('chartjs-render-monitor')[0].getContext('2d');

        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        if (dimensions.width != width || dimensions.height != height){
            setDimensions({
                'height': height,
                'width': width,
            })

            var gradient = chart.createLinearGradient(1880 - 1880*0.092, 0, 0, 0);

            gradient.addColorStop(0, 'rgba(255, 184, 0, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 184, 0, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

            const data = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September' , 'October', 'November'],
                datasets: [
                    {
                        borderWidth: 10,
                        label: 'Profit',
                        fill: false,
                        lineTension: 0.1,
                        borderColor: gradient,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'white',
                        pointBackgroundColor: '#fff',
                        pointHoverBorderWidth: 2,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        data: Array(11).fill(0).splice(11-profit.length, 11,profit)//[65, 59, 80, 81, 56, 55, 40, 67, 20,84,72]
                    }
                ]
            };

            setData({ ...data });
        }
    })

    /// graph options
    const options = {
        tooltips: {enabled: true},
        legend: { display: false },
        events: [],
        scales: {
            yAxes: [
            {
                gridLines: {
                    display: false,
                    zeroLineColor: '#ffcc33',
                },
                ticks: {
                    display: false 
                }
            },
            ],
            xAxes: [{
                gridLines: {
                    display: false,
                },
                ticks: {
                    display: false, 
                },
            }],
        },
        maintainAspectRatio: false,
        animation: {
            easing: "easeInQuart"
        }
    }

    return (
        <div className='profit-chart'>
            <Line 
                data={data}
                options={options}
            />
        </div>
    );
}

export { Profit }