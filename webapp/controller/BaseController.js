sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "snrprtl/slssnrgomsnrpl/model/models",
    "sap/ui/export/Spreadsheet"
], function (Controller, UIComponent, library, Filter, FilterOperator, models, Spreadsheet) {
    "use strict";

    return Controller.extend("snrprtl.slssnrgomsnrpl.controller.BaseController", {

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },



        //ENCRYPT FUNCTION
        encrypt: function (input) {
            var MASTER_MODEL = this.getOwnerComponent().getModel("MASTER_MODEL");
            var oLABEL = MASTER_MODEL.getProperty("/Labels");
            var rawKey = oLABEL.L_CLMPR_ZKEY; //from DB
            var key = rawKey.substring(2, rawKey.length - 4);
            var output = CryptoJS.AES.encrypt(input, key).toString();
            return output;
        },

        //DYCRYPT FUNCTION
        decrypt: function (input) {
            var MASTER_MODEL = this.getOwnerComponent().getModel("MASTER_MODEL");
            var oLABEL = MASTER_MODEL.getProperty("/Labels");
            var rawKey = oLABEL.L_L_ZKEY; //from DB
            var key = rawKey.substring(2, rawKey.length - 4);
            var bytes = CryptoJS.AES.decrypt(input, key);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText;

        },
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        // SEARCH FILTER
        onSearchSelectDialoug: function (oEvent, id, Bindings) {
            var aFilter = [],
                sQuery = typeof oEvent === "object" ? oEvent.getParameter("value") : "",
                oList = this.getView().byId(id) || sap.ui.getCore().byId(id);
            var oBinding = oList.getBinding("items");
            if (sQuery) {
                sQuery = sQuery.trim();
                for (var i = 0; i < Bindings.length; i++) {
                    aFilter.push(new sap.ui.model.Filter({
                        path: Bindings[i],
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sQuery.toLowerCase() || "",
                        caseSensitive: false
                    }));
                }
                var allFilter = new Filter(aFilter, false);
                oBinding.filter(allFilter, "Application", true);

            } else {
                oBinding.filter([], "Application", true);
            }

        },


        // Clear Filter   
        onFilterClear: async function () {
            var oGlobalModel = this.getOwnerComponent().getModel("oGlobalModel");
            oGlobalModel.setProperty("/oFilter", {});
            this.onFilterSearch()
            oGlobalModel.refresh(true)

        },
         onFilterSearch: function () {

            var oTable = this.byId("id_Seniority_Table"),
                oBinding = oTable.getBinding("rows"),
                oGlobalModel = this.getOwnerComponent().getModel("oGlobalModel"),
                oFilterData = oGlobalModel.getProperty("/oFilter"),
                aFilters = [];

            if (!oBinding) return;

            // First Name
            if (oFilterData && oFilterData.EMPFN) {
                aFilters.push(new sap.ui.model.Filter({
                    path: "EMPFN",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oFilterData.EMPFN
                }));
            }

            // Last Name
            if (oFilterData && oFilterData.EMPLN) {
                aFilters.push(new sap.ui.model.Filter({
                    path: "EMPLN",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oFilterData.EMPLN
                }));
            }

            // Employee ID
             if (oFilterData && oFilterData.EMPID) {
                aFilters.push(new sap.ui.model.Filter({
                    path: "EMPID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oFilterData.EMPID
                }));
            }
            // Employee Type
            if (oFilterData && oFilterData.employeetype) {
                aFilters.push(new sap.ui.model.Filter({
                    path: "employeetype",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oFilterData.employeetype
                }));
            }
            // Job Classification
            if (oFilterData && oFilterData.JBCLS) {
                aFilters.push(new sap.ui.model.Filter({
                    path: "JBCLS",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oFilterData.JBCLS
                }));
            }
            
            // Apply all filters (AND condition)
            oBinding.filter(aFilters);
        },

        //common Date Function
        commonDateFunction: function (oEvent) {
            var isValidDate = oEvent.getParameter("valid");
            if (!isValidDate) {
                oEvent.getSource().setValue("");
                // oEvent.getSource().setValueState("Error");
                sap.m.MessageToast.show(this.getResourceBundle().getText('eventValidationMessage'));
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        //common Combobox Function
        commonComboFunction: function (oEvent) {
            if (oEvent.getSource().getSelectedItem()) {
                oEvent.getSource().setValueState("None");
            } else {
                oEvent.getSource().setSelectedKey("");
                oEvent.getSource().setValueState("Error");
                sap.m.MessageToast.show(this.getResourceBundle().getText('eventValidationMessage'));
            }
            oEvent.getSource().setValueState("None");
        },

        //Export Excel
        onPress_ExcelExport: function (oEvent, idTable, oSheetName) {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var SeniorityPortalData = oSheetName;        // Store sheet name for Excel export
            var oTable = this.getView().byId(idTable),   // Get table reference using table ID
                aColumn = [],
                visiblecolumn = oTable._getVisibleColumns();  // Get only visible columns from the table
            //Check if columns are present or not
            if (!visiblecolumn || visiblecolumn.length === 0) {
                MessageBox.warning(oBundle.getText("Nodataavailabletoexport"));
                return;
            }
            var oBinding = oTable.getBinding("rows");
            // Check if table has data before exporting    
            if (!oBinding || oBinding.getLength() === 0) {
                MessageBox.warning(oBundle.getText("Nodataavailabletoexport"));
                return;
            }
            // Loop through visible columns to build Excel column metadata
            for (var k = 0; k < visiblecolumn.length; k++) {
                var visiblecolumnName = visiblecolumn[k].getLabel().getText();
                var path = visiblecolumn[k].getTemplate().getBindingInfo("text")
                    .parts[0].path;
                aColumn.push({               // Push column configuration for Spreadsheet export
                    label: visiblecolumnName,
                    property: path,
                    type: "string",
                    width: "30",
                    textAlign: "left",
                });
            }
            // Define Excel export settings
            var oSettings = {
                workbook: {
                    columns: aColumn,
                    context: { sheetName: SeniorityPortalData },
                },
                dataSource: oBinding,
                fileName: SeniorityPortalData + ".xlsx",
                showProgress: true,
                worker: false,
            };
            // Build and download Excel file
            new Spreadsheet(oSettings).build();
        },

    });
});
