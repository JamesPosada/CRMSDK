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
tab.getDisplayState 
tab.getLabel
tab.getParent
tab.getVisible
tab.setDisplayState
tab.setFocus
tab.setLabel
tab.setVisible
tab.sections.forEach
tab.sections.get
tab.sections.getLength
*/
// <snippetXrmPageScriptsTabSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.TabSamples = {};

 // tab.getDisplayState() example
 // tab.setDisplayState() example
// Example: The SDK.TabSamples.toggleTabDisplayState function toggles the display state of every tab Shows the display state of 
 // every tab on the current form to the user.
 // <snippetXrmPageScriptsTabSamples.toggleTabDisplayState>
SDK.TabSamples.toggleTabDisplayState = function () {
 var tabs = Xrm.Page.ui.tabs.get();

 for (var i in tabs) {
  var tab = tabs[i];
  var currentTabState = tab.getDisplayState();
  var newTabState = "";

  if (currentTabState == "expanded") {
   newTabState = "collapsed";
  }
  else if (currentTabState == "collapsed") {
   newTabState = "expanded";
  }

  tab.setDisplayState(newTabState);
 }
};
 // </snippetXrmPageScriptsTabSamples.toggleTabDisplayState>

 // tab.getLabel() example
 // tab.setLabel() example
// Example: The SDK.TabSamples.toggleTabLabels function will show or hide a specified prefix for all tabs on the form.
 // <snippetXrmPageScriptsTabSamples.toggleTabLabels>
SDK.TabSamples.toggleTabLabels = function (prefix) {
 var tabs = Xrm.Page.ui.tabs.get();
 for (var i in tabs) {
  var tab = tabs[i];
  var currentLabel = tab.getLabel();
  if (currentLabel.substring(0, prefix.length) == prefix) {
   var newLabel = currentLabel.substring(prefix.length);
   tab.setLabel(newLabel);
  }
  else {
   tab.setLabel(prefix + currentLabel);
  }
 }
};
 // </snippetXrmPageScriptsTabSamples.toggleTabLabels>

 // tab.getParent() example
// Example: The SDK.TabSamples.validateTabParent function demonstrates that the tab.getParent() function returns the Xrm.Page.ui
 // <snippetXrmPageScriptsTabSamples.validateTabParent>
SDK.TabSamples.validateTabParent = function () {
 var firstTab = Xrm.Page.ui.tabs.get(0);
 var tabParent = firstTab.getParent();

 if (tabParent == Xrm.Page.ui) {
  alert("The tab.getParent() function does return the Xrm.Page.ui object.");
 }
 else {
  alert("The tab.getParent() function does not return the Xrm.Page.ui object.");
 }
};
 // </snippetXrmPageScriptsTabSamples.validateTabParent>

 // tab.getVisible() example
 // tab.setVisible() example
// Example: The SDK.TabSamples.toggleVisibleTabs function hides or reveals all tabs except the first tab on the form each time the event occurs.
 // <snippetXrmPageScriptsTabSamples.toggleVisibleTabs>
SDK.TabSamples.toggleVisibleTabs = function () {
 var tabs = Xrm.Page.ui.tabs.get();
 for (var i in tabs) {
  var tab = tabs[i];
  if (i > 0) {
   if (tab.getVisible()) {
    tab.setVisible(false);
   }
   else {
    tab.setVisible(true);
   }
  }
 }
};
 // </snippetXrmPageScriptsTabSamples.toggleVisibleTabs>

 // tab.setFocus() example
// Example: The SDK.TabSamples.setFocusDemo function will open a new page containing a table with rows for each visible tab. 
 // Each row contains a button that will use the window.opener to access the Xrm.Page object to call the setFocus method 
 // for the tab in the entity record form.
 // <snippetXrmPageScriptsTabSamples.setFocusDemo>
SDK.TabSamples.setFocusDemo = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Set focus demo</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "<script type=\"text/javascript\" >";
 html += "function setFocus(index) { ";
 html += "window.opener.Xrm.Page.ui.tabs.get(index).setFocus();";
 html += "}";
 html += "</script>";
 html += "</head><body>";
 html += SDK.TabSamples.buildFocusDemoTable();
 html += "</body></html>";
 var theWindow = window.open("", "_blank", "height=400,width=450,scrollbars=1,resizable=1", false);
 theWindow.document.open();
 theWindow.document.write(html);
 theWindow.document.close();
};

SDK.TabSamples.buildFocusDemoTable = function () {
 var html = "<table summary='This table displays a row for each visible tab. Each row contains a button to call the setFocus method on the tab in the page.'><thead><tr><th scope='col'>Tab Label</th><th scope='col'>Set Focus</th>" +
    "</tr></thead><tbody>";
 var tabs = Xrm.Page.ui.tabs.get();
 for (var i in tabs) {
  var tab = tabs[i];
  //setFocus will cause an error if used on a tabs that is not visible.
  if (tab.getVisible()) {
   var tabLabel = tab.getLabel();

   html += "<tr><td>" + tabLabel +
         "</td><td><input type=\"button\" onclick=\"setFocus(" + i +
          ");\" value='Set Focus on " + tabLabel + "' /></td></tr>";
  }
 }
 html += "</tbody></table>";
 return html;
};
 // </snippetXrmPageScriptsTabSamples.setFocusDemo>

 // Examples:The following two examples perform the same task. 
 // Both examples display a message showing the hierarchy of tabs and sections on the current form.

 // tab.sections.forEach() example 1
 // This example uses an anonymous function defined within the argument.
 // <snippetXrmPageScriptsTabSamples.listFormHierarchy>
