var apiServerBaseAddress_g = 'http://wmrm0mc1:62448';

var payLoadSources_g = [
    {
        name: 'Satna_STATCOM_x_value',
        pnt: 'WRLDCMP.SCADA3.A0106099',
        url: createUrl(apiServerBaseAddress_g, 'WRLDCMP.SCADA3.A0106099', 'real'),
        getUrl: function () {
            return createUrl(apiServerBaseAddress_g, this.pnt, 'real')
        }
    },
    {
        name: 'Satna_STATCOM_y_value',
        pnt: 'WRLDCMP.SCADA3.A0106098',
        url: createUrl(apiServerBaseAddress_g, 'WRLDCMP.SCADA3.A0106098', 'real'),
        getUrl: function () {
            return createUrl(apiServerBaseAddress_g, this.pnt, 'real')
        }
    }];

var payLoadSourcesHistory_g = [
    {
        name: 'Satna_STATCOM_x_value',
        pnt: 'WRLDCMP.SCADA3.A0106099',
        strategy: 'snap',
        startTime: '',
        endTime: '',
        dataRate: 60,
        url: createUrl(apiServerBaseAddress_g, 'WRLDCMP.SCADA3.A0106099', 'history', "31/03/2018/00:00:00", "31/03/2018/10:00:00", 60, "snap"),
        getUrl: function () {
            return createUrl(apiServerBaseAddress_g, this.pnt, 'history', this.startTime, this.endTime, this.dataRate, this.strategy);
        }
    },
    {
        name: 'Satna_STATCOM_y_value',
        pnt: 'WRLDCMP.SCADA3.A0106098',
        strategy: 'snap',
        startTime: '',
        endTime: '',
        dataRate: 60,
        url: createUrl(apiServerBaseAddress_g, 'WRLDCMP.SCADA3.A0106098', 'history', "31/03/2018/00:00:00", "31/03/2018/10:00:00", 60, "snap"),
        getUrl: function () {
            return createUrl(apiServerBaseAddress_g, this.pnt, 'history', this.startTime, this.endTime, this.dataRate, this.strategy);
        }
    }];