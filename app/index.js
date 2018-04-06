var timingVar_;
var isBusy_ = false;
var isPlayingReal_ = false;
var dataFetchPeriodMs = 1000;

//Timing function
function startFetching() {
    // stop Frames playing also
    pauseFrameFetching();
    pauseFetching();
    apiServerBaseAddress_g = document.getElementById("serverBaseAddressInput").value;
    console.log("Starting Server Data Fetch", "info");
    isPlayingReal_ = true;
    timingVar_ = setInterval(fetchOperatingPointValue, dataFetchPeriodMs);
}

//Timing function
function pauseFetching() {
    isPlayingReal_ = false;
    console.log("Pausing Server Data Fetch", "warning");
    clearInterval(timingVar_);
}

window.onload = function () {
    apiServerBaseAddress_g = document.getElementById("serverBaseAddressInput").value;
    initializePlotDiv();
    fetchOperatingPointValue();
    startFetching();
};

function fetchOperatingPointValue() {
    /* Get the all scada values from API start */
    var todayDate = new Date();
    var todayDateStr = makeTwoDigits(todayDate.getDate()) + "/" + makeTwoDigits(todayDate.getMonth() + 1) + "/" + todayDate.getFullYear();
    var curTime = makeTwoDigits(todayDate.getHours()) + ":" + makeTwoDigits(todayDate.getMinutes());
    async.mapSeries(payLoadSources_g, fetchScadaValue, function (err, results) {
        if (err) {
            // handle error - do nothing since the all values are not fetched
            // console.log("All values not fetched via API due to error: " + JSON.stringify(err));
            return;
        }
        // updating the plot operating point
        if (results.constructor === Array && results.length >= 2) {
            var x_result = results[0];
            var y_result = results[1];
            updatePlot([x_result["dval"]], [y_result["dval"]], "Satna Statcom real time Operating Point " + todayDateStr + " " + curTime);
        }
        /*
         //All the values are available in the results Array
         var plotDiv = document.getElementById('plotDiv');

         // updating the plot operating point
         if (results.constructor === Array && results.length >= 2) {
         var x_result = results[0];
         var y_result = results[1];
         plotDiv.data[0].x = [x_result["dval"]];
         plotDiv.data[0].y = [y_result["dval"]];
         }

         plotDiv.layout.title = "Satna Statcom real time Operating Point " + todayDateStr + " " + curTime;
         Plotly.redraw(plotDiv);
         // trigger hover on the operating point
         Plotly.Fx.hover('plotDiv', [
         {curveNumber: 0, pointNumber: 0}
         ]);
         */
    });
    /* Get the all scada values from API end */
}

function updatePlot(xVals, yVals, title) {
    var plotDiv = document.getElementById('plotDiv');

    if (title != null) {
        plotDiv.layout.title = title;
    }

    plotDiv.data[0].x = xVals;
    plotDiv.data[0].y = yVals;

    Plotly.redraw(plotDiv);

    // trigger hover on the operating point

    Plotly.Fx.hover('plotDiv', [
        {curveNumber: 0, pointNumber: 0}
    ]);
}

