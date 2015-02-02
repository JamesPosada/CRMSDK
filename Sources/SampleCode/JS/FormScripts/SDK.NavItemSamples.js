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
item.getId 
item.getLabel
item.getVisible
item.setFocus
item.setLabel 
item.setVisible
*/
// <snippetXrmPageScriptsNavItemSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.NavItemSamples = {};

 // item.getId() example
 // item.getLabel() example
 // item.getVisible() example
// Example: The SDK.NavItemSamples.showNavigationItemInfo function displays the label, id, and the visibility for every navigation item in a new window
 // <snippetXrmPageScriptsNavItemSamples.showNavigationItemInfo>
SDK.NavItemSamples.showNavigationItemInfo = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Navigation Items Info</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "</head><body>";
 html += SDK.NavItemSamples.buildNavigationInfoTable();
 html += "</body></html>";
 var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
 myWindow.document.open();
 myWindow.document.write(html);
 myWindow.document.close();
};

SDK.NavItemSamples.buildNavigationInfoTable = function () {
 var html = "<table summary='This table displays a list of each navigation item in the page.'><thead><tr><th scope='col'>Item Name</th><th scope='col'>Item Id</th><th scope='col'>Is Visible</th></tr></thead><tbody>";
 var items = Xrm.Page.ui.navigation.items.get();

 for (var i in items) {
  var item = items[i];

  html += "<tr><td>" + item.getLabel() + "</td>" +
        "<td>" + item.getId() + "</td>" +
        "<td>" + item.getVisible() + "</td>";
 }
 html += "</tbody></table>";
 return html;
};
 // </snippetXrmPageScriptsNavItemSamples.showNavigationItemInfo>

 // item.setFocus() example
// Example: The SDK.NavItemSamples.setFocusDemo function will open a new page containing a table with rows for each visible navigation item.
 // Each row contains a button that will use the window.opener to access the Xrm.Page object to call the setFocus method 
 // for the navigation item in the entity record form.
 // <snippetXrmPageScriptsNavItemSamples.setFocusDemo>
SDK.NavItemSamples.setFocusDemo = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Set focus demo</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "<script type=\"text/javascript\" >";
 html += "function setFocus(id) { ";
 html += "\n\r";
 html += "window.opener.Xrm.Page.ui.navigation.items.get(id).setFocus();";
 html += "\n\r";
 html += "}";
 html += "</script>";
 html += "</head><body>";
 html += SDK.NavItemSamples.buildFocusTable();
 html += "</body></html>";
 var theWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
 theWindow.document.open();
 theWindow.document.write(html);
 theWindow.document.close();
};

SDK.NavItemSamples.buildFocusTable = function () {
 var html = "<table summary='This table displays a list of each navigable navigation item and a button to call setFocus on the item.'><thead><tr><th scope='col'>Item Label</th><th scope='col'>Set Focus</th>" +
    "</tr></thead><tbody>";
 var items = Xrm.Page.ui.navigation.items.get();

 for (var i in items) {
  var item = items[i];
  //setFocus will cause an error if used on an item that is not visible.
  if (item.getVisible()) {
   var itemLabel = item.getLabel();
   var itemId = item.getId();

   html += "<tr><td>" + itemLabel +
         "</td><td><input type=\"button\" onclick=\"setFocus('" + itemId +
          "');\" value='Set Focus on " + itemLabel + "' /></td></tr>";
  }
 }
 html += "</tbody></table>";
 return html;
};
 // </snippetXrmPageScriptsNavItemSamples.setFocusDemo>

 // item.setLabel() example
// Example: The SDK.NavItemSamples.toggleItemLabels function will show or hide a specified prefix for all navigation items on the form.
 // <snippetXrmPageScriptsNavItemSamples.toggleItemLabels>
SDK.NavItemSamples.toggleItemLabels = function (prefix) {
 var items = Xrm.Page.ui.navigation.items.get();

 for (var i in items) {
  var item = items[i];
  var currentLabel = item.getLabel();
  if (currentLabel.substring(0, prefix.length) == prefix) {
   var newLabel = currentLabel.substring(prefix.length);
   item.setLabel(newLabel);
  }
  else {
   item.setLabel(prefix + currentLabel);
  }
 }
};
 // </snippetXrmPageScriptsNavItemSamples.toggleItemLabels>

 // item.setVisible() example
// Example: The SDK.NavItemSamples.toggleVisibleItems function hides or reveals all navigationitems on the form each time the event occurs.
 // <snippetXrmPageScriptsNavItemSamples.toggleVisibleItems>
SDK.NavItemSamples.toggleVisibleItems = function () {
 var items = Xrm.Page.ui.navigation.items.get();

 for (var i in items) {
  var item = items[i];
  if (item.getVisible()) {
   item.setVisible(false);
  }
  else {
   item.setVisible(true);
  }
 }
};
 // </snippetXrmPageScriptsNavItemSamples.toggleVisibleItems>
 //End of NavItem Samples Functions

// </snippetXrmPageScriptsNavItemSamples>