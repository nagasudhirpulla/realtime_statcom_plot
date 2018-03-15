var apiServerBaseAddress = 'http://wmrm0mc1:62448';
var workerTimerId = null;

window.onload = function () {
    apiServerBaseAddress = document.getElementById("serverBaseAddressInput").value;
    initializePlotDiv();
    fetchForecastValues();
    workerTimerId = setInterval(fetchForecastValues, 60000);
};

var payLoadSources_g = [
    {
        name: 'FREQUENCY',
        url: createUrl(apiServerBaseAddress, 'WRLDCMP.SCADA1.A0047000', 'real')
    }];

function fetchForecastValues() {
    /* Get the all scada values from API start */
    async.mapSeries(payLoadSources_g, fetchScadaValue, function (err, results) {
        if (err) {
            // handle error - do nothing since the all values are not fetched
            // console.log("All values not fetched via API due to error: " + JSON.stringify(err));
            return;
        }
        //All the values are available in the results Array 
        var plotDiv = document.getElementById('plotDiv');
        for (var i = 0; i < results.length; i++) {
            //plotDiv.data[i].x = [];
            plotDiv.data[i].y = [];
            var demObjects = results[i];
            for (var k = 0; k < demObjects.length; k++) {
                //plotDiv.data[i].x.push(demObjects[k].timestamp);
                plotDiv.data[i].y.push(demObjects[k].dval);
            }
        }
        plotDiv.layout.title = "WR Graphs: Actual Vs Yesterday " + todayDateStr + " " + curTime;
        Plotly.redraw(plotDiv);
    });
    /* Get the all scada values from API end */
}

function initializePlotDiv() {
    var plotDiv = document.getElementById('plotDiv');
    var minuteLabels = Array.apply(null, {length: 96}).map(Function.call, function (k) {
        return getTimeStringFromMinutes(k * 15);
    });
    var oneMinuteLabels = Array.apply(null, {length: 1440}).map(Function.call, function (k) {
        return getTimeStringFromMinutes(k);
    });
    var trace_freq = {
        x: oneMinuteLabels,
        y: [],
        line: {
            width: 1.5,
            color: 'rgb(255,255,0)'
        },
        name: 'Frequency'
    };

    var trace_freq_upper_lim = {
        x: ['00:00', "23:59"],
        y: [50.05, 50.05],
        line: {
            width: 1.5,
            color: 'rgb(120,120,0)',
            dash: 'line'
        },
        name: ''
    };
    var trace_freq_50_hz = {
        x: ['00:00', "23:59"],
        y: [50, 50],
        line: {
            width: 1.5,
            color: 'rgb(120,120,0)',
            dash: 'dash'
        },
        name: ''
    };

    var trace_freq_lower_lim = {
        x: ['00:00', "23:59"],
        y: [49.9, 49.9],
        line: {
            width: 1.5,
            color: 'rgb(120,120,0)',
            dash: 'line'
        },
        name: ''
    };

    var plotData = [trace_freq, trace_freq_upper_lim, trace_freq_lower_lim];
    var layoutOpt = {
        title: "Satna Statcom Operating Point",
        plot_bgcolor: 'rgb(0,0,0)',
        paper_bgcolor: 'rgb(0,0,0)',
        xaxis: {
            dtick: 8,
            domain: [0, 1],
            tickcolor: 'rgb(100,100,100)',
            tickfont: {
                size: 25,
                color: 'rgb(200,200,200)'
            }
        },
        yaxis: {
            title: "MW",
            domain: [0.55, 1],
            tickcolor: 'rgb(100,100,100)',
            tickfont: {
                size: 25,
                color: 'rgb(200,200,200)'
            },
            titlefont: {
                size: 20,
                color: '#000000'
            },
            dtick: 4000,
            range: [30000, 50000]
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

