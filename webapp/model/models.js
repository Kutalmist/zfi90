sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel : function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		musteriKrediLimitiIzlemeModel: function() {
			var oEntry = {
				Value: "",
				NavExpAlv: [],
				NavExpBapiReturn: [],
				NavImpBran1: [],
				NavImpKunnr: [],
				NavImpRegio: [{
					Sign: "I",
					Option: "EQ",
					Low: "01",
					High: ""
				}],
				NavImpVkgrp: [{
					Sign: "I",
					Option: "EQ",
					Low: "S03",
					High: ""
				}]
			};

			return oEntry;
		}

	};
});