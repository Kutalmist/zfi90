sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
], function (JSONModel, Device, Filter, FilterOperator, FilterType) {
	"use strict";

	return {

		createDeviceModel : function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		musteriKrediLimitiIzlemeModel: function(kunnr, vkgrp, bran1, regio) {
			var kunnrFilter = kunnr ? [{
				Sign: "I",
				Option: "EQ",
				Low: kunnr,
				High: ""
			}] : [];

			var vkgrpFilter = vkgrp ? [{
				Sign: "I",
				Option: "EQ",
				Low: vkgrp,
				High: ""
			}] : [];

			var bran1Filter = bran1 ? [{
				Sign: "I",
				Option: "EQ",
				Low: bran1,
				High: ""
			}] : [];

			var regioFilter = regio ? [{
				Sign: "I",
				Option: "EQ",
				Low: regio,
				High: ""
			}] : [];

			var oEntry = {
				Value: "",
				NavExpAlv: [],
				NavExpBapiReturn: [],
				NavImpKunnr: kunnrFilter,
				NavImpVkgrp: vkgrpFilter,
				NavImpBran1: bran1Filter,
				NavImpRegio: regioFilter
			};

			return oEntry;
		},

		searchHelpModel: function() {
			var oEntry = {
				Value: "",
				NavImpBran1SearchHelp: [],
				NavImpRegioSearchHelp: [],
				NavExpBran1SearchHelp: [],
				NavExpRegioSearchHelp: [],
				NavImpVkgrpSearchHelp: [],
				NavExpVkgrpSearchHelp: []
			};

			return oEntry;
		},

		VkgrpFilterModel: function(sQuery) {
			var aFilters = [];
			aFilters = new Filter({
				filters: [
					new Filter("Bezei", FilterOperator.Contains, sQuery),
					new Filter("Vkgrp", FilterOperator.Contains, sQuery),
				],
				and: false,
			});

			return aFilters;
		},

		Bran1FilterModel: function(sQuery) {
			var aFilters = [];
			aFilters = new Filter({
				filters: [
					new Filter("Vtext", FilterOperator.Contains, sQuery),
					new Filter("Braco", FilterOperator.Contains, sQuery),
				],
				and: false,
			});

			return aFilters;
		},

		RegioFilterModel: function(sQuery) {
			var aFilters = [];
			aFilters = new Filter({
				filters: [
					new Filter("Bezei", FilterOperator.Contains, sQuery),
					new Filter("Bland", FilterOperator.Contains, sQuery),
				],
				and: false,
			});

			return aFilters;
		},

		kunnrSearchHelpModel: function(fieldId, query) {
			var filter = [{
				Sign: "I",
				Option: "CP",
				Low: query,
				High: ""
			}];
			
			var oEntry = {
				Value: "",
				NavImpKunnrKunnrSearchHelp: fieldId.indexOf("kunnr") > -1 ? filter : [],
				NavImpNameKunnrSearchHelp: fieldId.indexOf("name") > -1 ? filter : [],
				NavExpResultKunnrSearchHelp: []
			};

			return oEntry;
		},

		KunnrFilterModel: function(sQuery) {
			var aFilters = [];
			aFilters = new Filter({
				filters: [
					new Filter("Name1", FilterOperator.Contains, sQuery),
					new Filter("Name2", FilterOperator.Contains, sQuery),
					new Filter("Kunnr", FilterOperator.Contains, sQuery),
				],
				and: false,
			});

			return aFilters;
		}

	};
});