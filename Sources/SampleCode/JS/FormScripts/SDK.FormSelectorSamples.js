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
Xrm.Page.ui.formSelector.items.forEach 
Xrm.Page.ui.formSelector.items.get
Xrm.Page.ui.formSelector.items.getLength
Xrm.Page.ui.formSelector.getCurrentItem
*/
// <snippetXrmPageScriptsFormSelectorSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.FormSelectorSamples = {};
 // Examples:The following two examples perform the same task. 
 // Both examples display a message showing the label of every form item.

 // Xrm.Page.ui.formSelector.items.forEach() example 1
 // This example uses an anonymous function defined within the argument.
 // <snippetXrmPageScriptsFormSelectorSamples.listFormItems>
SDK.FormSelectorSamples.listFormItems = function () {
 var message = "The following form items are available:\n";

 Xrm.Page.ui.formSelector.items.forEach(function (item, index) {
  var itemLabel = item.getLabel();
  message += "  \u2219 " + itemLabel + "\n";
 });

 alert(message);
};
 // </snippetXrmPageScriptsFormSelectorSamples.listFormItems>

 // Xrm.Page.ui.navigation.items.forEach() example 2
 // This example passes a reference to a function defined outside the argument.
 // <snippetXrmPageScriptsFormSelectorSamples.listFormItems_Example2>
SDK.FormSelectorSamples.listFormItems_Example2 = function () {
 window.message = "The following form items are available:\n";

 Xrm.Page.ui.formSelector.items.forEach(SDK.FormSelectorSamples.addFormItemToMessage);

 alert(window.message);
 window.message = null;
};

SDK.FormSelectorSamples.addFormItemToMessage = function (item, index) {
 var itemLabel = item.getLabel();
 window.message += "  \u2219 " + itemLabel + "\n";
};
 // </snippetXrmPageScriptsFormSelectorSamples.listFormItems_Example2>

 // Xrm.Page.ui.formSelector.items.get() example
 // Xrm.Page.ui.formSelector.items.get(number) example
 // Xrm.Page.ui.formSelector.items.get(string) example
// Example: The SDK.FormSelectorSamples.getFirstformItem function gets the first form item using all four of the get() overloads, 
 // and compares them to ensure they are the same.
 // <snippetXrmPageScriptsFormSelectorSamples.getFirstFormItem>
SDK.FormSelectorSamples.getFirstFormItem = function () {
 var allItems = Xrm.Page.ui.formSelector.items.get();

 if (allItems.length > 1) {
  // Get the first form item by index.
  var firstItemByIndex = Xrm.Page.ui.formSelector.items.get(0);

  // Get the first form item by id.
  var firstItemByName = Xrm.Page.ui.formSelector.items.get(firstItemByIndex.getId());

  // Get the first form item by using a delegate function.
  // When using a delegate function, the return value is an array,
  // so assign firstItemByDelegateFunction to the first item in the resulting array.
  var firstItemByDelegateFunction = Xrm.Page.ui.formSelector.items.get(function (item, index) {
   return index == 0;
  })[0];

  if (allItems[0] == firstItemByIndex &&
            firstItemByIndex == firstItemByName &&
            firstItemByName == firstItemByDelegateFunction) {
   alert("The first form navigation item has the label '" + firstItemByName.getLabel() + "'.");
  }
  else {
   alert("An error has occurred:\n\nUnable to determine the label of the first form navigation item.");
  }
 }
 else {
  alert("There is only one form item currently available.");
 }
};
 // </snippetXrmPageScriptsFormSelectorSamples.getFirstFormItem>

 // Xrm.Page.ui.formSelector.items.getLength() example
// Example: The SDK.FormSelectorSamples.showFormItemsCount function displays the count of the form items.
 // <snippetXrmPageScriptsFormSelectorSamples.showFormItemsCount>
SDK.FormSelectorSamples.showFormItemsCount = function () {
 var items = Xrm.Page.ui.formSelector.items.get();
 var count = Xrm.Page.ui.formSelector.items.getLength();

 if (items.length == count) {
  alert("There are " + count + " form item(s) available.");
 }
 else {
  alert("An error has occurred:\n\nUnable to determine how many form items are available.");
 }
};
 // </snippetXrmPageScriptsFormSelectorSamples.showFormItemsCount>

 // Xrm.Page.ui.formSelector.getCurrentItem() example
// Example: The SDK.FormSelectorSamples.getCurrentItemName function gets the current form item, and displays its name to the user.
 // <snippetXrmPageScriptsFormSelectorSamples.getCurrentItemName>
SDK.FormSelectorSamples.getCurrentItemName = function () {
 var item = Xrm.Page.ui.formSelector.getCurrentItem();
 if (item == null) {
  alert("Only one form is available.\n The Xrm.Page.ui.formSelector.getCurrentItem method will return null when only one form is available.");
 }
 else {
  alert("The current form item's name is '" + item.getLabel() + "'.");
 }

};
 // </snippetXrmPageScriptsFormSelectorSamples.getCurrentItemName>
 //End of FormSelector Samples Functions

// </snippetXrmPageScriptsFormSelectorSamples>