sap.ui.define([
    "sap/ui/core/UIComponent",
    "snrprtl/slssnrgomsnrpl/model/models",
    "sap/ui/model/json/JSONModel",
], (UIComponent, models,JSONModel) => {
    "use strict";

    return UIComponent.extend("snrprtl.slssnrgomsnrpl.Component", {
        metadata: {
            manifest: "json",
            "config": {
                "fullWidth": true
            },
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },
        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

             let oModel = new JSONModel(
                {
                    "oFilter": {
                        "EMPFN":"",
                        "EMPLN":"",
                        "EMPID":"",
                        "employeetype":"",
                        "JBCLS":"",
                        "EMPSTATUS":"",
                        "UendDate":"",
                        "unionentrydt":"",
                        "DPRTMNT":"",



                    },
                    'oManageSnr':{},
                    ' KPI_DATA':56
                }
                
            );
            this.setModel(oModel, "oGlobalModel");
            // this.KPI_DATA();
        },

        //  KPI_DATA:function(){
        //     var oGlobalModel = this.getModel("oGlobalModel");
		// 	var oODataModel = this.getModel();
		// 	let oBusyDialog = new sap.m.BusyDialog();
		// 	oBusyDialog.open();
		// 	oODataModel.read("/jyxo21wxwc9o287x", {
		// 		success: function (oData) {
		// 			const flatData = oData.results.flat(); 
	    //             oGlobalModel.setProperty("/KPI_DATA", oData.results[0]);
		// 			oBusyDialog.close();
		// 		},
		// 		error: function (oError) {
		// 			console.error(eRrorMsg, oError);
		// 			oBusyDialog.close();
		// 		}
		// 	});
            
        // },
    });
});