sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit : function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		formatDate: function (date, format) {
			// SAPUI5 formatters
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: format
			});
			// format date to strings offsetting to GMT
			var dateStr = dateFormat.format(date); //05-12-2012 || 18:00
			return dateStr;
		},

		formatStringJsDateToOdataDate: function(stringDateValue){
			var date = new Date(stringDateValue);
			var formattedDate = this.formatDate(date, "yyyy-MM-ddT00:00:00");
			return formattedDate;
		},

		convertOdataTimeToJsDate: function (ms) {
			// timezoneOffset is in hours convert to milliseconds
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			var time = new Date(ms + TZOffsetMs); //14:00:00
			return time;
		},

		shortDateFormatFromOdata: function(value){
			// SAPUI5 formatters
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd-MM-YYYY"
			});
			// format date to strings offsetting to GMT
			var dateStr = dateFormat.format(value); //05-12-2012 || 18:00
			return dateStr;
		},

		shortTimeFormat: function(value) {
			// SAPUI5 formatters
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "HH:mm"
			});
			var shortTime = dateFormat.format(value);
			return shortTime;
		},

		messageTypeFormatter: function (value) {
			switch (value) {
			case "E":
				return "Error";
			case "S":
				return "Success";
			case "W":
				return "Warning";
			case "I":
				return "Success";
			}
		}

	};

});