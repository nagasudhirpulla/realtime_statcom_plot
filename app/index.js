var apiServerBaseAddress = 'http://wmrm0mc1:62448';
var timerId = null;

window.onload = function () {
    apiServerBaseAddress = document.getElementById("serverBaseAddressInput").value;
    initializePlotDiv();
    fetchOperatingPointValue();
    timerId = setInterval(fetchOperatingPointValue, 60000);
};

// todo use relevant id here
var payLoadSources_g = [
    {
        name: 'Satna_STATCOM_x_value',
        url: createUrl(apiServerBaseAddress, 'WRLDCMP.SCADA1.A0047000', 'real')
    },
    {
        name: 'Satna_STATCOM_y_value',
        url: createUrl(apiServerBaseAddress, 'WRLDCMP.SCADA1.A0047000', 'real')
    }];

// not required now
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
        if(results.constructor === Array && results.length >= 2){
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
        x: [-5, -3, 3, 5],
        y: [-5, -5, 5, 5],
        mode: 'lines',
        line: {
            width: 1.5,
            color: 'rgb(120,120,0)',
            dash: 'line'
        },
        name: ''
    };

    var plotData = [trace_op_point, trace_ref_characteristic];
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

