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
Xrm.Page.ui.tabs.forEach
Xrm.Page.ui.tabs.get
Xrm.Page.ui.tabs.getLength

*/
// <snippetXrmPageScriptsTabCollectionSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.TabCollectionSamples = {};

 // Examples:The following two examples perform the same task. 
 // Both examples display a message showing the tabs that contain the letter 'a' in their label.

 // Xrm.Page.ui.tabs.forEach() example 1
 // This example uses an anonymous function defined within the argument.
 // <snippetXrmPageScriptsTabCollectionSamples.listTabs>
SDK.TabCollectionSamples.listTabs = function () {
 var message = "The following tabs contains the letter 'a' in their label:\n";

 Xrm.Page.ui.tabs.forEach(function (tab, index) {
  var tabLabel = tab.getLabel();

  if (tabLabel.toLowerCase().indexOf('a') != -1) {
   message += "  \u2219 " + tabLabel + "\n";
  }
 });

 alert(message);
};
 // </snippetXrmPageScriptsTabCollectionSamples.listTabs>

 // Xrm.Page.ui.tabs.forEach() example 2
 // This example passes a reference to a function defined outside the argument.
 // <snippetXrmPageScriptsTabCollectionSamples.listTabs_Example2>
SDK.TabCollectionSamples.listTabs_Example2 = function () {
 window.message = "The following tabs contains the letter 'a' in their label:\n";

 Xrm.Page.ui.tabs.forEach(SDK.TabCollectionSamples.addTabToMessage);

 alert(window.message);
 window.message = null;
};

SDK.TabCollectionSamples.addTabToMessage = function (tab, index) {
 var tabLabel = tab.getLabel();

 if (tabLabel.toLowerCase().indexOf('a') != -1) {
  window.message += "  \u2219 " + tabLabel + "\n";
 }
};
 // </snippetXrmPageScriptsTabCollectionSamples.listTabs_Example2>

 // Xrm.Page.ui.tabs.get() example
 // Xrm.Page.ui.tabs.get(number) example
// Example: The SDK.TabCollectionSamples.getFirstTab function gets the first tab by using two different overloads of the get() method, 
 // and compares them to ensure they are the same.
 // <snippetXrmPageScriptsTabCollectionSamples.getFirstTab>
SDK.TabCollectionSamples.getFirstTab = function () {
 var allTabs = Xrm.Page.ui.tabs.get();
 var firstTabByIndex = Xrm.Page.ui.tabs.get(0);

 if (allTabs[0] == firstTabByIndex) {
  alert("The first tab has the label '" + firstTabByIndex.getLabel() + "'.");
 }
 else {
  alert("An error has occurred:\n\nUnable to determine the label of the first tab.");
 }
};
 // </snippetXrmPageScriptsTabCollectionSamples.getFirstTab>

 // Xrm.Page.ui.tabs.get(string) example
// Example: The SDK.TabCollectionSamples.doesTabExist function alerts the user if there is a tab on the form with the name of the value passed in.
 // <snippetXrmPageScriptsTabCollectionSamples.doesTabExist>
SDK.TabCollectionSamples.doesTabExist = function (tabName) {
 var tab = Xrm.Page.ui.tabs.get(tabName);
 if (tab != null) {
  alert("The tab with the name '" + tabName + "' does exist on the form.  It has a label of '" + tab.getLabel() + "'.");
 }
 else {
  alert("No tab with the name '" + tabName + "' exists on the form.");
 }
};
 // </snippetXrmPageScriptsTabCollectionSamples.doesTabExist>

 // Xrm.Page.ui.tabs.get(function(tab, index)) example
 // Xrm.Page.ui.tabs.getLength() example
// The SDK.TabCollectionSamples.getFirstAndLastTab function displays the label of the first and last tab on the form.
 // <snippetXrmPageScriptsTabCollectionSamples.getFirstAndLastTab>
SDK.TabCollectionSamples.getFirstAndLastTab = function () {
 var tabsLength = Xrm.Page.ui.tabs.getLength();

 var message = "The first and last tab on the form are:\n";
 var firstAndLastTab = Xrm.Page.ui.tabs.get(function (tab, index) {
  return index == 0 || index == tabsLength - 1;
 });

 for (var i in firstAndLastTab) {
  message += "- " + firstAndLastTab[i].getLabel() + "\n";
 }

 alert(message);
};
 // </snippetXrmPageScriptsTabCollectionSamples.getFirstAndLastTab>
 //End of TabCollection Samples Functions

// </snippetXrmPageScriptsTabCollectionSamples>