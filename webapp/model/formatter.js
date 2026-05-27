sap.ui.define([], function () {
	"use strict";

	return {
		
		payloadDateFormat: function (sDate, sPattern) {
			if (Boolean(sDate)) {
				if (moment(sDate).isValid()) {
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: sPattern,
						UTC: false
					});
					return dateFormat.format(new Date(sDate));
				} else {
					if (typeof (sDate) === 'string') {
						if (!sDate){return "";}
						const match = sDate.match(/\d+/);
						if (!match){return "";}
						const dateObj = new Date(parseInt(match[0], 10));
						sDate = dateObj;
					};
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: sPattern,
						UTC: false
					});
					return dateFormat.format(new Date(sDate));
				}
			} else {
				return ''
			}

		},
	
	
		
	};

});