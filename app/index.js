var apiServerBaseAddress = 'http://wmrm0mc1:62448';
var timerId = null;

window.onload = function () {
    apiServerBaseAddress = document.getElementById("serverBaseAddressInput").value;
    initializePlotDiv();
    fetchOperatingPointValue();
    timerId = setInterval(fetchOperatingPointValue, 500);
};

// todo use relevant id here
var payLoadSources_g = [
    {
        name: 'Satna_STATCOM_x_value',
        url: createUrl(apiServerBaseAddress, 'WRLDCMP.SCADA3.A0106099', 'real')
    },
    {
        name: 'Satna_STATCOM_y_value',
        url: createUrl(apiServerBaseAddress, 'WRLDCMP.SCADA3.A0106098', 'real')
    }];

var computeXYFromResult = function (result) {
    // todo calculate x and y values from result
    return {
        x: result,
        y: result
    }
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
    });
    /* Get the all scada values from API end */
}

function initializePlotDiv() {
    var plotDiv = document.getElementById('plotDiv');
    // https://plot.ly/javascript/line-and-scatter/
    var trace_op_point = {
        x: [1],
        y: [1],
        mode: 'markers',
        type: 'scatter',
        name: 'Operating Point',
        marker: {size: 12}
    };

    var trace_x_axis = {
        x: [-10, 10],
        y: [0, 0],
        line: {
            width: 1.5,
            color: 'rgb(120,120,120)',
            dash: 'line'
        },
        name: ''
    };
    var trace_y_axis = {
        x: [0, 0],
        y: [-10, 10],
        line: {
            width: 1.5,
            color: 'rgb(120,120,120)',
            dash: 'dash'
        },
        name: ''
    };

    var trace_ref_characteristic = {
        x: [-1.188, -1.452, -0.417, -0.444, 0, 0, 0.415, 0.791, 1.732, 2.033, 1.732, 0.791, 0.754, 0.392, 0.415, 0.392, 0, 0, 0, -0.417],
        y: [0.3, 0.9, 0.95, 1.01, 1.01, 1.05, 1.05, 1.05, 1.1, 1.5, 1.1, 1.05, 0.99, 0.99, 1.05, 0.99, 0.99, 1.01, 0.95, 0.95],
        mode: 'lines',
        line: {
            width: 3,
            color: 'rgb(120,120,0)',
            dash: 'line'
        },
        name: ''
    };

    var trace_ref_characteristic1 = {
        x: [0, -3],
        y: [0.3, 0.3],
        mode: 'lines',
        line: {
            width: 1.5,
            color: 'rgb(120,120,0)',
            dash: 'dash'
        },
        name: ''
    };

    var trace_ref_characteristic2 = {
        x: [0, 3],
        y: [1.5, 1.5],
        mode: 'lines',
        line: {
            width: 1.5,
            color: 'rgb(120,120,0)',
            dash: 'dash'
        },
        name: ''
    };

    var trace_ref_characteristic3 = {
        x: [-3, 3],
        y: [0, 0],
        mode: 'lines',
        line: {
            width: 3,
            color: 'rgb(120,120,120)',
            dash: 'line'
        },
        name: ''
    };

    var trace_ref_characteristic4 = {
        x: [-1, -1],
        y: [0, 2],
        mode: 'lines',
        line: {
            width: 3,
            color: 'rgb(120,120,120)',
            dash: 'dash'
        },
        name: ''
    };

    var trace_ref_characteristic5 = {
        x: [1, 1],
        y: [0, 2],
        mode: 'lines',
        line: {
            width: 3,
            color: 'rgb(120,120,120)',
            dash: 'dash'
        },
        name: ''
    };
    var plotData = [trace_op_point, trace_ref_characteristic, trace_ref_characteristic1, trace_ref_characteristic2, trace_ref_characteristic3, trace_ref_characteristic4, trace_ref_characteristic5];
    var layoutOpt = {
        title: "Satna Statcom Operating Point",
        plot_bgcolor: 'rgb(0,0,0)',
        paper_bgcolor: 'rgb(0,0,0)',
        xaxis: {
            dtick: 8,
            tickcolor: 'rgb(100,100,100)',
            tickfont: {
                size: 25,
                color: 'rgb(200,200,200)'
            }
        },
        yaxis: {
            title: "Y AXIS TITLE",
            tickcolor: 'rgb(100,100,100)',
            tickfont: {
                size: 25,
                color: 'rgb(200,200,200)'
            },
            titlefont: {
                size: 20,
                color: '#000000'
            }
        },
        margin: {l: 70, pad: 4, t: 80},
        legend: {
            orientation: 'h',
            font: {
                size: 25,
                color: 'rgb(200,200,200)'
            }
        },
        titlefont: {
            size: 35,
            color: 'rgb(200,200,200)'
        }
    };
    Plotly.newPlot(plotDiv, plotData, layoutOpt);
}


function makeTwoDigits(x) {
    if (x < 10) {
        return "0" + x;
    }
    else {
        return x;
    }
}

function getTimeStringFromMinutes(m) {
    var hrs = parseInt(m / 60);
    var mins = m - hrs * 60;
    return makeTwoDigits(hrs) + ":" + makeTwoDigits(mins);
}

