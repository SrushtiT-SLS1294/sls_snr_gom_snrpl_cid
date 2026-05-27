sap.ui.define([
	"./BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"../model/Validator",

], function (BaseController, Controller, JSONModel, MessageToast, MessageBox,Validator) {
	"use strict";

	return BaseController.extend("snrprtl.slssnrgomsnrpl.controller.Object", {
		onInit: function () {

			this.getRouter().getRoute("Object").attachPatternMatched(this._onObjectMatched, this);

			let oModel = new JSONModel({
				"visible": false,
				"selectedTab": "History",
				"result": [
					{
						"effectiveDate": "2021-03-26",
						"eventReason": "Hiring",
						"seniorityToDate": "2021-06-26",
						"comments": "Permanent"
					},
					{
						"effectiveDate": "2021-07-15",
						"eventReason": "Promotion",
						"seniorityToDate": "2022-01-15",
						"comments": "Promoted to Senior RoleThe full text is displayed in place. Lorem ipsum dolor sit amet, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr"
					},
					{
						"effectiveDate": "2022-02-10",
						"eventReason": "Transfer",
						"seniorityToDate": "2022-08-10",
						"comments": "Transferred to New Department"
					},
					{
						"effectiveDate": "2023-01-05",
						"eventReason": "Salary Revision",
						"seniorityToDate": "2023-07-05",
						"comments": "Annual Increment Applied"
					},
					{
						"effectiveDate": "2024-04-01",
						"eventReason": "Role Change",
						"seniorityToDate": "2024-10-01",
						"comments": "Moved to Leadership Role"
					}
				]
			})

			this.getView().setModel(oModel, 'objectView');

		},


		_onObjectMatched: async function (oEvent) {
			let oGlobalModel = this.getView().getModel("objectView");
			oGlobalModel.setProperty("/selectedTab", "History");
		},


		_onPress_Back: function () {
			const oBundle = this.getView().getModel("i18n").getResourceBundle();
			const oHistory = sap.ui.core.routing.History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			MessageBox.confirm(oBundle.getText("confirmationmsg"), {
				title: oBundle.getText("Confirmation"),
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.YES) {
						if (sPreviousHash === undefined || sPreviousHash) {
							window.history.back();
						} else {
							this.getRouter().navTo("Worklist", {}, false);
						}
					}
				}.bind(this)
			});
		},

		// onSelectIconTabBar: function (oEvent) {
		// 	let oGlobalModel = this.getView().getModel("Object");
		// 	let sKey = oEvent.getParameter("key");
		// 	if (sKey === 'Manage') {
		// 		oGlobalModel.setProperty("/visible", true);
		// 	} else {
		// 		oGlobalModel.setProperty("/visible", false);
		// 	}
		// }

		// _onPress_Submit: function (oEvent) {
		// 	var sValue = oEvent.getParameter('value'),
		//                  value = sValue.getValue();

		// 	if (!value) {
		// 		oEvent.getSource().setValue("");
		// 		oEvent.getSource().setValueState("Error");
		// 		sap.m.MessageToast.show(this.getResourceBundle().getText("enterValidDate"));
		// 		return;
		// 	}
		// },

		   _onPress_Submit: function (oEvent, FLAG) {
            //  var oContainer = this.byId("_id_MngSnr_Container");
            var that = this;
            var _bVALIDATION_FLAG = true;
            var validator = new Validator();
			var oContainer = this.byId("_id_MngSnr_Container");


           if (!validator.validate(oContainer)) {
                    _bVALIDATION_FLAG = false;
                    MessageBox.warning(that.getResourceBundle().getText("Pleasefillallthemandatoryfields"));
                    return 0;
            }
            
        },
 
		

	});
});
