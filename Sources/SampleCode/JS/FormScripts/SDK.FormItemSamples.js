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
formitem.getId 
formitem.getLabel
formitem.navigate
*/
// <snippetXrmPageScriptsFormItemSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.FormItemSamples = {};

	// formitem.getId() example
	// formitem.getLabel() example
// Example: The SDK.FormItemSamples.getFormInformation function displays the current form item's id and label to the user
	// <snippetXrmPageScriptsFormItemSamples.getFormInformation>
SDK.FormItemSamples.getFormInformation = function () {
 var item = Xrm.Page.ui.formSelector.getCurrentItem();
 if (item != null) {
  var itemId = item.getId();
  var itemLabel = item.getLabel();

  alert("The current form item has the following properties:\n\n" +
        "  \u2219 Label: '" + itemLabel + "'\n  \u2219 Id: '" + itemId + "'");
 }
 else {
  alert("The getFormInformation function only applies to forms with multiple form items.");
 }
};
	// </snippetXrmPageScriptsFormItemSamples.getFormInformation>

	// formitem.navigate() example
// Example: The SDK.FormItemSamples.showFormItems function displays a page in a new window showing the form items with a button to navigate to the form item.
	// <snippetXrmPageScriptsFormItemSamples.showFormItems>
SDK.FormItemSamples.showFormItems = function () {
 var items = Xrm.Page.ui.formSelector.items.get();
 if (items.length > 1) {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show Form Items</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "<script type=\"text/javascript\" >";
  html += "function navigate(itemId) { ";
  html += "window.opener.Xrm.Page.ui.formSelector.items.get(itemId).navigate(); ";
  html += "window.close();";
  html += "}";
  html += "</script></head><body>";
  html += SDK.FormItemSamples.getFormItems();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 }
 else {
  alert("There is only one form item currently available.");
 }
};

SDK.FormItemSamples.getFormItems = function () {
 var html = "<table summary='This table displays a row for each form item containing a button to navigate to that form.'><thead><tr><th scope='col'>Form Item Label</th><th></th>" +
    "</tr></thead><tbody>";
 var items = Xrm.Page.ui.formSelector.items.get();
 var currentFormId = Xrm.Page.ui.formSelector.getCurrentItem().getId();
 for (var i in items) {
  var item = items[i];
  var itemId = item.getId();
  if (itemId != currentFormId) {
   var itemLabel = item.getLabel();
   html += "<tr><td>" + itemLabel +
            "</td><td><input type=\"button\" onclick=\"navigate('" + itemId +
            "');\" value='Navigate to " + itemLabel + "' /></td></tr>";
  }

 }

 html += "</tbody></table>";
 return html;
};
	// </snippetXrmPageScriptsFormItemSamples.showFormItems>
	//End of FormItem Samples Functions

// </snippetXrmPageScriptsFormItemSamples>