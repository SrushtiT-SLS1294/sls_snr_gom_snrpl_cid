/*global sap */
/*NEW CHANGES UPDATED BY ABDULRAZAK 15 FEBRUARY 2023*/
/*CONTACT -  abdul.m@sodalessolutions.com*/
sap.ui.define([
	'sap/ui/core/message/Message',
	'sap/ui/core/MessageType'
], function (Message, MessageType) {
	"use strict";
	var Validator = function () {
		this._isValid = true;
		this._isValidationPerformed = false;
	};

	/**
	 * Returns true _only_ when the form validation has been performed, and no validation errors were found
	 * @memberof nl.qualiture.plunk.demo.utils.Validator
	 *
	 * @returns {boolean}
	 */
	Validator.prototype.isValid = function () {
		return this._isValidationPerformed && this._isValid;
	};

	/**
	 * Recursively validates the given oControl and any aggregations (i.e. child controls) it may have
	 * @memberof nl.qualiture.plunk.demo.utils.Validator
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
	 * @return {boolean} whether the oControl is valid or not.
	 */
	Validator.prototype.validate = function (oControl) {
		this._isValid = true;
		sap.ui.getCore().getMessageManager().removeAllMessages();
		this._validate(oControl, true);
		return this.isValid();
	};
	Validator.prototype.refresh = function (oControl) {
		this._isValid = true;
		this._validate(oControl, false);
		sap.ui.getCore().getMessageManager().removeAllMessages();
	};

	/**
	 * Recursively validates the given oControl and any aggregations (i.e. child controls) it may have
	 * @memberof nl.qualiture.plunk.demo.utils.Validator
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
	 */
	Validator.prototype._validate = function (oControl, check) {
		var aPossibleAggregations = ["items", "content", "form", "formContainers", "formElements", "fields", "sections", "subSections",
				"_grid", "_page", "_cells", "ColumnListItem", "rows", "tokens", "layoutData"
			],
			aControlAggregation = null,
			oControlBinding = null,
			aValidateProperties = ["value", "selectedKey", "selectedKeys", "selectedIndex", "selected"], // yes, I want to validate Select and Text controls too
			isValidatedControl = false,
			oExternalValue, oInternalValue,
			i, j;

		// only validate controls and elements which have a 'visible' property
		if (oControl instanceof sap.ui.core.Control ||
			oControl instanceof sap.ui.layout.form.FormContainer ||
			oControl instanceof sap.ui.layout.form.FormElement ||
			oControl instanceof sap.m.IconTabFilter) {

			// only check visible controls (invisible controls make no sense checking)
			if (oControl.getVisible()) {

				// check control for any properties worth validating 
				if (check) {
					for (i = 0; i < aValidateProperties.length; i += 1) {

						if (oControl.getBinding(aValidateProperties[i])) {
							//  validation for combobx
							/*Give property name=Required to Combobox*/
							if (aValidateProperties[i] === "selectedKeys" && oControl.getName() === "true" && oControl.getEditable()) {
								// check if control has the value selected in selected keys
								oExternalValue = oControl.getProperty(aValidateProperties[i]);
								if (oExternalValue.length > 0) {
									oControl.removeStyleClass("errorNonEdit");
									oControl.setValueState("None");
								} else {
									if (oControl.getEditable()) {
										oControl.setValueState("Error");
									} else {
										oControl.addStyleClass("errorNonEdit")
									}
									this._isValid = false;
								}
							} else if (aValidateProperties[i] === "selectedKey" && oControl.getName() === "true" && oControl.getEditable()) {
								oExternalValue = oControl.getProperty(aValidateProperties[i]);
								if (oExternalValue.length > 0) {
									oControl.removeStyleClass("errorNonEdit");
									oControl.setValueState("None");
								} else {
									if (oControl.getEditable()) {
										oControl.setValueState("Error");
									} else {
										oControl.addStyleClass("errorNonEdit")
									}
									this._isValid = false;
								}

							} else if (aValidateProperties[i] === "value" && oControl.getName() === "true" && oControl.getEditable()) {
								oExternalValue = oControl.getProperty(aValidateProperties[i]);
								oExternalValue = oExternalValue.trim();
								if (oExternalValue.length > 0) {
									oControl.removeStyleClass("errorNonEdit");
									oControl.setValueState("None");
								} else {
									if (oControl.getEditable()) {
										oControl.setValueState("Error");
									} else {
										oControl.addStyleClass("errorNonEdit")
									}
									this._isValid = false;
								}

							}  else if (aValidateProperties[i] === "selected" && oControl.getName() === "true" && oControl.getEditable()) {
								oExternalValue = oControl.getProperty(aValidateProperties[i]);
								if (oExternalValue) {
									oControl.removeStyleClass("errorNonEdit");
									oControl.setValueState("None");
								} else {
									if (oControl.getEditable()) {
										oControl.setValueState("Error");
									} else {
										oControl.addStyleClass("errorNonEdit")
									}
									this._isValid = false;
								}
								// aValidateProperties[i] === "selectedIndex" && !!oControl.getName && oControl.getParent().getLabel().isRequired() === true && oControl.getEditable()
							} else if (aValidateProperties[i] === "selectedIndex") {
								if(oControl.getParent().mAggregations.cells[1].mBindingInfos.selectedIndex.binding.oType.oConstraints.minimum > 0){
									oExternalValue = oControl.getProperty(aValidateProperties[i]);
									if (oExternalValue > -1) {
	
										oControl.setValueState("None");
									} else {
										oControl.setValueState("Error");
										this._isValid = false;
									}
								}
							

							}else {
								// // check if a data type exists (which may have validation constraints)
								// if (oControl.getBinding(aValidateProperties[i]).getType()) {
								// 	// try validating the bound value
								// 	try {
								// 		oControlBinding = oControl.getBinding(aValidateProperties[i]);
								// 		oExternalValue = oControl.getProperty(aValidateProperties[i]);
								// 		oInternalValue = oControlBinding.getType().parseValue(oExternalValue, oControlBinding.sInternalType);
								// 		oControlBinding.getType().validateValue(oInternalValue);
								// 	}
								// 	// catch any validation errors
								// 	catch (ex) {
								// 		oControl.setValueState("Error");
								// 		this._isValid = false;
								// 		oControlBinding = oControl.getBinding(aValidateProperties[i]);
								// 		sap.ui.getCore().getMessageManager().addMessages(
								// 			new Message({
								// 				message: ex.message,
								// 				type: MessageType.Error,
								// 				target: (oControlBinding.getContext() ? oControlBinding.getContext().getPath() + "/" : "") +
								// 					oControlBinding.getPath(),
								// 				processor: oControl.getBinding(aValidateProperties[i]).getModel()
								// 			})
								// 		);
								// 	}

								// 	isValidatedControl = true;
								// }
							}
						}
					}
				} else {
					for (i = 0; i < aValidateProperties.length; i += 1) {
						if (oControl.getBinding(aValidateProperties[i])) {
							//  validation for combobx
							/*Give property name=Required to Combobox*/
							// console.log(oControl);
							if (aValidateProperties[i] === "selectedKeys" && oControl.getName() === "true") {

								oControl.setValueState("None");
								// this._isValid = false;

							} else if (aValidateProperties[i] === "selectedKey" && oControl.getName() === "true") {

								oControl.setValueState("None");
								// this._isValid = false;

							} else if (aValidateProperties[i] === "value" && oControl.getName() === "true") {

								oControl.setValueState("None");
								// this._isValid = false;
								// && oControl.getParent().getLabel().isRequired() === true
							} else if (aValidateProperties[i] === "selectedIndex") {

								oControl.setValueState("None");
								// this._isValid = false;

							} else if (aValidateProperties[i] === "selected" && oControl.getName() === "true") {

								oControl.setValueState("None");
								// this._isValid = false;

							} else {
								// // check if a data type exists (which may have validation constraints)
								// if (oControl.getBinding(aValidateProperties[i]).getType()) {
								// 	// try validating the bound value
								// 	try {
								// 		oControlBinding = oControl.getBinding(aValidateProperties[i]);
								// 		oExternalValue = oControl.getProperty(aValidateProperties[i]);
								// 		oInternalValue = oControlBinding.getType().parseValue(oExternalValue, oControlBinding.sInternalType);
								// 		oControlBinding.getType().validateValue(oInternalValue);
								// 	}
								// 	// catch any validation errors
								// 	catch (ex) {
								// 		oControl.setValueState("Error");
								// 		this._isValid = false;
								// 		oControlBinding = oControl.getBinding(aValidateProperties[i]);
								// 		sap.ui.getCore().getMessageManager().addMessages(
								// 			new Message({
								// 				message: ex.message,
								// 				type: MessageType.Error,
								// 				target: (oControlBinding.getContext() ? oControlBinding.getContext().getPath() + "/" : "") +
								// 					oControlBinding.getPath(),
								// 				processor: oControl.getBinding(aValidateProperties[i]).getModel()
								// 			})
								// 		);
								// 	}

								// 	isValidatedControl = true;
								// }
							}
						}
					}
				}
				// if the control could not be validated, it may have aggregations
				if (!isValidatedControl) {
					for (i = 0; i < aPossibleAggregations.length; i += 1) {
						aControlAggregation = oControl.getAggregation(aPossibleAggregations[i]);
						if (aControlAggregation) {
							// Validation for Table
							if (aControlAggregation.length > 0) {
								for (var m = 0; m < aControlAggregation.length; m += 1) {
									if (aControlAggregation[m]) {
										if (aControlAggregation[m].getAggregation("cells")) {
											for (var n = 0; n < aControlAggregation[m].getCells().length; n += 1) {
												this._validate(aControlAggregation[m].getCells()[n], check);
											}
										}
									}
								}
							}
							// generally, aggregations are of type Array
							if (aControlAggregation instanceof Array) {
								for (j = 0; j < aControlAggregation.length; j += 1) {
									this._validate(aControlAggregation[j], check);
								}
							}
							// ...however, with sap.ui.layout.form.Form, it is a single object *sigh*
							else {
								this._validate(aControlAggregation, check);
							}
						}
					}
				}
			}
		}
		this._isValidationPerformed = true;
	};

	return Validator;
});