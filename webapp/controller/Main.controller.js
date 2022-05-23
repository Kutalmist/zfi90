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
			this._mViewSettingsDialogs = {};
			this.reset();
		},

		handlerData: function(oData){
			console.log(oData);
			oData.NavExpAlv.results.forEach(function(item){
				item.KulCarLim = item.KulCarLim ? Number(item.KulCarLim) : item.KulCarLim;
				item.CarHesLim = item.CarHesLim ? Number(item.CarHesLim) : item.CarHesLim;
				item.NrAmount = item.NrAmount ? Number(item.NrAmount) : item.NrAmount;
				item.Ch = item.Ch ? Number(item.Ch) : item.Ch;
				item.VadeGcnSure = item.VadeGcnSure ? Number(item.VadeGcnSure) : item.VadeGcnSure;
				item.AcSip = item.AcSip ? Number(item.AcSip) : item.AcSip;
				item.Ciro = item.Ciro ? Number(item.Ciro) : item.Ciro;
			})
			that.oMainModel.setProperty("/MusteriKrediLimitListesi", oData.NavExpAlv.results);
		},

		reset: function() {
			that.oMainModel.setProperty("/MusteriKrediLimitListesi", []);
			that.oMainModel.setProperty("/AktifBayiler",true);
		},

		onKunnrSearchHelp: function(oEvent) {
			var oModel = this.oMainModel;
			var i18n = this.i18nModel;
			if (!this.KunnrSelectDialog) {
				this.KunnrSelectDialog = sap.ui.xmlfragment("com.sadal.zfi90.fragments.KunnrSelectDialog", this);
				this.KunnrSelectDialog.setModel(oModel);
				this.KunnrSelectDialog.setModel(i18n, "i18n");
			}
			this.KunnrSelectDialog.open();
		},

		onKunnrSelectDialogSearchBtnPress: function(oEvent) {
			var aktif=that.oMainModel.getProperty("/AktifBayiler");
			var query = that.oMainModel.getProperty("/kunnrSearchField");
			var selectedRadioButtonId = sap.ui.getCore().byId("kunnrRadioGroup").getSelectedButton().getId();
			var oEntry = models.kunnrSearchHelpModel(selectedRadioButtonId,aktif, query);

			this.getKunnrSearchHelp(oEntry, function(oData) {
				that.oMainModel.setProperty("/SearchHelpData", oData.NavExpResultKunnrSearchHelp.results);
			});
		},

		onSelectKunnr: function(oEvent) {
			var selectedPath = oEvent.getSource().getBindingContext().getPath();
			var selectedKunnr = that.oMainModel.getProperty(selectedPath);
			this.oMainModel.setProperty("/Kunnr", selectedKunnr.Kunnr);
			this.onKunnrSelectDialogClose(); // close and clear-reset fragment 
		},

		onKunnrSelectDialogClose: function () {
			//reset-clear fragment view
			var oList = sap.ui.getCore().byId("idKunnrSelectList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(); // clear filter
			this.oMainModel.setProperty("/SearchHelpData", []);
			sap.ui.getCore().byId("idSearchField").setValue(""); // search value clear

			that.KunnrSelectDialog.close();

		},

		onSearchHelp: function(oEvent) {
			var id = oEvent.getParameter("id");
			var vkgrpSearchHelp = id.indexOf("VkgrpInput") > -1;
			var bran1SearchHelp = id.indexOf("Bran1Input") > -1;
			var regioSearchHelp = id.indexOf("RegioInput") > -1;

			switch (true) {
				case vkgrpSearchHelp:
					that.oMainModel.setProperty("/ActiveSearchHelp", "Vkgrp");
					break;
				case bran1SearchHelp:
					that.oMainModel.setProperty("/ActiveSearchHelp", "Bran1");
					break;			
				case regioSearchHelp:
					that.oMainModel.setProperty("/ActiveSearchHelp", "Regio");
					break;
			}

			var oEntry = models.searchHelpModel();
			this.getZfi90SearchHelp(oEntry, that.handlerSearchHelpData);
		},

		handlerSearchHelpData: function(oData) {
			console.log(oData);
			// Statüs Bran1
			// Vkgrp Müşteri Temsilcisi
			// Regio il

			var activeSearchHelp = that.oMainModel.getProperty("/ActiveSearchHelp");
			that.oMainModel.setProperty("/SearchHelpData", oData[`NavExp${activeSearchHelp}SearchHelp`].results);
			
			var oModel = that.oMainModel;
			var i18n = that.i18nModel;
			var selectDialogName = `${activeSearchHelp}SelectDialog`;
			if (!that[selectDialogName]) {
				var fragmentName = `com.sadal.zfi90.fragments.${selectDialogName}`;
				that[selectDialogName] = sap.ui.xmlfragment(fragmentName, that);
				that[selectDialogName].setModel(oModel);
				that[selectDialogName].setModel(i18n, "i18n");
			}
			that[selectDialogName].open();
		},

		onSearchHelpSearch: function(oEvent){
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery && sQuery.length > 0) {
				var activeSearchHelp = that.oMainModel.getProperty("/ActiveSearchHelp");
				var aFilters = models[`${activeSearchHelp}FilterModel`](sQuery);
			}

			// update list binding
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter(); // clear filter
			oBinding.filter(aFilters);
		},

		onSearchHelpClose: function(oEvent){

			var selectedItem = oEvent.getParameter("selectedItem");
			if (!selectedItem) {
				//reset-clear fragment view
				that.searchHelpClearFilter(oEvent);
				return;
			}
			var activeSearchHelp = that.oMainModel.getProperty("/ActiveSearchHelp");
			that.oMainModel.setProperty(`/${activeSearchHelp}`, selectedItem.getProperty("description"));
			//reset-clear fragment view
			that.searchHelpClearFilter(oEvent);
		},

		searchHelpClearFilter: function(oEvent) {
			//reset-clear fragment view
			var oList = oEvent.getSource();
			var oBinding = oList.getBinding("items");
			oBinding.filter(); // clear filter
			that.oMainModel.setProperty("/SearchHelpData", []);
		},

		onPressListele: function(oEvent) {
			var kunnr = that.oMainModel.getProperty("/Kunnr");
			var vkgrp = that.oMainModel.getProperty("/Vkgrp");
			var bran1 = that.oMainModel.getProperty("/Bran1");
			var regio = that.oMainModel.getProperty("/Regio");

			var oEntry = models.musteriKrediLimitiIzlemeModel(kunnr, vkgrp, bran1, regio);
			that.getMusteriKrediLimitiIzlemeListesi(oEntry, this.handlerData);
		},

		onCiktiAl: function (oEvent) {
			var oPath = oEvent.oSource.oParent.oBindingContexts.mainModel.sPath;
			var item = this.oMainModel.getProperty(oPath);
			var host = window.location.host;
			var protocol = window.location.protocol;
			var sLink = protocol + "//" + host + "/sap/opu/odata/sap/ZFI_GW_001_SRV/PdfCiktisiSet(IKunnr='" + item.Kunnr +"')/$value";

			window.open(sLink, "PDF File", "height=600,width=800");
		},
		handleButtonPressed: function(oEvent) {
			var param = oEvent.getSource().data("param");
			this.createViewSettingsDialog("com.sadal.zfi90.view.fragments." + param, "tableId",
				"tableColonList_ID").open();
		},

	});
});