sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library",
	"com/sadal/zfi90/model/models",
	"com/sadal/zfi90/model/formatter",
], function (Controller, UIComponent, mobileLibrary, models, formatter) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("com.sadal.zfi90.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		showBusyIndicator: function () {
			sap.ui.core.BusyIndicator.show(0);
		},

		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide(0);
		},

		showMessageDialog: function (state, title, message) {
			var dialog = new sap.m.Dialog({
				title: title,
				type: "Message",
				state: state,
				content: new sap.m.Text({
					text: message
				}),
				beginButton: new sap.m.Button({
					text: this.getResourceBundle().getText("dlgCloseText"),
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		showSuccessMessageDialog: function (title, message) {
			var messageTitle = title;
			if (messageTitle === null || messageTitle === "") {
				messageTitle = this.getResourceBundle().getText("successfulMessageTitle");
			}
			this.showMessageDialog("Success", messageTitle, message);
		},

		showWarningMessageDialog: function (title, message) {
			var messageTitle = title;
			if (messageTitle === null || messageTitle === "") {
				messageTitle = this.getResourceBundle().getText("warningMessageTitle");
			}
			this.showMessageDialog("Warning", messageTitle, message);
		},

		showErrorMessageDialog: function (title, message) {
			var messageTitle = title;
			if (messageTitle === null || messageTitle === "") {
				messageTitle = this.getResourceBundle().getText("errorMessageTitle");
			}
			this.showMessageDialog("Error", messageTitle, message);
		},

		showMessageBoxConfirm: function (message, onCloseFn, actions) {
			sap.m.MessageBox.confirm(message, {
				actions: actions || [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				styleClass: "sapUiSizeCompact",
				onClose: onCloseFn
			});
		},

		showToastMessage: function (message) {
			sap.m.MessageToast.show(message);
		},

		showNoDataFoundToastMessage: function () {
			var noDataFoundMessage = this.getResourceBundle().getText("noRecordFoundText");
			this.showToastMessage(noDataFoundMessage);
		},

		handleShowMessage: function (messages) {
			var oModel = this.oMainModel;
			var i18n = this.i18nModel;
			if (!this.MessageListDialog) {
				this.MessageListDialog = sap.ui.xmlfragment("com.sadal.zfi90.fragments.MessageList", this);
				this.MessageListDialog.setModel(oModel);
				this.MessageListDialog.setModel(i18n, "i18n");
			}
			var messageList = [];
			for (var i in messages) {
				if (messages[i].Message !== "") {
					messageList.push(messages[i]);
				}
			}
			if (messageList !== "") {
				oModel.setProperty("/MessageList", messageList);
				this.MessageListDialog.open();
			}
		},

		onMessageDialogCloseButton: function () {
			this.MessageListDialog.close();
		},

		onCreateDeepEntity: function (entitySetName, oEntry, modelServiceName, callBack) {
			var that = this;

			this.showBusyIndicator();
			var oDataModel = null;
			if (modelServiceName !== undefined && modelServiceName !== null)
				oDataModel = this.getOwnerComponent().getModel(modelServiceName);
			else
				oDataModel = this.getOwnerComponent().getModel();

			if (oDataModel === null || oDataModel === undefined) {
				that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisBulunamadi"));
				console.log(modelServiceName + " servisi bulunamadı");
				that.hideBusyIndicator();
				return false;
			}

			oDataModel.create(entitySetName, oEntry, {
				success: function (oData, oResponse) {
					that.hideBusyIndicator();
					if (callBack !== null && callBack !== undefined)
						callBack(oData, oResponse);
				},
				error: function (oError) {
					that.hideBusyIndicator();
					that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisHatasiLogaBak"));
					console.log(oError);
				},
				failed: function (oError) {
					that.hideBusyIndicator();
					that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisHatasiLogaBak"));
					console.log(oError);
				}
			});
		},

		onReadDeepEntity: function (entitySetName, parameter, modelServiceName, callBack) {
			var that = this;

			this.showBusyIndicator();
			var oDataModel = null;
			if (modelServiceName !== undefined && modelServiceName !== null)
				oDataModel = this.getOwnerComponent().getModel(modelServiceName);
			else
				oDataModel = this.getOwnerComponent().getModel();

			if (oDataModel === null || oDataModel === undefined) {
				that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisBulunamadi"));
				console.log(modelServiceName + " servisi bulunamadı");
				that.hideBusyIndicator();
				return false;
			}

			var methodName = entitySetName + "(" + parameter + ")";

			oDataModel.read(methodName, {
				success: function (response) {
					that.hideBusyIndicator();
					if (callBack !== null && callBack !== undefined)
						callBack(response);
				},
				error: function (oError) {
					that.hideBusyIndicator();
					that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisHatasiLogaBak"));
					console.log(oError);
				},
				failed: function (oError) {
					that.hideBusyIndicator();
					that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisHatasiLogaBak"));
					console.log(oError);
				}
			});
		},

		onReadDeepEntityWithFilters: function (entitySetName, filters, modelServiceName, callBack) {
			var that = this;

			this.showBusyIndicator();
			var oDataModel = null;
			if (modelServiceName !== undefined && modelServiceName !== null)
				oDataModel = this.getOwnerComponent().getModel(modelServiceName);
			else
				oDataModel = this.getOwnerComponent().getModel();

			if (oDataModel === null || oDataModel === undefined) {
				that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisBulunamadi"));
				console.log(modelServiceName + " servisi bulunamadı");
				that.hideBusyIndicator();
				return false;
			}

			oDataModel.read(entitySetName, {
				filters: filters,

				success: function (response) {
					that.hideBusyIndicator();
					if (callBack !== null && callBack !== undefined)
						callBack(response);
				},
				error: function (oError) {
					that.hideBusyIndicator();
					that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisHatasiLogaBak"));
					console.log(oError);
				},
				failed: function (oError) {
					that.hideBusyIndicator();
					that.showErrorMessageDialog(that.getResourceBundle().getText("hata"), that.getResourceBundle().getText("servisHatasiLogaBak"));
					console.log(oError);
				}
			});
		},

		getMusteriKrediLimitiIzlemeListesi: function(oEntry, successFn) {
			this.onCreateDeepEntity("/GetMusteriKrediLimitiSet", oEntry, null, successFn);
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress : function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		}	});

});