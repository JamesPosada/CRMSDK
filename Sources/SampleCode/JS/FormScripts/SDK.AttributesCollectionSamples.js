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
Xrm.Page.data.entity.attributes.forEach 
Xrm.Page.data.entity.attributes.get 
Xrm.Page.data.entity.attributes.getLength 
*/
// <snippetXrmPageScriptsAttributesCollectionSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.AttributesCollectionSamples = {};

 // Examples:The following two examples perform the same task. 
 // Both examples display a message showing the required fields in the form.

 // Xrm.Page.data.entity.attributes.forEach() example
 // This example uses an anonymous function defined within the argument.
 // <snippetXrmPageScriptsAttributesCollectionSamples.listRequiredFields>
SDK.AttributesCollectionSamples.listRequiredFields = function () {
 var message = "The following fields are required:\n";

 Xrm.Page.data.entity.attributes.forEach(function (attribute, index) {
  if (attribute.getRequiredLevel() == "required") {
   message += "  \u2219 " + attribute.getName() + "\n";
  }
 });

 alert(message);
};
 // </snippetXrmPageScriptsAttributesCollectionSamples.listRequiredFields>
 // Xrm.Page.data.entity.attributes.forEach() example 2
 // This example passes a reference to a function defined outside the argument.
 // <snippetXrmPageScriptsAttributesCollectionSamples.listRequiredFields_Example2>
SDK.AttributesCollectionSamples.listRequiredFields_Example2 = function () {
 window.message = "The following fields are required:\n";
 Xrm.Page.data.entity.attributes.forEach(SDK.AttributesCollectionSamples.addRequiredFieldToMessage);
 alert(window.message);
 window.message = null;
};

SDK.AttributesCollectionSamples.addRequiredFieldToMessage = function (attribute, index) {
 if (attribute.getRequiredLevel() == "required") {
  window.message += "  \u2219 " + attribute.getName() + "\n";
 }
};
 // </snippetXrmPageScriptsAttributesCollectionSamples.listRequiredFields_Example2>
 // Xrm.Page.data.entity.attributes.forEach() example 3
 // This example opens a new window to display information about each attribute. 
 // It uses the forEach method to iterate through each attribute.
 // <snippetXrmPageScriptsAttributesCollectionSamples.showFields>
SDK.AttributesCollectionSamples.showFields = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>List Fields</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "</head><body>";
 html += SDK.AttributesCollectionSamples.listFields();
 html += "</body></html>";

 var myWindow = window.open("", "_blank", "height=400,width=450,scrollbars=1,resizable=1", false);
 myWindow.document.open();
 myWindow.document.write(html);
 myWindow.document.close();
};

SDK.AttributesCollectionSamples.listFields = function () {
 var html = "<table summary='This table displays information about attributes on the page. '><thead><tr><th scope='col'>Index</th><th scope='col'>Name</th><th scope='col'>Type</th><th scope='col'>Format</th></tr></thead><tbody>";
 Xrm.Page.data.entity.attributes.forEach(function (attribute, index) {
  html += "<tr><td>" + index +
         "</td><td>" + attribute.getName() +
         "</td><td>" + attribute.getAttributeType() +
         "</td><td>" + attribute.getFormat() +
         "</td></tr>";
 });

 html += "</tbody></table>";
 return html;
};
 // </snippetXrmPageScriptsAttributesCollectionSamples.showFields>
 // Xrm.Page.data.entity.attributes.get() example
 // Xrm.Page.data.entity.attributes.get(string) example
 // Xrm.Page.data.entity.attributes.get(number) example
 // Xrm.Page.data.entity.attributes.getLength example
// Example: The SDK.AttributesCollectionSamples.showFirstAndLastAttributeInfo function will show the user the name of the first and last attribute 
 // on the form, along with the total number of attributes on the form.
 // <snippetXrmPageScriptsAttributesCollectionSamples.showFirstAndLastAttributeInfo>
SDK.AttributesCollectionSamples.showFirstAndLastAttributeInfo = function () {
 var allAttributes = Xrm.Page.data.entity.attributes.get();
 var attributesLength = Xrm.Page.data.entity.attributes.getLength();

 var firstAttributeByName = Xrm.Page.data.entity.attributes.get(allAttributes[0].getName());
 var lastAttributeByIndex = Xrm.Page.data.entity.attributes.get(attributesLength - 1);

 var message = "The first attribute on the form is '" + firstAttributeByName.getName() + "'.\n";
 message += "The last attribute on the form is '" + lastAttributeByIndex.getName() + "'.\n";
 message += "There are a total of " + attributesLength + " attributes on the form.";

 alert(message);
};
 // </snippetXrmPageScriptsAttributesCollectionSamples.showFirstAndLastAttributeInfo>
 // Xrm.Page.data.entity.attributes.get(function(attribute, index)) example 4
// Example: The SDK.AttributesCollectionSamples.showOptionSets function opens a new window to display information about OptionSet attributes.  
 // It uses the get method with a delegate function called isOptionSet to filter the attributes so that only attributes of 
 // type optionset are returned.
 // <snippetXrmPageScriptsAttributesCollectionSamples.showOptionSets>
SDK.AttributesCollectionSamples.showOptionSets = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>List OptionSets</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "</head><body>";
 html += SDK.AttributesCollectionSamples.getOptionSetFields();
 html += "</body></html>";
 var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
 myWindow.document.open();
 myWindow.document.write(html);
 myWindow.document.close();
};

SDK.AttributesCollectionSamples.getOptionSetFields = function () {
 var html = "<table summary='This table displays the name of optionset attributes on the page.'><thead><tr><th scope='col'>Name</th></tr></thead><tbody>";
 var optionSets = Xrm.Page.data.entity.attributes.get(SDK.AttributesCollectionSamples.isOptionSet)
 for (var i in optionSets) {
  html += "<tr><td>" + optionSets[i].getName() + "</td></tr>";
 }
 html += "</tbody></table>";
 return html;
};

SDK.AttributesCollectionSamples.isOptionSet = function (attribute, index) {
 return attribute.getAttributeType() == "optionset";
};
 // </snippetXrmPageScriptsAttributesCollectionSamples.showOptionSets>
 //End of Attributes Samples Functions

// </snippetXrmPageScriptsAttributesCollectionSamples>
