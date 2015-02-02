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
section.getLabel
section.getParent
section.getVisible
section.setLabel
section.setVisible
section.controls.forEach
section.controls.get
section.controls.getLength
*/
// <snippetXrmPageScriptsSectionSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.SectionSamples = {};

 // section.getLabel() example
// Example: The SDK.SectionSamples.showSectionLabels function loops through all of the sections in the first tab and displays their label.
 // <snippetXrmPageScriptsSectionSamples.showSectionLabels>
SDK.SectionSamples.showSectionLabels = function () {
 var firstTabSections = Xrm.Page.ui.tabs.get(0).sections.get();

 var message = "The following sections are in the first tab on the form:\n\n";
 for (var i in firstTabSections) {
  var sectionLabel = firstTabSections[i].getLabel();
  if (sectionLabel == null) {
   sectionLabel = "No Section Label Defined";
  }

  message += "  \u2219 " + sectionLabel + "\n";
 }

 alert(message);
};
 // </snippetXrmPageScriptsSectionSamples.showSectionLabels>

 // section.getParent() example
// Example: The SDK.SectionSamples.showSectionParents function will display a page in a new window showing the tab label values for sections on the page.
 // <snippetXrmPageScriptsSectionSamples.showSectionParents>
SDK.SectionSamples.showSectionParents = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show Sections Parents</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "</head><body>";
 html += SDK.SectionSamples.getSectionsParents();
 html += "</body></html>";
 var theWindow = window.open("", "_blank", "height=400,width=450,scrollbars=1,resizable=1", false);
 theWindow.document.open();
 theWindow.document.write(html);
 theWindow.document.close();
};

SDK.SectionSamples.getSectionsParents = function () {
 var html = "<table summary='This table displays a list of sections and their parent tab label.'><thead><tr><th scope='col'>Section Label</th><th scope='col'>Tab Label</th>" +
    "</tr></thead><tbody>";
 var tabs = Xrm.Page.ui.tabs.get();
 for (var i in tabs) {
  var tab = tabs[i];

  tab.sections.forEach(function (section, index) {
   var sectionLabel = section.getLabel();
   if (sectionLabel == null) {
    sectionLabel = "No Section Label Defined";
   }

   var tabLabel = section.getParent().getLabel();

   html += "<tr><td>" + sectionLabel + "</td><td>" + tabLabel + "</td></tr>";
  });
 }
 html += "</tbody></table>";
 return html;
};
 // </snippetXrmPageScriptsSectionSamples.showSectionParents>

 // section.getVisible() example
 // section.setVisible() example
// Example: The SDK.SectionSamples.toggleVisibleSections function hides or reveals all sections on the form each time the event occurs.
 // <snippetXrmPageScriptsSectionSamples.toggleVisibleSections>
SDK.SectionSamples.toggleVisibleSections = function () {
 var tabs = Xrm.Page.ui.tabs.get();

 for (var i in tabs) {
  var tab = tabs[i];
  tab.sections.forEach(function (section, index) {
   if (section.getVisible()) {
    section.setVisible(false);
   }
   else {
    section.setVisible(true);
   }
  });
 }
};
 // </snippetXrmPageScriptsSectionSamples.toggleVisibleSections>

 // section.setLabel() example
// Example: The SDK.SectionSamples.toggleSectionLabels function will show or hide a specified prefix for all section labels on the form.  
 // If a section does not have a label, it will be ignored.
 // <snippetXrmPageScriptsSectionSamples.toggleSectionLabels>
SDK.SectionSamples.toggleSectionLabels = function (prefix) {
 var tabs = Xrm.Page.ui.tabs.get();

 for (var i in tabs) {
  var tab = tabs[i];
  tab.sections.forEach(function (section, index) {
   var currentLabel = section.getLabel();
   if (currentLabel != null) {
    if (currentLabel.substring(0, prefix.length) == prefix) {
     var newLabel = currentLabel.substring(prefix.length);
     section.setLabel(newLabel);
    }
    else {
     section.setLabel(prefix + currentLabel);
    }
   }
  });
 }
};
 // </snippetXrmPageScriptsSectionSamples.toggleSectionLabels>

 // section.controls.forEach(function(control, index)) example
// Example: The SDK.SectionSamples.getMultipleControlAttributes function alerts the user of any attributes that have multiple controls on the form.
 // <snippetXrmPageScriptsSectionSamples.getMultipleControlAttributes>
