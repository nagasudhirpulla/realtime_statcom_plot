var fetchScadaValue = function (urlStrObj, callback) {
    var urlStr = urlStrObj.getUrl();
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