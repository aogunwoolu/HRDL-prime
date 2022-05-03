import React, { useState } from "react";
import { Button, Col, Row, Container } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import ReactApexChart from "react-apexcharts";

// daily graph styling and data
const BarGraph =(props)=> {
      const options = {
        colors : ['#ffcc48'],
        plotOptions: {
          bar: {
            dataLabels: {
                position: "top",
            },
            borderRadius: 47
          }
        },
        // labeling the axis
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return "$" + Number(val).toLocaleString();
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#686868"],
          }
        },
        // defining data
        xaxis: {
          categories: props.user.tradingPairs[props.coin].weekly.map(week => week.time_open.replace(" 00:00:00","")),
          position: "bottom",
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false,
            offsetY: -35
          }
        },
        fill: {
            colors: ['#686868'],
            opacity: 1,
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
        },
        title: {
          text: "Open Prices",
          floating: true,
          offsetY: 0,
          align: "center",
          style: {
            color: "#444"
          }
        },
        chart: {
          animations: {
            enabled: false
          }
        },
        tooltip: {
            enabled: true,
            enabledOnSeries: undefined,
            shared: true,
            followCursor: false,
            intersect: false,
            inverseOrder: false,
            custom: undefined,
            fillSeriesColor: false,
            theme: false,
            offsetX: 7,
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
            onDatasetHover: {
                highlightDataSeries: false,
            },
        },
    };

    // defining plotted data
    const series = [
        {
            name: "Coin price",
            data: props.user.tradingPairs[props.coin].weekly.map(week => week.open),
        }
    ];

    return (
        <div id="chart">
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height="600"
            />
        </div>
    )
}

// hourly data graph styling and data
const Candlestick =(props)=> {

    // data to be plotted
    const series = [{
        name: 'candle',
        data: props.user.tradingPairs[props.coin].hourly
    }];
    // styles
    const options = {
        colors : ['#ffcc48'],
        chart: {
            height: 350,
            type: 'candlestick',
            toolbar: {
                show: true,
                offsetX: 10,
                offsetY: 10,
                tools: {
                download: false,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false | '<img src="/static/icons/reset.png" width="20">',
                customIcons: []
                },
                export: {
                csv: {
                    filename: undefined,
                    columnDelimiter: ',',
                    headerCategory: 'category',
                    headerValue: 'value',
                    dateFormatter(timestamp) {
                    return new Date(timestamp).toDateString()
                    }
                },
                svg: {
                    filename: undefined,
                },
                png: {
                    filename: undefined,
                }
                },
                autoSelected: 'pan' 
            },
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#ffcc48',
                    downward: '#ff5c00'
                },
                wick: {
                    useFillColor: true,
                }
            }
        },
        annotations: {
            xaxis: [
            {
                x: 'Oct 06 14:00',
                borderColor: '#FFCC48',
                label: {
                    borderColor: '#FFCC48',
                    style: {
                        fontSize: '12px',
                        color: '#fff',
                        background: '#FFCC48'
                    },
                    orientation: 'horizontal',
                    offsetY: 7,
                    text: 'Annotation Test'
                }
            }
            ]
        },
        tooltip: {
            enabled: true,
            enabledOnSeries: undefined,
            shared: true,
            followCursor: false,
            intersect: false,
            inverseOrder: false,
            custom: undefined,
            fillSeriesColor: false,
            theme: false,
            offsetX: 7,
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
            onDatasetHover: {
                highlightDataSeries: false,
            },
        },
        // axis definition
        xaxis: {
            type: 'category',
            labels: {
              formatter: function(val) {
                var date = new Date(val);

                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();

                var formattedTime = String(date).replace(new RegExp("\\(.*\\)"),"")

                return formattedTime
              }
            },
        },
        yaxis: {
            tooltip: {
                enabled: false
            }
        },
    }

    // return chart component
    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="candlestick" height={750} />
        </div>
    )
}

const API_PATH = `http://${window.location.hostname}:8000/`;

// main coin information component
const CoinInfo =(props)=> {

    // add comma to large numbers
    function numberWithCommas(x) {
        if (x > 100){
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return x;
    }

    // the visuals
    return (
        <div className="mainscreen-component">
            <Container>
                <Row className="button-array justify-content-center">
                        <Col>
                            <Button onClick={() => {window.open(props.user.tradingPairs[props.coin].links.website[0])}} className="website-link coin-button">
                                Website
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={() => {window.open(props.user.tradingPairs[props.coin].links.source_code[0])}} className="coin-button">
                                Source Code
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={() => {window.open(props.user.tradingPairs[props.coin].links.website[0])}} className="coin-button">
                                Whitepaper
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={() => {window.open(props.user.tradingPairs[props.coin].links.reddit[0])}} className="coin-button">
                                Community
                            </Button>
                        </Col>
                </Row>
            </Container>
            <br/>
            <br/>
            <Row className="coin-info-top">
                <Col>
                    <Row className="justify-content-center">
                        <Col className="col-2">
                            <img src={`http://${window.location.hostname}:8000/media/Icons/${props.user.tradingPairs[props.coin].symbol.toLowerCase()}.png`}/>
                        </Col>
                        <Col className="col-2 justify-content-center align-self-center">
                            <h2>{props.user.tradingPairs[props.coin].name}</h2>
                        </Col>
                        <Col className="col-1 justify-content-center align-self-center">
                            <div>
                                <p>{props.user.tradingPairs[props.coin].symbol}</p>
                            </div>
                        </Col>
                        <Col className="col-4"></Col>
                    </Row>
                    <Row className="justify-content-center">
                        <p className="align-middle">{props.user.tradingPairs[props.coin].name} price</p>
                        <Col className="col-3"></Col>
                    </Row>
                    <Row className="justify-content-center">
                        <h1>
                            ${numberWithCommas(props.user.tradingPairs[props.coin].hourly.at(-1).y[0])}
                        </h1>
                        <Col className="col-4"></Col>
                    </Row>
                </Col>
                <Col>
                    <BarGraph user={props.user} coin={props.coin} setCoin={props.setCoin}/>
                </Col>
            </Row>
            <br/>
            <br/>
            <Row>
                <Col>
                    <Candlestick user={props.user} coin={props.coin} setCoin={props.setCoin}/>
                </Col>
            </Row>
            <br/>
            <br/>
            <br/>
            <Row>
                <Col>
                    <Row>
                        <Col className="coin-row">
                            <div className="coin-block">
                                <p>Market Cap</p>
                                <p>${numberWithCommas(props.user.tradingPairs[props.coin].weekly.at(-1).market_cap)}</p>
                                <p>0.45%</p>
                            </div>
                        </Col>

                        <Col>
                            <div className="coin-block">
                                <p>Fully Diluted Market Cap</p>
                                <p>$1,148,773,647,889</p>
                                <p>0.45%</p>
                            </div>
                        </Col>

                        <Col>
                            <div className="coin-block">
                                <p>Volume</p>
                                <p>${numberWithCommas(props.user.tradingPairs[props.coin].weekly.at(-1).volume)}</p>
                                <p>9.8%</p>
                                <p>Volume / Market Cap</p>
                                <p>{numberWithCommas(Math.round(props.user.tradingPairs[props.coin].weekly.at(-1).volume/props.user.tradingPairs[props.coin].weekly.at(-1).market_cap * 100) / 100)}</p>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    )
}

//exporting this function to be used in pages.js
export {CoinInfo}