var fetchScadaValue = function(urlStrObj, callback) {
    var urlStr = urlStrObj.url;
    $.ajax({
        //fetch revisions data from sever
        url: urlStr,
        type: "GET",
        success: function (data) {
            //WriteLineConsole(urlStr);
            //WriteLineConsole(JSON.stringify(data));
            callback(null, data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            WriteLineConsole(JSON.stringify(jqXHR));
            console.log(textStatus, errorThrown);
            callback(textStatus);
        }
    });
};

var createUrl = function(serverBaseAddress, pnt, historyType, strtime, endtime, secs, type) {
    var url = "";
    if (historyType == "real") {
        url = serverBaseAddress + "/api/values/" + historyType + "?pnt=" + pnt;
    } else if (historyType == "history") {
        url = serverBaseAddress + "/api/values/" + historyType + "?pnt=" + pnt + "&strtime=" + strtime + "&endtime=" + endtime + "&secs=" + secs + "&type=" + type;
    }
    //WriteLineConsole(url);
    return url;
};