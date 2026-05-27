sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
    "sap/ui/table/TablePersoController",
    "../model/formatter"
], (BaseController, Controller, JSONModel, Filter, FilterOperator, UIComponent, TablePersoController, formatter) => {
    "use strict";

    return BaseController.extend("snrprtl.slssnrgomsnrpl.controller.Worklist", {
        formatter: formatter,
        onInit: function () {
            // let sModulePath = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
            // let sPath = sap.ui.require.toUrl(sModulePath + "/model/data.json");
            // this.sPath = sPath;
            let oModel = new JSONModel(
                {
                    "aReportData": [],
                    "oFilter": {
                        'employeetype': ''
                    }
                }
            );
            // oModel.loadData(sPath);
            this.getView().setModel(oModel, "worklistView");
            this.getRouter().getRoute("RouteWorklist").attachPatternMatched(this._onWorklistMatched, this);

            var oThis = this;
            this.screenHeight = window.screen.height;
            this._osnrSetting = new TablePersoController({
                table: oThis.getView().byId("id_Seniority_Table")
            });
           

            // sap.m.ComboBox.prototype.onAfterRendering = function (e) {
            // 	$("#" + e.srcControl.getId() + "-inner").prop("readonly", true);
            // };
            // // This function is provide the typing restriction
            // sap.m.DatePicker.prototype.onAfterRendering = function (e) {
            // 	$("#" + e.srcControl.getId() + "-inner").prop("readonly", true);
            // };
            // // This function is provide the typing restriction 
            // sap.m.TimePicker.prototype.onAfterRendering = function (e) {
            // 	$("#" + e.srcControl.getId() + "-inner").prop("readonly", true);
            // };
            // // This function is provide the typing restriction 
            // sap.m.Input.prototype.onAfterRendering = function (e) {
            // 	$("#" + e.srcControl.getId() + "-inner").prop("readonly", true);
            // };
        },
        onExit: function () {
            this._osnrSetting = null;
        },
        openPersoDialog: function (oEvent, tableID) {
            var oViewModel = this.getView().getModel("worklistView");
            if (tableID === 'id_Seniority_Table')
                this._osnrSetting.openDialog();

        },

        _onBtnPress(oEvent) {
            let oRouter = this.getOwnerComponent().getRouter();
            // const id = "200101";
            // const oContext = oEvent.getSource().getBindingContext("worklistView");
            const oContext = oEvent.getSource().getBindingContext();
            const id = oContext.getProperty("EMPID");
            oRouter.navTo("Object", {
                objectId: id
            })
        },

        onCommonValueHelp: function (oEvent) {

            this._currentInput = oEvent.getSource();

            var sI18nKey = this._currentInput.data("i18nKey");

            switch (sI18nKey) {

                case "firstname":
                    if (!this._VHFnameDilog) {
                        this._VHFnameDilog = sap.ui.xmlfragment(
                            "snrprtl.slssnrgomsnrpl.view.Dialog_Fragments.onPress_VHEmpFNm", this);
                        this.getView().addDependent(this._VHFnameDilog);
                    }
                    this._VHFnameDilog.open();
                    break;

                case "lastname":
                    if (!this._createArticleDialog) {
                        this._createArticleDialog = sap.ui.xmlfragment(
                            "snrprtl.slssnrgomsnrpl.view.Dialog_Fragments.onPress_VHEmpLNm", this);
                        this.getView().addDependent(this._createArticleDialog);
                    }
                    this._createArticleDialog.open();
                    break;

                case "employeenameid":
                    if (!this._EmpIdDialog) {
                        this._EmpIdDialog = sap.ui.xmlfragment(
                            "snrprtl.slssnrgomsnrpl.view.Dialog_Fragments.onPress_VHEmpID", this);
                        this.getView().addDependent(this._EmpIdDialog);
                    }
                    this._EmpIdDialog.open();
                    break;

                case "jobclassification":
                    if (!this._jObClsfctnDialog) {
                        this._jObClsfctnDialog = sap.ui.xmlfragment(
                            "snrprtl.slssnrgomsnrpl.view.Dialog_Fragments.onPress_VHJobClsfction", this);
                        this.getView().addDependent(this._jObClsfctnDialog);
                    }
                    this._jObClsfctnDialog.open();
                    break;
            }
        },


        /* i am writing here a helper function for dialog setup, bcz i use  loadFragment (and it is asynchronous)
        if instant bindaggregation kia toh error aega thas why fragment load hone ke bad hi dialog ka setup karana is best way
        */
        onValueHelpConfirm: function (oEvent) {

            var oItem = oEvent.getParameter("selectedItem");
            if (!oItem) return;

            var oData = oItem.getBindingContext().getObject();

            var sKey = this._currentInput.data("i18nKey");

            switch (sKey) {

                case "firstname":
                    this._currentInput.setValue(oData.EMPFN);
                    break;

                case "lastname":
                    this._currentInput.setValue(oData.EMPLN);
                    break;

                case "employeenameid":
                    this._currentInput.setValue(oData.EMPID);
                    break;

                case "jobclassification":
                    this._currentInput.setValue(oData.JBCLS);
                    break;
            }
        },
        // onFilterSearch: function (oEvent) {


        //     var oTable = this.byId("id_Seniority_Table"),
        //         oBinding = oTable.getBinding("rows"),
        //         worklist = this.getOwnerComponent().getModel("oGlobalModel"),
        //         ofilter = worklist.getProperty("/oFilter"),
        //         oFilterBar = this.byId("snrFilterBar"),
        //         oHANAModel = this.worklist,
        //         oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
        //             pattern: "yyyy/MM/dd",
        //             UTC: true
        //         }),
        //         aFilters = [];

        //     var aFilterItems = oFilterBar.getFilterGroupItems();
        //     aFilterItems.forEach(function (oItem) {
        //         var sName = oItem.getName();
        //         var oControl = oItem.getControl();
        //         if (ofilter.CSD) {
        //             const dates = ofilter.CSD.split(' - ');

        //             if (dates.length === 2) {
        //                 aFilters.push(new Filter(
        //                     "CSTD",
        //                     FilterOperator.BT,
        //                     oDateFormat.format(new Date(new Date(dates[0]).getTime() + Math.abs(new Date(dates[0]).getTimezoneOffset() * 60000))),
        //                     oDateFormat.format(new Date(new Date(dates[1]).getTime() + Math.abs(new Date(dates[1]).getTimezoneOffset() * 60000)))
        //                 ));
        //             }
        //         }

        //         // if (!oControl) return;

        //         // ofilter.CSD !== "" ? aFilters.push(new Filter("CSTD", FilterOperator.BT, oDateFormat.format(new Date(new Date(ofilter.CSD.split(
        //         //     ' - ')[0]).getTime() + Math.abs(new Date(ofilter.CSD.split(' - ')[0]).getTimezoneOffset() * 60000))),
        //         //     oDateFormat.format(new Date(new Date(ofilter.CSD.split(' - ')[1]).getTime() + Math.abs(new Date(ofilter.CSD
        //         //         .split(' - ')[1]).getTimezoneOffset() * 60000))))) : '';

        //         // ofilter.TSLB10 !== "" ? aFilters.push(new Filter("TSLB10", FilterOperator.EQ, ofilter.TSLB10)) : ''; //completed date
        //         // ofilter.TSLB10 !== "" ? aFilters.push(new Filter("TSLB10", FilterOperator.BT, oDateFormat.format(new Date(new Date(ofilter.TSLB10.split(
        //         //     ' - ')[0]).getTime() + Math.abs(new Date(ofilter.TSLB10.split(' - ')[0]).getTimezoneOffset() * 60000))),
        //         //     oDateFormat.format(new Date(new Date(ofilter.TSLB10.split(' - ')[1]).getTime() + Math.abs(new Date(ofilter.TSLB10
        //         //         .split(' - ')[1]).getTimezoneOffset() * 60000))))) : '';

        //         // --- ComboBox ---
        //         if (oControl.isA("sap.m.ComboBox")) {
        //             var sKey = ofilter.employeetype
        //             if (sKey) {
        //                 aFilters.push(new sap.ui.model.Filter({
        //                     path: "typeId",
        //                     operator: sap.ui.model.FilterOperator.EQ,
        //                     value1: sKey
        //                 }));
        //             }
        //         }

        //         // --- MultiInput ---
        //         else if (oControl.isA("sap.m.Input")) {
        //             // var aTokens = oControl.getTokens();
        //             // if (aTokens.length > 0) {
        //             //     var aTokenFilters = aTokens.map(function (oToken) {
        //             //         return new sap.ui.model.Filter(sName, sap.ui.model.FilterOperator.EQ, oToken.getKey() || oToken.getText());
        //             //     });
        //             //     aFilters.push(new sap.ui.model.Filter({
        //             //         filters: aTokenFilters,
        //             //         and: false // OR between multiple tokens
        //             //     }));
        //             // }
        //             // oWorklistFilter.TSLB11NM !== "" ? aFilter.push(new Filter("personId", FilterOperator.EQ, oWorklistFilter.TSLB11NM)) : ''; //Employee name

        //         }
        //     });

        //     oBinding.filter(aFilters);
        // },

       









    });
});