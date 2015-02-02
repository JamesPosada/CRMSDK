// =====================================================================
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
// =====================================================================
/*
Xrm.Page.ui.getCurrentControl 
Xrm.Page.ui.getFormType 
Xrm.Page.ui.getViewPortHeight 
Xrm.Page.ui.getViewPortWidth 
Xrm.Page.ui.refreshRibbon
Xrm.Page.ui.controls.forEach 
Xrm.Page.ui.controls.get 
Xrm.Page.ui.controls.getLength
*/
// <snippetXrmPageScriptsUISamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.UISamples = {};

 // Xrm.Page.ui.getCurrentControl() example
// Example: The SDK.UISamples.getCurrentControl function alerts the user with the name of the attribute that currently has focus on the form.
 // <snippetXrmPageScriptsUISamples.getCurrentControl>
SDK.UISamples.getCurrentControl = function () {
 var currentControl = Xrm.Page.ui.getCurrentControl();
 if (currentControl == null) {
  alert("No controls currently have focus.");
 }
 else {
  alert("The control for the '" + currentControl.getLabel() + "' attribute currently has focus.");
 }
};
 // </snippetXrmPageScriptsUISamples.getCurrentControl>

 // Xrm.Page.ui.getFormType() example
// Example: The SDK.UISamples.getFormType function alerts the user with a different message depending on the current form type.
 // <snippetXrmPageScriptsUISamples.getFormType>
SDK.UISamples.getFormType = function () {

 var FORM_TYPE_CREATE = 1;
 var FORM_TYPE_UPDATE = 2;
 var FORM_TYPE_READ_ONLY = 3;
 var FORM_TYPE_DISABLED = 4;
 var FORM_TYPE_QUICK_CREATE = 5;
 var FORM_TYPE_BULK_EDIT = 6;
 var FORM_TYPE_READ_OPTIMIZED = 11;

 var formType = Xrm.Page.ui.getFormType();
 if (formType == FORM_TYPE_CREATE) {
  alert("This record has not yet been created.");
 }
 else {
  alert("This record exists in the database.");
 }
};
 // </snippetXrmPageScriptsUISamples.getFormType>

 // Xrm.Page.ui.getViewPortHeight() example
 // Xrm.Page.ui.getViewPortWidth() example
// Example: The SDK.UISamples.showViewPortSize function displays the current view port width and height to the user an alert.
 // <snippetXrmPageScriptsUISamples.showViewPortSize>
SDK.UISamples.showViewPortSize = function () {
 var viewPortHeight = Xrm.Page.ui.getViewPortHeight();
 var viewPortWidth = Xrm.Page.ui.getViewPortWidth();
 alert("Width: " + viewPortWidth + ", Height: " + viewPortHeight);
};
 // </snippetXrmPageScriptsUISamples.showViewPortSize>


 // Xrm.Page.ui.controls.forEach(function(control, index)) example
// Example: The SDK.UISamples.getMultipleControlAttributes function alerts the user of any attributes that have multiple controls on the form.
 // <snippetXrmPageScriptsUISamples.getMultipleControlAttributes>
SDK.UISamples.getMultipleControlAttributes = function () {
 var attributesOnForm = [];
 var multipleControlAttributes = [];

 Xrm.Page.ui.controls.forEach(function (control, index) {
  if (SDK.UISamples.doesControlHaveAttribute(control)) {
   var attribute = control.getAttribute();
   if (attribute != null) {
    var attributeName = attribute.getName();

    // Check if the attribute has already been added to the attributesOnForm collection
    if (SDK.UISamples.arrayContainsValue(attributesOnForm, attributeName)) {
     // Check if the attribute has already been added to the
     // multipleControlAttributes collection.  This would happen
     // if an attribute has 3+ controls on the form.
     if (SDK.UISamples.arrayContainsValue(multipleControlAttributes, attributeName) == false) {
      multipleControlAttributes.push(attributeName);
     }
    }
    else {
     attributesOnForm.push(attributeName);
    }
   }
  }
 });


 var message = "";
 if (multipleControlAttributes.length > 0) {
  message = "The following attributes have multiple controls on the form:\n\n- ";
  message += multipleControlAttributes.join("\n- ");
 }
 else {
  message = "There are no attributes on the form with multiple controls";
 }

 alert(message);
};

