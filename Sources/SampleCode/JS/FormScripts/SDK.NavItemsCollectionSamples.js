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
Xrm.Page.ui.navigation.items.forEach 
Xrm.Page.ui.navigation.items.get 
Xrm.Page.ui.navigation.items.getLength 
*/
// <snippetXrmPageScriptsNavItemsCollectionSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.NavItemsCollectionSamples = {};

 // Examples:The following two examples perform the same task. 
 // Both examples display a message showing the navigation items that contain the letter 'a' in their label.

 // Xrm.Page.ui.navigation.items.forEach() example 1
 // This example uses an anonymous function defined within the argument.
 // <snippetXrmPageScriptsNavItemsCollectionSamples.listNavItems>
SDK.NavItemsCollectionSamples.listNavItems = function () {
 var message = "The following navigation items contains the letter 'a' in their label:\n";

 Xrm.Page.ui.navigation.items.forEach(function (item, index) {
  var itemLabel = item.getLabel();

  if (itemLabel.toLowerCase().indexOf('a') != -1) {
   message += "  \u2219 " + itemLabel + "\n";
  }
 });

 alert(message);
};
 // </snippetXrmPageScriptsNavItemsCollectionSamples.listNavItems>

 // Xrm.Page.ui.navigation.items.forEach() example 2
 // This example passes a reference to a function defined outside the argument.
 // <snippetXrmPageScriptsNavItemsCollectionSamples.listNavItems_Example2>
SDK.NavItemsCollectionSamples.listNavItems_Example2 = function () {
 window.message = "The following navigation items contains the letter 'a' in their label:\n";

 Xrm.Page.ui.navigation.items.forEach(SDK.NavItemsCollectionSamples.addNavItemToMessage);

 alert(window.message);
 window.message = null;
};

SDK.NavItemsCollectionSamples.addNavItemToMessage = function (item, index) {
 var itemLabel = item.getLabel();

 if (itemLabel.toLowerCase().indexOf('a') != -1) {
  window.message += "  \u2219 " + itemLabel + "\n";
 }
};
 // </snippetXrmPageScriptsNavItemsCollectionSamples.listNavItems_Example2>

 // Xrm.Page.ui.navigation.items.get() example
// Example: The SDK.NavItemsCollectionSamples.listNavItemsWithTheLetterS function displays a message showing the navigation items that contain the letter 's' in their label.
 // <snippetXrmPageScriptsNavItemsCollectionSamples.listNavItemsWithTheLetterS>
SDK.NavItemsCollectionSamples.listNavItemsWithTheLetterS = function () {
 var message = "The following navigation items contains the letter 's' in their label:\n";
 var items = Xrm.Page.ui.navigation.items.get();

 for (var i in items) {
  var item = items[i];
  var itemLabel = item.getLabel();
  if (itemLabel.toLowerCase().indexOf('s') != -1) {
   message += "  \u2219 " + itemLabel + "\n";
  }
 }

 alert(message);
};
 // </snippetXrmPageScriptsNavItemsCollectionSamples.listNavItemsWithTheLetterS>

 // Xrm.Page.ui.navigation.items.get(number) example
// Example: The SDK.NavItemsCollectionSamples.listFirstActivityItem function displays the first navigation item's label.
 // <snippetXrmPageScriptsNavItemsCollectionSamples.listFirstActivityItem>
SDK.NavItemsCollectionSamples.listFirstActivityItem = function () {
 var firstItem = Xrm.Page.ui.navigation.items.get(0);
 if (firstItem != null) {
  alert("The first navigation item is '" + firstItem.getLabel() + "'.");
 }
 else {
  alert("There are not currently any navigation items on the form.");
 }
};
 // </snippetXrmPageScriptsNavItemsCollectionSamples.listFirstActivityItem>

 // Xrm.Page.ui.navigation.items.get(string) example
// Example: The SDK.NavItemsCollectionSamples.doesActivityItemExist function displays a message stating if there is a navigation item with an id of 'navActivities'.
 // <snippetXrmPageScriptsNavItemsCollectionSamples.doesActivityItemExist>
SDK.NavItemsCollectionSamples.doesActivityItemExist = function () {
 var activityItem = Xrm.Page.ui.navigation.items.get("navActivities");
 if (activityItem != null) {
  alert("The '" + activityItem.getLabel() + "' item does exist in this form's navigation area.");
 }
 else {
  alert("The 'Activities' item does not exist in this form's navigation area.");
 }
};
 // </snippetXrmPageScriptsNavItemsCollectionSamples.doesActivityItemExist>

 // Xrm.Page.ui.navigation.items.get(function(item, index)) example
// Example: The SDK.NavItemsCollectionSamples.listEveryOtherNavItem function displays a message listing every other navigation item.
 // <snippetXrmPageScriptsNavItemsCollectionSamples.listEveryOtherNavItem>
SDK.NavItemsCollectionSamples.listEveryOtherNavItem = function () {
 var message = "The following list is the label of every other navigation item on the form:\n";
 var items = Xrm.Page.ui.navigation.items.get(function (item, index) {
  return index % 2 == 0;
 });

 for (var i in items) {
  message += "  \u2219 " + items[i].getLabel() + "\n";
 }

 alert(message);
};
 // </snippetXrmPageScriptsNavItemsCollectionSamples.listEveryOtherNavItem>

 // Xrm.Page.ui.navigation.items.getLength() example
// Example: The SDK.NavItemsCollectionSamples.showNavItemsCount function displays the count of the navigation items on the form.
 // <snippetXrmPageScriptsNavItemsCollectionSamples.showNavItemsCount>
SDK.NavItemsCollectionSamples.showNavItemsCount = function () {
 var items = Xrm.Page.ui.navigation.items.get();
 var count = Xrm.Page.ui.navigation.items.getLength();

 if (items.length == count) {
  alert("There are " + count + " navigation item(s) on the form.");
 }
 else {
  alert("An error has occurred:\n\nUnable to determine how many navigation items are on the form.");
 }
};
 // </snippetXrmPageScriptsNavItemsCollectionSamples.showNavItemsCount>
 //End of NavigationItemsCollection Samples Functions

// </snippetXrmPageScriptsNavItemsCollectionSamples>