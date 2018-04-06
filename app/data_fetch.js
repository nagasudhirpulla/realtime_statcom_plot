function fetchDataForDate() {
    getFromPointsDataServerForDate(document.getElementById("fetchDateInput").value, document.getElementById("fetchDateToInput").value);
}
//Timing function
function getFromPointsDataServerForDate(dateString, dateStringTo) {
    if (getIsBusy()) {
        return;
    }
    var fromDateStr = dateString.trim();
    if (fromDateStr == "") {
        var tempTime = new Date();
        fromDateStr = makeTwoDigits(tempTime.getFullYear()) + "-" + makeTwoDigits(tempTime.getMonth() + 1) + "-" + makeTwoDigits(tempTime.getDate());
    }
    var fromTime = new Date(fromDateStr + "T00:00:00");
    var fromTimeStr = makeTwoDigits(fromTime.getDate()) + "/" + makeTwoDigits(fromTime.getMonth() + 1) + "/" + fromTime.getFullYear() + "/" + makeTwoDigits(fromTime.getHours()) + ":" + makeTwoDigits(fromTime.getMinutes()) + ":00";

    var toDateStr = dateStringTo.trim();
    if (toDateStr == "") {
        tempTime = new Date(fromTime.getTime() + 86400000);
        toDateStr = makeTwoDigits(tempTime.getFullYear()) + "-" + makeTwoDigits(tempTime.getMonth() + 1) + "-" + makeTwoDigits(tempTime.getDate());
    }
    var toTime = new Date(toDateStr + "T00:00:00");
    var toTimeStr = makeTwoDigits(toTime.getDate()) + "/" + makeTwoDigits(toTime.getMonth() + 1) + "/" + toTime.getFullYear() + "/" + makeTwoDigits(toTime.getHours()) + ":" + makeTwoDigits(fromTime.getMinutes()) + ":00";

    for (var i = 0; i < payLoadSourcesHistory_g.length; i++) {
        payLoadSourcesHistory_g[i]['url'] = createUrl(apiServerBaseAddress_g, payLoadSourcesHistory_g[i]['pnt'], 'history', fromTimeStr, toTimeStr, 60, "snap");
        payLoadSourcesHistory_g[i]['startTime'] = fromTimeStr;
        payLoadSourcesHistory_g[i]['endTime'] = toTimeStr;
    }
    setIsBusy(true);

    async.mapSeries(payLoadSourcesHistory_g, fetchScadaValue, function (err, results) {
        if (err) {
            // handle error - do nothing since the all values are not fetched
            // console.log("All values not fetched via API due to error: " + JSON.stringify(err));
            return;
        }
        //All the values are available in the results Array
        if (results.constructor === Array && results.length >= 2) {
            var x_result = results[0];
            var y_result = results[1];
            // x_result and y_result should both be arrays
            if (x_result.constructor === Array && y_result.constructor === Array) {
                // create timeFrames same as the size of result
                timeFrames.frames = [];

                // insert data into timeFrames as timeStr, x, y
                for (var i = 0; i < Math.min(x_result.length, y_result.length); i++) {
                    timeFrames.frames[i] = {
                        timestamp: x_result[i]["timestamp"],
                        x: x_result[i]["dval"],
                        y: y_result[i]["dval"]
                    };
                }
                // set the slider max value
                setPlayerSliderMaxVal(timeFrames.frames.length);
                /*
                 document.getElementById("videoTimeSlider").min
                 document.getElementById("videoTimeSlider").max
                 document.getElementById("videoTimeSlider").step
                 document.getElementById("videoTimeSlider").value
                 document.getElementById("videoTimeSlider").value = 1000
                 */
            }
        }

        setIsBusy(false);
        // play first Frame
        jumpToFrame(0);
        getFromFrames();
    });
}

//isBusy getter
function getIsBusy() {
    return isBusy_;
}

//isBusy setter
function setIsBusy(val) {
    isBusy_ = val;
}