function initializePlotDiv() {
    var plotDiv = document.getElementById('plotDiv');
    // https://plot.ly/javascript/line-and-scatter/
    var trace_op_point = {
        x: [1],
        y: [1],
        type: 'scatter',
        name: 'Operating Point',
        marker: {size: 12}
    };

    // not required
    var trace_x_axis = {
        x: [-10, 10],
        y: [0, 0],
        showlegend: false,
        line: {
            width: 1.5,
            color: 'rgb(120,120,120)',
            dash: 'line'
        },
        name: ''
    };

    // not required
    var trace_y_axis = {
        x: [0, 0],
        y: [0, 2],
        showlegend: false,
        line: {
            width: 1.5,
            color: 'rgb(120,120,120)',
            dash: 'line'
        },
        name: ''
    };

    var trace_ref_characteristic = {
        x: [-1.188, -1.452, -0.417, -0.444, 0, 0, 0.415, 0.791, 1.732, 2.033, 1.732, 0.791, 0.754, 0.392, 0.415, 0.392, 0, 0, 0, -0.417],
        y: [0.3, 0.9, 0.95, 1.01, 1.01, 1.05, 1.05, 1.05, 1.1, 1.5, 1.1, 1.05, 0.99, 0.99, 1.05, 0.99, 0.99, 1.01, 0.95, 0.95],
        mode: 'lines',
        type: 'scatter',
        line: {
            width: 3,
            color: 'rgb(120,120,0)',
            dash: 'line'
        },
        name: 'Statcom Characteristic'
    };

    var trace_ref_char_annotations = {
        x: [-1.188, -1.48, -0.417, -0.444, 0, 0, 0.435, 0.795, 1.732, 2.08, 1.732, 0.791, 0.754, 0.392, 0.415, 0.392, 0, 0, 0, -0.417],
        y: [0.3, 0.9, 0.92, 1.1, 1.01, 1.05, 1.15, 1.15, 1.08, 1.5, 1.1, 1.05, 0.97, 0.97, 1.05, 0.99, 0.99, 1.01, 0.95, 0.95],
        text: ['A', 'B', 'C', 'D', ' ', ' ', 'E', 'F', 'G', 'H', ' ', ' ', 'I', 'K', " ", " ", " ", " ", " ", " "],
        textposition: 'bottom',
        type: "scatter",
        textfont: {
            family: 'sans serif',
            size: 20,
            color: '#aaaaaa'
        },
        mode: 'text',
        showlegend: false,
        name: 'Statcom Characteristic 2',
        hoverinfo: 'none'
    };

    var trace_ref_char_annotations_coords = {
        x: [-1.188, -1.53, -0.417, -0.28, 0, 0, 0.6, 0.95, 1.732, 2.13, 1.732, 0.791, 0.754, 0.392, 0.415, 0.392, 0, 0, 0, -0.417],
        y: [0.23, 0.82, 0.85, 1.08, 1.01, 1.05, 1.14, 1.14, 1.01, 1.43, 1.1, 1.05, 0.9, 0.9, 1.05, 0.99, 0.99, 1.01, 0.95, 0.95],
        text: ["1.188, 0.3", "1.452, 0.9", "0.417, 0.95", "0.444, 1.01", " ", " ", "0.415, 1.05", "0.791, 1.05", "1.732, 1.1", "2.033, 1.5", " ", " ", "0.754, 0.99", "0.392, 0.99", " ", " ", " ", " ", " ", " "],
        textposition: 'bottom',
        type: "scatter",
        textfont: {
            family: 'sans serif',
            size: 12,
            color: '#aaaaaa'
        },
        mode: 'text',
        showlegend: false,
        line: {
            width: 3,
            color: 'rgb(120,120,0)',
            dash: 'line'
        },
        name: 'Statcom Characteristic 3',
        hoverinfo: 'none'
    };

    var trace_ref_characteristic1 = {
        x: [0, -3],
        y: [0.3, 0.3],
        mode: 'lines',
        showlegend: false,
        line: {
            width: 1,
            color: 'rgb(120,120,0)',
            dash: 'dash'
        },
        name: 'y = 0.3 line',
        hoverinfo: 'none'
    };

    var trace_ref_characteristic2 = {
        x: [0, 3],
        y: [1.5, 1.5],
        mode: 'lines',
        showlegend: false,
        line: {
            width: 1,
            color: 'rgb(120,120,0)',
            dash: 'dash'
        },
        name: 'y = 1.5 line',
        hoverinfo: 'none'
    };

    var trace_ref_characteristic3 = {
        x: [-3, 3],
        y: [0, 0],
        mode: 'lines',
        showlegend: false,
        line: {
            width: 3,
            color: 'rgb(120,120,120)',
            dash: 'line'
        },
        name: 'name 3',
        hoverinfo: 'none'
    };

    var trace_ref_characteristic4 = {
        x: [-1, -1],
        y: [0, 2],
        mode: 'lines',
        showlegend: false,
        line: {
            width: 1,
            color: 'rgb(80,80,80)',
            dash: 'dash'
        },
        name: 'x = -1 line',
        hoverinfo: 'none'
    };

    var trace_ref_characteristic5 = {
        x: [1, 1],
        y: [0, 2],
        mode: 'lines',
        showlegend: false,
        line: {
            width: 1,
            color: 'rgb(80,80,80)',
            dash: 'dash'
        },
        name: 'x = 1 line',
        hoverinfo: 'none'
    };

    var trace_abcd = {
        x: [-1.188],
        y: [0.3],
        mode: 'text',
        showlegend: false,
        text: ['A'],
        name: 'abcd trace',
        hoverinfo: 'none'
    };

    var plotData = [trace_op_point, trace_ref_characteristic, trace_ref_char_annotations, trace_ref_char_annotations_coords, trace_ref_characteristic1, trace_ref_characteristic2, trace_ref_characteristic3, trace_ref_characteristic4, trace_ref_characteristic5];
    // https://codepen.io/plotly/pen/BNMROB
    var layoutOpt = {
        title: "Satna Statcom Operating Point",
        annotations: [
            {
                x: 0.8,
                y: -0.1,
                xref: 'x',
                yref: 'y',
                text: 'Inductive',
                showarrow: true,
                font: {
                    family: 'Courier New, monospace',
                    size: 16,
                    color: '#ffffff'
                },
                align: 'center',
                arrowhead: 2,
                arrowsize: 1,
                arrowwidth: 2,
                arrowcolor: '#636363',
                ax: -90,
                ay: 0,
                opacity: 0.8
            },
            {
                x: -0.8,
                y: -0.1,
                xref: 'x',
                yref: 'y',
                text: 'Capacitive',
                showarrow: true,
                font: {
                    family: 'Courier New, monospace',
                    size: 16,
                    color: '#ffffff'
                },
                align: 'center',
                arrowhead: 2,
                arrowsize: 1,
                arrowwidth: 2,
                arrowcolor: '#636363',
                ax: 90,
                ay: 0,
                opacity: 0.8
            },
            {
                x: 0,
                y: 1.05,
                xref: 'x',
                yref: 'y',
                text: 'O1',
                showarrow: true,
                font: {
                    family: 'Courier New, monospace',
                    size: 16,
                    color: '#ffffff'
                },
                align: 'center',
                arrowhead: 2,
                arrowsize: 1,
                arrowwidth: 2,
                arrowcolor: '#636363',
                ax: 40,
                ay: -30,
                opacity: 0.8
            },
            {
                x: 0,
                y: 1.01,
                xref: 'x',
                yref: 'y',
                text: 'O2',
                showarrow: true,
                font: {
                    family: 'Courier New, monospace',
                    size: 16,
                    color: '#ffffff'
                },
                align: 'center',
                arrowhead: 2,
                arrowsize: 1,
                arrowwidth: 2,
                arrowcolor: '#636363',
                ax: -20,
                ay: -30,
                opacity: 0.8
            },
            {
                x: 0,
                y: 0.99,
                xref: 'x',
                yref: 'y',
                text: 'O3',
                showarrow: true,
                font: {
                    family: 'Courier New, monospace',
                    size: 16,
                    color: '#ffffff'
                },
                align: 'center',
                arrowhead: 2,
                arrowsize: 1,
                arrowwidth: 2,
                arrowcolor: '#636363',
                ax: 30,
                ay: 20,
                opacity: 0.8
            },
            {
                x: 0,
                y: 0.95,
                xref: 'x',
                yref: 'y',
                text: 'O4',
                showarrow: true,
                font: {
                    family: 'Courier New, monospace',
                    size: 16,
                    color: '#ffffff'
                },
                align: 'center',
                arrowhead: 2,
                arrowsize: 1,
                arrowwidth: 2,
                arrowcolor: '#636363',
                ax: -30,
                ay: 20,
                opacity: 0.8
            },
            {
                x: -1.9,
                y: 1.3,
                xref: 'x',
                yref: 'y',
                text: 'O4-C MSC is on<br>C-B  STATCOM + MSC<br>B-A  STATCOM + MSC<br>C-D  MSC is on<br>D-O2 MSC is off<br>O1-E #1MSR is on<br>E-F  #2MSR is on<br>F-G  STATCOM + #1MSR + #2MSR<br>G-H  STATCOM + #1MSR + #2MSR<br>F-I  #1MSR + #2MSR<br>E-K  #1MSR<br>I-K  #1MSR is off<br>K-O3 #2MSR is off',
                showarrow: false,
                font: {
                    family: 'Courier New, monospace',
                    size: 16,
                    color: '#cccccc'
                },
                align: 'left',
                opacity: 0.8
            }
        ],
        plot_bgcolor: 'rgb(0,0,0)',
        paper_bgcolor: 'rgb(0,0,0)',
        xaxis: {
            title: "I_stat (pu)",
            titlefont: {
                color: '#aaaaaa'
            },
            tickcolor: 'rgb(100,100,100)',
            tickfont: {
                size: 15,
                color: 'rgb(200,200,200)'
            },
            range: [-2.5, 2.5]
        },
        yaxis: {
            title: "Upcc (pu)",
            tickcolor: 'rgb(100,100,100)',
            tickfont: {
                size: 15,
                color: 'rgb(200,200,200)'
            },
            titlefont: {
                size: 20,
                color: '#aaaaaa'
            },
            range: [-0.1, 1.7]
        },
        margin: {l: 70, pad: 10, t: 60, b: 0},
        legend: {
            y: -0.1,
            orientation: 'h',
            font: {
                size: 15,
                color: 'rgb(200,200,200)'
            }
        },
        titlefont: {
            size: 25,
            color: 'rgb(200,200,200)'
        }
    };
    Plotly.newPlot(plotDiv, plotData, layoutOpt);
    // trigger hover on the operating point
    // https://plot.ly/javascript/hover-events/

    Plotly.Fx.hover('plotDiv', [
        {curveNumber: 0, pointNumber: 0}
    ]);
}