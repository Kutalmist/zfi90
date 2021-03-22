sap.ui.define([
	"com/sadal/zfi90/controller/BaseController",
	"com/sadal/zfi90/model/formatter",
	"com/sadal/zfi90/model/models",
], function(
	BaseController,
	formatter,
	models
) {
	"use strict";

	var that = null;
	return BaseController.extend("com.sadal.zfi90.controller.Main", {
		formatter: formatter,

		onInit: function() {
			that = this;

			this.oDataModel = this.getOwnerComponent().getModel();
			this.oMainModel = this.getOwnerComponent().getModel("mainModel");
			this.oMainModel.setSizeLimit(99999);

			this.i18nModel = this.getOwnerComponent().getModel("i18n");

			this.reset();

			var oEntry = models.musteriKrediLimitiIzlemeModel();
			that.getMusteriKrediLimitiIzlemeListesi(oEntry, this.handlerData);
		},

		handlerData: function(oData){
			console.log(oData);
			that.oMainModel.setProperty("/MusteriKrediLimitListesi", oData.NavExpAlv.results);
		},

		reset: function() {
			that.oMainModel.setProperty("/MusteriKrediLimitListesi", []);
		},

		onMusteriSearchHelp: function(oEvent) {	},

		onMusteriTemsilcisiSearchHelp: function(oEvent) {},

		onStatusSearchHelp: function(oEvent) {},

		onIlSearchHelp: function(oEvent) {},

		onPressListele: function(oEvent) {},





	});
});