SDK.SectionSamples.getMultipleControlAttributes = function () {
 var attributesOnForm = [];
 var multipleControlAttributes = [];

 var tabs = Xrm.Page.ui.tabs.get();
 for (var i in tabs) {
  var tab = tabs[i];
  var sections = tab.sections.get();

  for (var j in sections) {
   var section = sections[j];

   section.controls.forEach(function (control, index) {
    if (SDK.SectionSamples.doesControlHaveAttribute(control)) {

     var attribute = control.getAttribute();
     if (attribute != null) {
      var attributeName = attribute.getName();

      // Check if the attribute has already been added to the attributesOnForm collection
      if (SDK.SectionSamples.arrayContainsValue(attributesOnForm, attributeName)) {
       // Check if the attribute has already been added to the
       // multipleControlAttributes collection.  This would happen
       // if an attribute has 3+ controls on the form.
       if (SDK.SectionSamples.arrayContainsValue(multipleControlAttributes, attributeName) == false) {
        multipleControlAttributes.push(attributeName);
       }
      }
      else {
       attributesOnForm.push(attributeName);
      }
     }
    }
   });
  }
 }


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

SDK.SectionSamples.doesControlHaveAttribute = function (control) {
 var controlType = control.getControlType();
 return controlType != "iframe" && controlType != "webresource" && controlType != "subgrid" && controlType != "notes";
};

SDK.SectionSamples.arrayContainsValue = function (array, value) {
 for (var i in array) {
  if (array[i] == value)
   return true;
 }

 return false;
};
 // </snippetXrmPageScriptsSectionSamples.getMultipleControlAttributes>

 // section.controls.get() example
// Example: The SDK.SectionSamples.getFirstControlAttribute function alerts the user with the attribute label of the first control on the form.
 // <snippetXrmPageScriptsSectionSamples.getFirstControlAttribute>
SDK.SectionSamples.getFirstControlAttribute = function () {
 var firstControl = Xrm.Page.ui.tabs.get()[0].sections.get()[0].controls.get()[0];

 alert("The attribute label of the first control on the form is '" + firstControl.getLabel() + "'.");
};
 // </snippetXrmPageScriptsSectionSamples.getFirstControlAttribute>

 // section.get(delegate function(control, index)) example
// Example: The SDK.SectionSamples.getAllLookupAttributes function alerts the user with the attribute name for every lookup control on the form.
 // <snippetXrmPageScriptsSectionSamples.getAllLookupAttributes>
SDK.SectionSamples.getAllLookupAttributes = function () {
 var message = "The following lookup attributes are on the form:\n\n";

 var lookupControls = [];

 var tabs = Xrm.Page.ui.tabs.get();
 for (var i in tabs) {

  var tab = tabs[i];
  var sections = tab.sections.get();

  for (var j in sections) {
   var section = sections[j];

   var sectionLookupControls = section.controls.get(SDK.SectionSamples.isLookup);
   for (var k in sectionLookupControls) {
    lookupControls.push(sectionLookupControls[k]);
   }
  }
 }

 for (var i in lookupControls) {
  message += "- " + lookupControls[i].getLabel() + "\n";
 }

 alert(message);
};

SDK.SectionSamples.isLookup = function (control, index) {
 return control.getControlType() == "lookup";
};
 // </snippetXrmPageScriptsSectionSamples.getAllLookupAttributes>

 // section.controls.get(number) example
 // section.controls.get(index) example
// Example:  The SDK.SectionSamples.getFirstControlDemo function gets the first control on the form, and then using the attribute name from the control, 
 // gets the control by name, and compares the two.
 // <snippetXrmPageScriptsSectionSamples.getFirstControlDemo>
SDK.SectionSamples.getFirstControlDemo = function () {
 var firstControlByPosition = Xrm.Page.ui.tabs.get()[0].sections.get()[0].controls.get(0);
 var firstControlByName = Xrm.Page.ui.tabs.get()[0].sections.get()[0].controls.get(firstControlByPosition.getName());

 if (firstControlByName == firstControlByPosition) {
  alert("Getting the first control on the form by position and name returns the same control.");
 }
 else {
  alert("Getting the first control on the form by position and name does not return the same control.");
 }
};
 // </snippetXrmPageScriptsSectionSamples.getFirstControlDemo>

 // Xrm.Page.ui.controls.getLength() example
// Example: The SDK.SectionSamples.getControlCount function alerts the user of how many controls are on the current form.
 // <snippetXrmPageScriptsSectionSamples.getControlCount>
SDK.SectionSamples.getControlCount = function () {
 var controlsLength = 0;

 var tabs = Xrm.Page.ui.tabs.get();
 for (var i in tabs) {

  var tab = tabs[i];
  var sections = tab.sections.get();

  for (var j in sections) {
   var section = sections[j];

   controlsLength += section.controls.getLength();
  }
 }

 alert("This form has " + controlsLength + " controls on it.");
};
 // </snippetXrmPageScriptsSectionSamples.getControlCount>
 //End of Section Samples Functions

// </snippetXrmPageScriptsSectionSamples>