SDK.TabSamples.listFormHierarchy = function () {
 var tabs = Xrm.Page.ui.tabs.get();

 var message = "The hierarchy of the current form is:\n\n";

 for (var i in tabs) {
  var tab = tabs[i];

  message += "  \u2219 " + tab.getLabel() + "\n";

  tab.sections.forEach(function (section, sectionIndex) {
   var sectionLabel = section.getLabel();
   if (sectionLabel == null) {
    sectionLabel = "No Section Label Defined";
   }

   message += "      \u2219 " + sectionLabel + "\n";
  });
 }

 alert(message);
};
 // </snippetXrmPageScriptsTabSamples.listFormHierarchy>

 // tab.sections.forEach() example 2
 // This example passes a reference to a function defined outside the argument.
 // <snippetXrmPageScriptsTabSamples.listFormHierarchy_Example2>
SDK.TabSamples.listFormHierarchy_Example2 = function () {
 var tabs = Xrm.Page.ui.tabs.get();

 window.message = "The hierarchy of the current form is:\n\n";

 for (var i in tabs) {
  var tab = tabs[i];

  window.message += "  \u2219 " + tab.getLabel() + "\n";

  tab.sections.forEach(SDK.TabSamples.listSectionName);
 }

 alert(window.message);
 window.message = null;
};

SDK.TabSamples.listSectionName = function (section, index) {
 var sectionLabel = section.getLabel();
 if (sectionLabel == null) {
  sectionLabel = "No Section Label Defined";
 }

 window.message += "      \u2219 " + sectionLabel + "\n";
};
 // </snippetXrmPageScriptsTabSamples.listFormHierarchy_Example2>

 // tab.sections.get() example
// Example: The SDK.TabSamples.showSectionLabels function loops through all of the sections in the first tab and display their label.
 // <snippetXrmPageScriptsTabSamples.showSectionLabels>
SDK.TabSamples.showSectionLabels = function () {
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
 // </snippetXrmPageScriptsTabSamples.showSectionLabels>

 // tab.sections.get(number) example
// Example: The SDK.TabSamples.showFirstSectionPerTab function displays the name of the first section in every tab.
 // <snippetXrmPageScriptsTabSamples.showFirstSectionPerTab>
SDK.TabSamples.showFirstSectionPerTab = function () {
 var tabs = Xrm.Page.ui.tabs.get();

 var message = "The first sections in every tabs are:\n\n";

 for (var i in tabs) {
  var tab = tabs[i];
  var firstSection = tab.sections.get(0);
  var sectionLabel = firstSection.getLabel();
  if (sectionLabel == null) {
   sectionLabel = "No Section Label Defined";
  }

  message += "  \u2219 " + sectionLabel + "\n";
 }

 alert(message);
};
 // </snippetXrmPageScriptsTabSamples.showFirstSectionPerTab>

 // tab.sections.get(string) example
// Example: The SDK.TabSamples.doesSectionExistByName displays if there is a section with the given name on the form.
 // <snippetXrmPageScriptsTabSamples.doesSectionExistByName>
SDK.TabSamples.doesSectionExistByName = function (sectionName) {
 var tabs = Xrm.Page.ui.tabs.get();
 var sectionCount = 0;

 for (var i in tabs) {
  var tab = tabs[i];

  var section = tab.sections.get(sectionName);
  if (section != null) {
   sectionCount++;
  }
 }

 alert("There are " + sectionCount + " section(s) on the form with the name '" + sectionName + "'.");
};
 // </snippetXrmPageScriptsTabSamples.doesSectionExistByName>

 // tab.sections.get(function(section, index)) example
// Example: The SDK.TabSamples.showSectionsVisibility function shows the visibility of every section on the form.
 // <snippetXrmPageScriptsTabSamples.showSectionsVisibility>
SDK.TabSamples.showSectionsVisibility = function () {
 var tabs = Xrm.Page.ui.tabs.get();
 var message = "The following is a list of tabs and their display state:\n\n";

 for (var i in tabs) {
  var tab = tabs[i];

  tab.sections.get(function (section, index) {
   var sectionLabel = section.getLabel();
   if (sectionLabel == null) {
    sectionLabel = "No Section Label Defined";
   }

   var visibility = "";
   if (section.getVisible()) {
    visibility = "Visible";
   }
   else {
    visibility = "Hidden";
   }

   message += "  \u2219 " + sectionLabel + " - " + visibility + "\n";
  });
 }

 alert(message);
};
 // </snippetXrmPageScriptsTabSamples.showSectionsVisibility>

 // tab.sections.getLength() example
// Example: The SDK.TabSamples.listMultipleSectionTabs function lists every tab that contains two or more sections.
 // <snippetXrmPageScriptsTabSamples.listMultipleSectionTabs>
SDK.TabSamples.listMultipleSectionTabs = function () {
 var tabs = Xrm.Page.ui.tabs.get();

 var message = "The following tab(s) contain multiple sections:\n\n";

 for (var i in tabs) {
  var tab = tabs[i];

  var sectionsCount = tab.sections.getLength();
  if (sectionsCount > 1) {
   message += "  \u2219 " + tab.getLabel() + "\n";
  }
 }

 alert(message);
};
 // </snippetXrmPageScriptsTabSamples.listMultipleSectionTabs>
 //End of Tab Samples Functions

// </snippetXrmPageScriptsTabSamples>