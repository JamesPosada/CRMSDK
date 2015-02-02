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
attribute.fireOnChange 
attribute.getAttributeType 
attribute.getFormat 
attribute.getIsDirty
attribute.getMax 
attribute.getMaxLength 
attribute.getMin 
attribute.getName 
attribute.getOption 
attribute.getOptions
attribute.getParent
attribute.getPrecision 
attribute.getRequiredLevel
attribute.getSelectedOption
attribute.getSubmitMode 
attribute.getText 
attribute.getUserPrivilege
attribute.getValue 
attribute.setRequiredLevel
attribute.setSubmitMode 
attribute.setValue
*/
// <snippetXrmPageScriptsAttributeSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }

// Create Namespace container for functions in this library;
SDK.AttributeSamples = {};

 // attribute.fireOnChange example
 // attribute.addOnChange example
 // attribute.removeOnChange example
 // Example: Add a function to the OnChange event of an attribute
 // Fire the event using fireOnChange
 // Remove the event handler
 // <snippetXrmPageScriptsAttributeSamples.fireOnChangeDemo>
 SDK.AttributeSamples.fireOnChangeDemo = function () {
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isLookup);

  for (var i in attributes) {
   var attribute = attributes[i];
   var tempFunc = function () {
    SDK.AttributeSamples.attributeChanged(attribute);
   };
   attribute.addOnChange(tempFunc);
   attribute.fireOnChange();
   attribute.removeOnChange(tempFunc);

  }
 };

 SDK.AttributeSamples.isLookup = function (attribute, index) {
  return attribute.getAttributeType() == "lookup";
 };
 SDK.AttributeSamples.attributeChanged = function (attribute) {
  alert("Change event occured on " + attribute.getName());
 };

 // </snippetXrmPageScriptsAttributeSamples.fireOnChangeDemo>

 // attribute.getAttributeType() example
 // Example: The SDK.AttributeSamples.showAttributeTypes function will display a page in a new window showing the attribute type 
 // values for each attribute on the page.
 // <snippetXrmPageScriptsAttributeSamples.showAttributeTypes>
 SDK.AttributeSamples.showAttributeTypes = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show Attribute Types</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getAttributeTypes();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getAttributeTypes = function () {
  var html = "<table summary='This table displays the type of each attribute.'><thead><tr><th scope='col'>Attribute Name</th><th scope='col'>Attribute Type</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get();
  for (var i in attributes) {
   var attribute = attributes[i];

   html += "<tr><td>" + attribute.getName() + "</td><td>" +
        attribute.getAttributeType() + "</td></tr>";
  }
  html += "</tbody></table>";
  return html;
 };
 // </snippetXrmPageScriptsAttributeSamples.showAttributeTypes>

 // attribute.getInitialValue() example
 // Example: The SDK.AttributeSamples.showInitialValue function will display a page in a new window showing the inital values (if any) 
 // for all Boolean or optionset attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showInitalValue>
 SDK.AttributeSamples.showInitialValue = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>OptionSet and Boolean Default Values</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getBooleanAndOptionSetAttributes();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getBooleanAndOptionSetAttributes = function () {
  var fields = "<table summary='This table displays the initial values for boolean and optionset attributes.'><thead><tr><th scope='col'>Name</th><th scope='col'>Initial Value</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isBooleanOrOptionSet);
  for (var i in attributes) {
   var attribute = attributes[i];

   fields += "<tr><td>" + attribute.getName() + "</td><td>" + attribute.getInitialValue() + "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };

 SDK.AttributeSamples.isBooleanOrOptionSet = function (attribute, index) {
  var result = false;
  var type = attribute.getAttributeType();
  if (type == "boolean" || type == "optionset")
  { result = true; }

  return result;

 };
 // </snippetXrmPageScriptsAttributeSamples.showInitalValue>

 // attribute.getFormat() example
 // Example: The SDK.AttributeSamples.showFormatValues function will display a page in a new window showing the format values for attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showFormatValues>
 SDK.AttributeSamples.showFormatValues = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show Format</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getFormatValues();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=400,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getFormatValues = function () {
  var html = "<table summary='This table displays the format values for attributes on the page.'><thead><tr><th scope='col'>Attribute Name</th><th scope='col'>Attribute Type</th><th scope='col'>Format</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get();
  for (var i in attributes) {
   var attribute = attributes[i];

   html += "<tr><td>" + attribute.getName() +
         "</td><td>" + attribute.getAttributeType() +
         "</td><td>" + attribute.getFormat() +
          "</td></tr>";
  }
  html += "</tbody></table>";
  return html;
 };
 // </snippetXrmPageScriptsAttributeSamples.showFormatValues>

 // attribute.getIsDirty() example
 // Example: The SDK.AttributeSamples.showIsDirty function will display a page in a new window showing the IsDirty values for attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showIsDirty>
 SDK.AttributeSamples.showIsDirty = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show IsDirty</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getIsDirty();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getIsDirty = function () {
  var html = "<table summary='This table displays the isDirty values for attributes on the page.'><thead><tr><th scope='col'>Attribute Name</th><th scope='col'>IsDirty</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get()
  for (var i in attributes) {
   var attribute = attributes[i];

   html += "<tr><td>" + attribute.getName() +
         "</td><td>" + attribute.getIsDirty() +
          "</td></tr>";
  }
  html += "</tbody></table>";
  return html;
 };
 // </snippetXrmPageScriptsAttributeSamples.showIsDirty>

 // attribute.getMax() example
 // attribute.getMin() example
 // Example: The SDK.AttributeSamples.showNumberFieldValueRanges function will display a page in a new window showing the maximum and 
 // minimum values for number attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showNumberFieldValueRanges>
 SDK.AttributeSamples.showNumberFieldValueRanges = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Maximum and Minimum Values</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getNumberFieldValueRanges();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getNumberFieldValueRanges = function () {
  var fields = "<table summary='This table displays the maximum and minimum values for number attributes on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>Max Value</th><th scope='col'>Min Value</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isNumberField);
  for (var i in attributes) {
   var attribute = attributes[i];

   fields += "<tr><td>" + attribute.getName() +
         "</td><td>" + attribute.getMax() +
          "</td><td>" + attribute.getMin() +
          "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };

 SDK.AttributeSamples.isNumberField = function (o, i) {
  return o.getAttributeType() == "money" ||
    o.getAttributeType() == "decimal" ||
    o.getAttributeType() == "integer" ||
    o.getAttributeType() == "double";
 };
 // </snippetXrmPageScriptsAttributeSamples.showNumberFieldValueRanges>

 // attribute.getMaxLength() example
 // Example: The SDK.AttributeSamples.showMaxLengths function will display a page in a new window showing the maximum length values for string 
 // or memo attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showMaxLengths>
 SDK.AttributeSamples.showMaxLengths = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show Maximum Length Values</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getMaximumLength();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=400,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getMaximumLength = function () {
  var fields = "<table summary='This table displays the maximumn length values for string or memo attributes on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>Max Length</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isStringField);
  for (var i in attributes) {
   var attribute = attributes[i];

   fields += "<tr><td>" + attribute.getName() +
         "</td><td>" + attribute.getMaxLength() +
          "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };

 SDK.AttributeSamples.isStringField = function (attribute, index) {
  return attribute.getAttributeType() == "string" ||
    attribute.getAttributeType() == "memo";
 };
 // </snippetXrmPageScriptsAttributeSamples.showMaxLengths>



 // attribute.getName() example
 // Example: The SDK.AttributeSamples.showNames functon will display a page in a new window showing the names of attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showNames>
 SDK.AttributeSamples.showNames = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show Attribute Name</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getNames();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getNames = function () {
  var fields = "<table summary='This table displays the names of attributes on the page.'><thead><tr><th scope='col'>Name</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get();
  for (var i in attributes) {
   fields += "<tr><td>" + attributes[i].getName() + "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };
 // </snippetXrmPageScriptsAttributeSamples.showNames>

 // attribute.getOption() example
 // Example: The SDK.AttributeSamples.showAttributeSelectedOption function will display a page in a new window showing the details of the selected option. 
 // The options are displayed using JSON style syntax.
 // <snippetXrmPageScriptsAttributeSamples.showAttributeSelectedOption>
 SDK.AttributeSamples.showAttributeSelectedOption = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>getOption</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getSelectedOption();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false); ;
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getSelectedOption = function () {
  var fields = "<table summary='This table displays the selected options for optionset values on the page. Options are shown in JSON format.'><thead><tr><th scope='col'>Name</th><th scope='col'>Selected JSON option</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isOptionSet);
  for (var i in attributes) {
   var attribute = attributes[i];
   var attributeValue = attribute.getValue();


   fields += "<tr><td>" + attribute.getName() + "</td><td>";
   //        SDK.AttributeSamples.showJSONOption(attribute) 
   if (attributeValue != null) {
    var option = attribute.getOption(attributeValue);
    fields += "&nbsp;{";
    fields += " text:\"" + option.text + "\" , value:\"" + option.value + "\"";
    fields += "&nbsp;}";
   }
   else
   { fields += "No selected value"; }

   fields += "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };

 SDK.AttributeSamples.isOptionSet = function (attribute, index) {
  return attribute.getAttributeType() == "optionset";
 };

 // </snippetXrmPageScriptsAttributeSamples.showAttributeSelectedOption>

 // attribute.getOptions() example
 // Example: The SDK.AttributeSamples.showOptions function will display a page in a new window showing the available options for optionset 
 // attributes on the page. The option arrays are displayed using JSON style syntax.
 // <snippetXrmPageScriptsAttributeSamples.showOptions>
 SDK.AttributeSamples.showOptions = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>OptionSet Options</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getOptionSets();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=400,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getOptionSets = function () {
  var fields = "<table summary='This table displays the available options for optionset attributes on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>JSON options</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isOptionSet)
  for (var i in attributes) {
   var attribute = attributes[i];

   fields += "<tr><td>" + attribute.getName() + "</td><td>" +
        SDK.AttributeSamples.showJSONOptions(attribute.getOptions()) + "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };

 SDK.AttributeSamples.isOptionSet = function (attribute, index) {
  return attribute.getAttributeType() == "optionset";
 };

 SDK.AttributeSamples.showJSONOptions = function (options) {
  var html = "[<br />";
  for (var i in options) {
   html += "&nbsp;{";
   html += " text:\"" + options[i].text + "\" , value:\"" + options[i].value + "\"";
   html += "&nbsp;}";
   html += (i < options.length - 1) ? ",<br />" : "<br />";
  }
  html += "]";
  return html;
 };
 // </snippetXrmPageScriptsAttributeSamples.showOptions>

 // attribute.getParent() example
 // Example: The SDK.AttributeSamples.getParentDemo function demonstrates how attribute.getParent() returns the Xrm.Page.data.entity object.
 // <snippetXrmPageScriptsAttributeSamples.getParentDemo>
 SDK.AttributeSamples.getParentDemo = function () {
  var firstAttributesParent = Xrm.Page.data.entity.attributes.get(0).getParent();
  var entity = Xrm.Page.data.entity;

  if (firstAttributesParent == entity) {
   alert("The first attribute's parent is the same as the entity object.");
  }
  else {
   alert("The first attribute's parent is not the same as the entity object.");
  }
 };
 // </snippetXrmPageScriptsAttributeSamples.getParentDemo>

 // attribute.getPrecision() example
 // Example: The SDK.AttributeSamples.showPrecisionValues function will display a page in a new window showing the precision values for number 
 // attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showPrecisionValues>
 SDK.AttributeSamples.showPrecisionValues = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Precision Values</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getNumberFieldPrecision();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getNumberFieldPrecision = function () {
  var fields = "<table summary='This table displays the precision values for number attributes on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>Precision</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isNumberField)
  for (var i in attributes) {
   var attribute = attributes[i];

   fields += "<tr><td>" + attribute.getName() +
         "</td><td>" + attribute.getPrecision() +
          "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };

 SDK.AttributeSamples.isNumberField = function (attribute, index) {
  return attribute.getAttributeType() == "money" ||
    attribute.getAttributeType() == "decimal" ||
    attribute.getAttributeType() == "integer" ||
    attribute.getAttributeType() == "double";
 };
 // </snippetXrmPageScriptsAttributeSamples.showPrecisionValues>

 // attribute.getRequiredLevel() example
 // Example: The SDK.AttributeSamples.showRequiredLevel function will display a page in a new window showing the required level values for attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showRequiredLevel>
 SDK.AttributeSamples.showRequiredLevel = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Required Levels </title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getRequiredLevel();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getRequiredLevel = function () {
  var fields = "<table summary='This table displays the requirement level value for attributes on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>Precision</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get()
  for (var i in attributes) {
   var attribute = attributes[i];

   var requiredLevel = attribute.getRequiredLevel();
   if (requiredLevel != "none") {
    fields += "<tr><td>" + attribute.getName() +
                "</td><td>" + requiredLevel +
                "</td></tr>";
   }
  }

  fields += "</tbody></table>";
  return fields;
 };
 // </snippetXrmPageScriptsAttributeSamples.showRequiredLevel>

 // attribute.getSelectedOption() example
 // Example: The SDK.AttributeSamples.showSelectedOption function will display a page in a new window showing the selected option values for 
 // optionset attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showSelectedOption>
 SDK.AttributeSamples.showSelectedOption = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Selected Options</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getSelectedOptions();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getSelectedOptions = function () {
  var fields = "<table summary='This table displays the selected option for optionset attributes on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>Selected JSON option</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isOptionSet);
  for (var i in attributes) {
   var attribute = attributes[i];
   var option = attribute.getSelectedOption();
   fields += "<tr><td>" + attribute.getName() + "</td><td>";
   if (option != null) {
    fields += "&nbsp;{";
    fields += " text:\"" + option.text + "\" , value:\"" + option.value + "\"";
    fields += "&nbsp;}";
   }
   else {
    fields += "This optionset attribute doesn't have a selected value.";
   }

   fields += "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };

 SDK.AttributeSamples.isOptionSet = function (attribute, index) {
  return attribute.getAttributeType() == "optionset";
 };
 // </snippetXrmPageScriptsAttributeSamples.showSelectedOption>

 // attribute.getSubmitMode() example
 // Example: The SDK.AttributeSamples.showSubmitMode function will display a page in a new window showing the SubmitMode values for attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showSubmitMode>
 SDK.AttributeSamples.showSubmitMode = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Submit Mode </title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getSubmitModeValues();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getSubmitModeValues = function () {
  var fields = "<table summary='This table displays the submit mode values for attributes on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>Submit Mode</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get()
  for (var i in attributes) {
   var attribute = attributes[i];

   fields += "<tr><td>" + attribute.getName() +
            "</td><td>" + attribute.getSubmitMode(); +
            "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };
 // </snippetXrmPageScriptsAttributeSamples.showSubmitMode>

 // attribute.getText() example
 // Example: The SDK.AttributeSamples.showSelectedOptionText function will display a page in a new window showing the text for selected option 
 // values for optionset attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showSelectedOptionText>
 SDK.AttributeSamples.showSelectedOptionText = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Selected Option Text</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getSelectedOptionsText();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getSelectedOptionsText = function () {
  var fields = "<table summary='This table displays the text of the selected option in optionset attributes on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>Selected Option Text</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isOptionSet)
  for (var i in attributes) {
   var attribute = attributes[i];

   fields += "<tr><td>" + attribute.getName() + "</td><td>"
   fields += attribute.getText();
   fields += "</td></tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };

 SDK.AttributeSamples.isOptionSet = function (attribute, index) {
  return attribute.getAttributeType() == "optionset";
 };
 // </snippetXrmPageScriptsAttributeSamples.showSelectedOptionText>

 // attribute.getUserPrivilege() example
 // Example: The SDK.AttributeSamples.showUserPrivileges function will display a page in a new window showing the privileges the user has 
 // for each of the attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showUserPrivileges>
 SDK.AttributeSamples.showUserPrivileges = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>User Privilege</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getUserPrivileges();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getUserPrivileges = function () {
  var fields = "<table summary='This table displays the priviletges that the user has for each attribute on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>User Privileges</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get();

  for (var i in attributes) {
   var attribute = attributes[i];

   var privileges = attribute.getUserPrivilege();
   fields += "<tr><td rowspan=3>" + attribute.getName() + "</td>"
   fields += "<td> canRead: " + privileges.canRead + "</td></tr>";
   fields += "<tr><td> canUpdate: " + privileges.canUpdate + "</td></tr>";
   fields += "<tr><td> canCreate: " + privileges.canCreate + "</td></tr>";
   fields += "</tr>";
  }
  fields += "</tbody></table>";
  return fields;
 };
 // </snippetXrmPageScriptsAttributeSamples.showUserPrivileges>

 // attribute.getValue() example
 // Example: The SDK.AttributeSamples.showValues function will display a page in a new window showing the values for each of the attributes on the page.
 // <snippetXrmPageScriptsAttributeSamples.showValues>
 SDK.AttributeSamples.showValues = function () {
  var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Attribute Value</title>";
  html += "<style type=\"text/css\">body { font-family:Calibri;}";
  html += "table {border:1px solid gray; border-collapse:collapse;}";
  html += "th {text-align:left; border:1px solid gray;}";
  html += "td {border:1px solid gray;}</style>";
  html += "</head><body>";
  html += SDK.AttributeSamples.getAttributeValue();
  html += "</body></html>";
  var myWindow = window.open("", "_blank", "height=400,width=450,scrollbars=1,resizable=1", false);
  myWindow.document.open();
  myWindow.document.write(html);
  myWindow.document.close();
 };

 SDK.AttributeSamples.getAttributeValue = function () {
  var fields = "<table summary='This table displays the values for each attribute on the page.'><thead><tr><th scope='col'>Name</th><th scope='col'>Type</th><th scope='col'>Value</th></tr></thead><tbody>";
  var attributes = Xrm.Page.data.entity.attributes.get()

  for (var i in attributes) {
   var attribute = attributes[i];

   var type = attribute.getAttributeType();
   var value = attribute.getValue();
   fields += "<tr><td>" + attribute.getName() + "</td>"
   fields += "<td>" + type + "</td>"
   switch (type) {
    case "boolean":
    case "decimal":
    case "double":
    case "integer":
    case "money":
    case "optionset":
     fields += "<td>" + value + "</td>";
     break;
    case "memo":
    case "string":
     if (value != null)
     { fields += "<td>\"" + value + "\"</td>"; }
     else
     { fields += "<td>" + value + "</td>"; }
     break;
    case "datetime":
     if (value != null) {
      fields += "<td> toString() =\"" + value.toString() + "\"" +
                 "<br /> toLocaleString() =\"" + value.toLocaleString() + "\"" +
                 "<br /> format() =\"" + value.format() + "\"" +
                 "<br /> localeFormat() =\"" + value.localeFormat() + "\"</td>";
     }
     else
     { fields += "<td>" + null + "</td>"; }
     break;
    case "lookup":
     var data = "[";
     if (value != null) {
      for (var i = 0; i < value.length; i++) {
       data += "{<br /> entityType: \"" + value[i].entityType + "\", <br />";
       data += "  id: \"" + value[i].id + "\", <br />";
       data += "  name: \"" + value[i].name + "\" <br />";
       if (i + 1 != value.length)
       { data += "},<br />"; }
       else
       { data += "}"; }
      }
      data += "]";
     }
     else
     { data = value; }

     fields += "<td>" + data + "</td>";
     break;
   }

  }
  fields += "</tbody></table>";
  return fields;
 };
 // </snippetXrmPageScriptsAttributeSamples.showValues>

 // attribute.setRequiredLevel() example
 // Example: The SDK.AttributeSamples.makeOptionSetsRequired function will make all optionset attributes on the page required.
 // <snippetXrmPageScriptsAttributeSamples.makeOptionSetsRequired>
 SDK.AttributeSamples.makeOptionSetsRequired = function () {
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isOptionSet);
  for (var i in attributes) {
   attributes[i].setRequiredLevel("required");
  }
 };

 SDK.AttributeSamples.isOptionSet = function (attribute, index) {
  return attribute.getAttributeType() == "optionset";
 };
 // </snippetXrmPageScriptsAttributeSamples.makeOptionSetsRequired>

 // attribute.setSubmitMode() example
 // Example: The SDK.AttributeSamples.submitAllOptionsetData function will force all optionset attributes to be submitted. 
 // This is confirmed by checking getDataXml and displaying the result in an alert.
 // <snippetXrmPageScriptsAttributeSamples.submitAllOptionsetData>
 SDK.AttributeSamples.submitAllOptionsetData = function () {
  var attributes = Xrm.Page.data.entity.attributes.get(SDK.AttributeSamples.isOptionSet);
  for (var i in attributes) {
   attributes[i].setSubmitMode("always");
  }

  alert(Xrm.Page.data.entity.getDataXml());
 };
 // </snippetXrmPageScriptsAttributeSamples.submitAllOptionsetData>

 // attribute.setValue() example
 // Example: The SDK.AttributeSamples.setAttributeValues function will attempt to set each attribute value on the form with a valid value.
 // <snippetXrmPageScriptsAttributeSamples.setAttributeValues>
 SDK.AttributeSamples.setAttributeValues = function () {
  var attributes = Xrm.Page.data.entity.attributes.get();
  for (var i in attributes) {
   var attribute = attributes[i];

   //Do not update attributes for hidden controls
   if (!SDK.AttributeSamples.isAttributeControlHidden(attribute)) {

    var type = attribute.getAttributeType();
    var oAttribute = attribute;
    switch (type) {
     case "boolean":
      //Set all Boolean attributes to 'true';
      oAttribute.setValue(true);
      break;
     case "datetime":
      //Set all datetime attributes to 5 days in the future
      var today = new Date();
      var futureDate = new Date(today.setDate(today.getDate() + 5));
      oAttribute.setValue(futureDate);
      break;
     case "decimal":
     case "money":
     case "double":
     case "integer":
      //Set all number attributes to their maximum precision just less than 10.
      var preciseNumber;
      var precision = oAttribute.getPrecision();
      switch (precision) {
       case 0:
        preciseNumber = 10;
        break;
       case 1:
        preciseNumber = 9.9;
        break;
       case 2:
        preciseNumber = 9.99;
        break;
       case 3:
        preciseNumber = 9.999;
        break;
       case 4:
        preciseNumber = 9.9999;
        break;
       case 5:
        preciseNumber = 9.99999;
        break;
       default:
        preciseNumber = 9.999999;
        break;
      }
      oAttribute.setValue(preciseNumber);
      break;
     case "lookup":
      //For a specific lookup where the entity type is known
      if (oAttribute.getName() == "parentaccountid") {
       SDK.AttributeSamples.setToFirstEntityRecord("AccountSet", "account", "Name", "AccountId", oAttribute);
       // NOTE: This function uses an asynchronous call to the OData service. 
       // It works for the OnChange and Onload events –
       // but when used with the OnSave event,
       // It does not set the lookup value before the save action is completed.
      }
      break;
     case "memo":
     case "string":
      //Add text to String and memo fields
      //Email fields require a valid e-mail address value
      if (oAttribute.getFormat() != "email") {

       var textToAdd = "Text added by sample";
       if (textToAdd.length <= oAttribute.getMaxLength()) {
        oAttribute.setValue(textToAdd);
       }
      }
      else {
       oAttribute.setValue("someone@microsoft.com");
      }
      break;
     case "optionset":
      //Set options to the first option
      var firstOptionValue = oAttribute.getOptions()[0].value;
      if (firstOptionValue == "null") {
       var secondOptionValue = oAttribute.getOptions()[1].value;
       oAttribute.setValue(parseInt(secondOptionValue));
      }
      else {
       oAttribute.setValue(parseInt(firstOptionValue));
      }
      break;
    }
   }
  }
 };

 SDK.AttributeSamples.setToFirstEntityRecord = function (entitySetName, entityName, nameAttribute, idAttribute, lookupAttribute) {
  try {
   var oReq = SDK.AttributeSamples.getXMLHttpRequest();
   if (oReq != null) {
    oReq.open("GET", Xrm.Page.context.getServerUrl() +
             "/XRMServices/2011/OrganizationData.svc/" + entitySetName +
             "?$top=1&$select=" + nameAttribute + "," + idAttribute, true);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    oReq.onreadystatechange = function () {
     SDK.AttributeSamples.setLookupValue(oReq, lookupAttribute, entityName, nameAttribute, idAttribute);
    };
    oReq.send();
   }
   else {
    alert("AJAX (XMLHTTP) not supported.");
   }
  }
  catch (e) {
   alert(e.Message);
  }
 };

 SDK.AttributeSamples.setLookupValue = function (oReq, lookupAttribute, entityName, nameAttribute, idAttribute) {
  if (oReq.readyState == 4 /* complete */) {
   if (oReq.status == 200) {
       oReq.onreadystatechange = null; //avoids memory leaks
    var retrievedRecord = JSON.parse(oReq.responseText).d.results[0];

    var olookup = {};
    olookup.id = "{" + retrievedRecord[idAttribute] + "}";
    olookup.entityType = entityName;
    olookup.name = retrievedRecord[nameAttribute];
    var olookupValue = [];
    olookupValue[0] = olookup;
    lookupAttribute.setValue(olookupValue);

   }
  }
 };

 SDK.AttributeSamples.getXMLHttpRequest = function () {
  if (XMLHttpRequest) {
   return new XMLHttpRequest;
  }
  else {
   try
        { return new ActiveXObject("MSXML2.XMLHTTP.3.0"); }
   catch (ex) {
    return new Error("AJAX (XMLHTTP) not supported.");
   }
  }
 };

 SDK.AttributeSamples.isAttributeControlHidden = function (oAttribute) {

  var returnValue = false;
  if (oAttribute.controls.get(0) == null) {
   return true;
  }

  return returnValue;
 };
 // </snippetXrmPageScriptsAttributeSamples.setAttributeValues>
 //End of Attribute Samples Functions
// </snippetXrmPageScriptsAttributeSamples>