SDK.UISamples.doesControlHaveAttribute = function (control) {
 var controlType = control.getControlType();
 return controlType != "iframe" && controlType != "webresource" && controlType != "subgrid";
};

SDK.UISamples.arrayContainsValue = function (array, value) {
 for (var i in array) {
  if (array[i] == value)
   return true;
 }

 return false;
};
 // </snippetXrmPageScriptsUISamples.getMultipleControlAttributes>

 // Xrm.Page.ui.controls.get() example
// Example: The SDK.UISamples.getFirstControlAttribute function alerts the user with the attribute label of the first control on the form.
 // <snippetXrmPageScriptsUISamples.getFirstControlAttribute>
SDK.UISamples.getFirstControlAttribute = function () {
 var firstControl = Xrm.Page.ui.controls.get()[0];

 alert("The attribute label of the first control on the form is '" + firstControl.getLabel() + "'.");
};
 // </snippetXrmPageScriptsUISamples.getFirstControlAttribute>

 // Xrm.Page.ui.controls.get(delegate function(control, index)) example
// Example: The SDK.UISamples.getAllLookupAttributes function alerts the user with the attribute name for every lookup control on the form.
 // <snippetXrmPageScriptsUISamples.getAllLookupAttributes>
SDK.UISamples.getAllLookupAttributes = function () {
 var message = "The following lookup attributes are on the form:\n\n";

 var lookupControls = Xrm.Page.ui.controls.get(SDK.UISamples.isLookup);
 for (var i in lookupControls) {
  message += "- " + lookupControls[i].getLabel() + "\n";
 }

 alert(message);
};

SDK.UISamples.isLookup = function (control, index) {
 return control.getControlType() == "lookup";
};
 // </snippetXrmPageScriptsUISamples.getAllLookupAttributes>

 // Xrm.Page.ui.controls.get(number) example
 // Xrm.Page.ui.controls.get(index) example
// Example: The SDK.UISamples.getFirstControl function gets the first control on the form, and then using the attribute name from the control, 
 // gets the control by name, and compares the two.
 // <snippetXrmPageScriptsUISamples.getFirstControl>
SDK.UISamples.getFirstControl = function () {
 var firstControlByPosition = Xrm.Page.ui.controls.get(0);
 var firstControlByName = Xrm.Page.ui.controls.get(firstControlByPosition.getName());

 if (firstControlByName == firstControlByPosition) {
  alert("The first control on the form is '" + firstControlByPosition.getLabel() + "'.");
 }
 else {
  alert("An error has occurred:\n\nUnable to determine the label of the first control on the form.");
 }

};
 // </snippetXrmPageScriptsUISamples.getFirstControl>

 // Xrm.Page.ui.controls.getLength() example
// Example: The SDK.UISamples.getControlCount function alerts the user of how many controls are on the current form.
 // <snippetXrmPageScriptsUISamples.getControlCount>
SDK.UISamples.getControlCount = function () {
 var controlsLength = Xrm.Page.ui.controls.getLength();

 alert("This form has " + controlsLength + " controls on it.");
};
 // </snippetXrmPageScriptsUISamples.getControlCount>

 // <snippetXrmPageScriptsUISamples.bindSectionVisibilityToBooleanAttribute>

 /*
 This generic function can be used to bind the visibility of any section to the
 value of a boolean attribute. It requires the following:
 1. It must only be added to the OnChange event of a Boolean attribute
 2. When configuring the event handler, you must pass the execution context as the first parameter.
 3. When configuring the event handler, you must specify the name of the section in the 
 comma separated list of parameters that will be passed to the function.
 For example, if you want to hide the section with the name "marketing information", you must enter
 the following information in the field: "marketing information"  (using quotation marks).

 Note: The section name value can be edited in the application. 
 If this value is changed after event handler has been configured the function will not work.
 */

SDK.UISamples.bindSectionVisibilityToBooleanAttribute = function (eContext, sectionName) {
 Xrm.Page.ui.tabs.forEach(function (tab, index) {
  tab.sections.forEach(function (section, index) {
   if (section.getName() == sectionName)
   { section.setVisible(eContext.getEventSource().getValue()) }
  });
 });
};
 // </snippetXrmPageScriptsUISamples.bindSectionVisibilityToBooleanAttribute>

 //End of UI Samples Functions

// </snippetXrmPageScriptsUISamples>