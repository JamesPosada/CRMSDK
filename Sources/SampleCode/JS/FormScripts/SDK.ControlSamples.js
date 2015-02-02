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
control.addCustomView 
control.addOption 
control.clearOptions 
control.getAttribute 
control.getControlType 
control.getDefaultView 
control.getDisabled 
control.getLabel
control.getName
control.getParent
control.getSrc 
control.getInitialUrl
control.getVisible 
control.refresh
control.removeOption
control.setDefaultView
control.setDisabled
control.setFocus
control.setLabel
control.setSrc 
control.setVisible
*/
// <snippetXrmPageScriptsControlSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.ControlSamples = {};

// control.addCustomView() example
// control.getDefaultView() example
// control.setDefaultView() example
// control.getName() example
// Example: The addCustomView function will add a new custom lookup called “SDK Sample View” to any lookup on the form that has a 
// default view that shows account records.
// <snippetXrmPageScriptsControlSamples.addCustomView>

SDK.ControlSamples.addCustomView = function () {
 // Most of the code in this example is simply to look for any account lookups in a given form.
 // Actually setting the custom view is done in the SDK.ControlSamples.setCustomViewOnAccountLookup function below.
 var lookupControls = Xrm.Page.ui.controls.get(SDK.ControlSamples.isLookup);
 for (var i in lookupControls) {
  SDK.ControlSamples.processLookup(lookupControls[i]);
 }

};
SDK.ControlSamples.isLookup = function (control, index) {
 return control.getControlType() == "lookup";
};
SDK.ControlSamples.processLookup = function (lookupControl) {
 //Is this a lookup for the account entity?
 // Retrieve the lookup attribute and check the Targets property.
 var currentEntity = Xrm.Page.data.entity.getEntityName();
 var LookupAttributeName = lookupControl.getAttribute().getName();
 //Use the SOAP endpoint
 var request = ["<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"><soapenv:Body>",
  "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">",
  "<request i:type=\"a:RetrieveAttributeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">",
  "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
  "<a:KeyValuePairOfstringanyType>",
  "<b:key>EntityLogicalName</b:key>",
  "<b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + currentEntity + "</b:value>",
  "</a:KeyValuePairOfstringanyType>",
  "<a:KeyValuePairOfstringanyType>",
  "<b:key>MetadataId</b:key>",
  "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">00000000-0000-0000-0000-000000000000</b:value>",
  "</a:KeyValuePairOfstringanyType>",
  "<a:KeyValuePairOfstringanyType>",
  "<b:key>RetrieveAsIfPublished</b:key>",
  "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">false</b:value>",
  "</a:KeyValuePairOfstringanyType>",
  "<a:KeyValuePairOfstringanyType>",
  "<b:key>LogicalName</b:key>",
  "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + LookupAttributeName + "</b:value>",
  "</a:KeyValuePairOfstringanyType>",
  "</a:Parameters>",
  "<a:RequestId i:nil=\"true\" /><a:RequestName>RetrieveAttribute</a:RequestName></request>",
  "</Execute>",
  "</soapenv:Body></soapenv:Envelope>"];

 var req = new XMLHttpRequest();
 var serverUrl = Xrm.Page.context.getServerUrl();

 if (serverUrl.match(/\/$/)) {
  serverUrl = serverUrl.substring(0, serverUrl.length - 1);
 }
 req.open("POST", serverUrl + "/XRMServices/2011/Organization.svc/web", true);
    try { req.responseType = 'msxml-document' } catch (e) { }
 req.setRequestHeader("Accept", "application/xml, text/xml, */*");
 req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
 req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
 req.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
      try {
          this.onreadystatechange = null; //avoids memory leaks
          SDK.ControlSamples.setSelectionNameSpaces(this.responseXML);
      } catch (e) { }
   if (SDK.ControlSamples.isAccountLookup(this)) {
    SDK.ControlSamples.setCustomViewOnAccountLookup(lookupControl);
   }
  }
 };
 req.send(request.join(""));

};
SDK.ControlSamples.setSelectionNameSpaces = function(doc)
{
  var namespaces = [
                "xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services'",
                "xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'",
                "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'",
                "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'",
                "xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata'",
                "xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/Arrays'",
                "xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'"
  ];
  doc.setProperty("SelectionNamespaces", namespaces.join(" "));
}
SDK.ControlSamples.isAccountLookup = function (resp) {
 var targets = null;
 var returnValue = false;
 // Verify that the lookup attribute is for the account
 // The Targets property should only contain a single node with the values 'account'.

 if (typeof resp.responseXML.selectSingleNode != 'undefined') {
  //For IE
  targets = resp.responseXML.selectSingleNode("//c:Targets");
  if (targets.childNodes.length == 1 && targets.firstChild.text == "account") {
   returnValue = true;
  }
 }
 else if (typeof resp.responseXML.evaluate != 'undefined') {
  // For other browsers
  var nsResolver = function (prefix) {
   var ns = {
    "default": "http://schemas.microsoft.com/xrm/2011/Contracts/Services",
    "s": "http://schemas.xmlsoap.org/soap/envelope/",
    "a": "http://schemas.microsoft.com/xrm/2011/Contracts",
    "i": "http://www.w3.org/2001/XMLSchema-instance",
    "c": "http://schemas.microsoft.com/xrm/2011/Metadata",
    "d": "http://schemas.microsoft.com/2003/10/Serialization/Arrays",
    "b": "http://schemas.datacontract.org/2004/07/System.Collections.Generic"
   };
   if (prefix == null || prefix == "") {
    return ns["default"];
   }
   else {
    if (ns[prefix] == null)
    { return null; }
    else {
     return ns[prefix];
    }

   }
  };
  targets = resp.responseXML.evaluate("//c:Targets", resp.responseXML, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (targets.childNodes.length == 1 && targets.firstChild.textContent == "account") {
   returnValue = true;
  }
 }

 return returnValue;
};
SDK.ControlSamples.setCustomViewOnAccountLookup = function (lookupControl) {

 var viewId = "{C7034F4F-6F92-4DD7-BD9D-9B9C1E996380}";
 var viewDisplayName = "SDK Sample View";
 var fetchXml = "<fetch version='1.0' " +
                            "output-format='xml-platform' " +
                            "mapping='logical'>" +
                        "<entity name='account'>" +
                        "<attribute name='name' />" +
                        "<attribute name='address1_city' />" +
                        "<order attribute='name' " +
                                "descending='false' />" +
                        "<filter type='and'>" +
                            "<condition attribute='ownerid' " +
                                        "operator='eq-userid' />" +
                            "<condition attribute='statecode' " +
                                        "operator='eq' " +
                                        "value='0' />" +
                        "</filter>" +
                        "<attribute name='primarycontactid' />" +
                        "<attribute name='telephone1' />" +
                        "<attribute name='accountid' />" +
                        "<link-entity alias='accountprimarycontactidcontactcontactid' " +
                                        "name='contact' " +
                                        "from='contactid' " +
                                        "to='primarycontactid' " +
                                        "link-type='outer' " +
                                        "visible='false'>" +
                            "<attribute name='emailaddress1' />" +
                        "</link-entity>" +
                        "</entity>" +
                    "</fetch>";

 var layoutXml = "<grid name='resultset' " +
                                  "object='1' " +
                                  "jump='name' " +
                                  "select='1' " +
                                  "icon='1' " +
                                  "preview='1'>" +
                              "<row name='result' " +
                                   "id='accountid'>" +
                                "<cell name='name' " +
                                      "width='300' />" +
                                "<cell name='telephone1' " +
                                      "width='100' />" +
                                "<cell name='address1_city' " +
                                      "width='100' />" +
                                "<cell name='primarycontactid' " +
                                      "width='150' />" +
                                "<cell name='accountprimarycontactidcontactcontactid.emailaddress1' " +
                                      "width='150' " +
                                      "disableSorting='1' />" +
                              "</row>" +
                            "</grid>";
 try {
  lookupControl.addCustomView(viewId, "account", viewDisplayName, fetchXml, layoutXml, false);
  lookupControl.setDefaultView(viewId);
  alert("The '" + lookupControl.getName() +
                          "' lookup was updated with a new default view.\n\nThe new view id is '" +
                          lookupControl.getDefaultView() + "'.");
 }
 catch (e) {
  alert(e.message);
 }

};
// </snippetXrmPageScriptsControlSamples.addCustomView>
// control.addOption() example
// control.clearOptions() example
// control.getAttribute() example
// Example: The SDK.ControlSamples.reverseOptions function reverses the order of all available options in the first optionset control on the form. 
// <snippetXrmPageScriptsControlSamples.reverseOptions>
SDK.ControlSamples.reverseOptions = function () {

 var optionsetControl = Xrm.Page.ui.controls.get(SDK.ControlSamples.isOptionSet)[0];
 if (optionsetControl != null) {
  var options = optionsetControl.getAttribute().getOptions();

  // Reverse all of the options in the optionset.
  optionsetControl.clearOptions();
  for (var i = 1; i <= options.length; i++) {
   if (options[options.length - i].value != "null") {
    optionsetControl.addOption(options[options.length - i], i - 1);
   }


  }
  alert("The options for the " + optionsetControl.getLabel() + " field have been reversed.");
 }
 else
 { alert("There are no Option set controls in this form."); }


};

SDK.ControlSamples.isOptionSet = function (control, index) {
 return control.getControlType() == "optionset";
};
// </snippetXrmPageScriptsControlSamples.reverseOptions>

// control.getControlType() example
// Example: The SDK.ControlSamples.showControlTypes function will display a page in a new window showing the control type for every control on the form.
// <snippetXrmPageScriptsControlSamples.showControlTypes>
SDK.ControlSamples.showControlTypes = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show Control Types</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "</head><body>";
 html += SDK.ControlSamples.getControlTypes();
 html += "</body></html>";
 var theWindow = window.open("", "_blank", "height=400,width=450,scrollbars=1,resizable=1", false);
 theWindow.document.open();
 theWindow.document.write(html);
 theWindow.document.close();
};

SDK.ControlSamples.getControlTypes = function () {
 var html = "<table summary='This table displays information about each control on the form.'><thead><tr><th scope='col'>Control Label</th><th scope='col'>Attribute Type</th>" +
    "<th scope='col'>Attribute Format</th><th scope='col'>Control Type</th></tr></thead><tbody>";
 var controls = Xrm.Page.ui.controls.get();
 for (var i in controls) {
  var control = controls[i];
  var label = control.getLabel();

  if (label == null) {
   var attributeName;
   try {
    attributeName = control.getName();
    if (attributeName != "undefined") {
     label = "attribute: " + attributeName;
    }
   }
   catch (e) {
    label = "Control is not bound to an attribute and does not have a label.";
   }
  }

  var attributeType;

  try {
   attributeType = control.getAttribute().getAttributeType();
  }
  catch (e) {
   attributeType = "No Attribute";
  }

  var attributeFormat;
  try {
   attributeFormat = control.getAttribute().getFormat();
  }
  catch (e) {
   attributeFormat = "No Attribute";
  }

  var controlType = control.getControlType();
  html += "<tr><td>" + label +
         "</td><td>" + attributeType +
         "</td><td>" + attributeFormat +
         "</td><td>" + controlType +
          "</td></tr>";
 }

 html += "</tbody></table>";
 return html;
};
// </snippetXrmPageScriptsControlSamples.showControlTypes>

// control.getDisabled example()
// control.setDisabled() example
// Example: The SDK.ControlSamples.toggleEnableControls function sets a value that indicates whether the control is disabled based on the results of the getDisabled method. 
// <snippetXrmPageScriptsControlSamples.toggleEnableControls>
SDK.ControlSamples.toggleEnableControls = function () {
 var controls = Xrm.Page.ui.controls.get();
 for (var i in controls) {
  var control = controls[i];
  if (control.getDisabled()) {
   control.setDisabled(false);
  }
  else {
   control.setDisabled(true);
  }
 }
};
// </snippetXrmPageScriptsControlSamples.toggleEnableControls>

// control.getLabel() example
// control.setLabel() example
// Example:The SDK.ControlSamples.toggleControlLabels function will show or hide a specified prefix for all control labels on the form.
// <snippetXrmPageScriptsControlSamples.toggleControlLabels>
SDK.ControlSamples.toggleControlLabels = function (prefix) {
 var controls = Xrm.Page.ui.controls.get();
 for (var i in controls) {
  var control = controls[i];
  var currentLabel = control.getLabel();
  if (currentLabel.substring(0, prefix.length) == prefix) {
   var newLabel = currentLabel.substring(prefix.length);
   control.setLabel(newLabel);
  }
  else {
   control.setLabel(prefix + currentLabel);
  }
 }
};
// </snippetXrmPageScriptsControlSamples.toggleControlLabels>

// control.getParent() example
// Example: The SDK.ControlSamples.showControlParents function will display a page in a new window showing the section label values for controls on the page.
// <snippetXrmPageScriptsControlSamples.showControlParents>
SDK.ControlSamples.showControlParents = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Show Control Parents</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "</head><body>";
 html += SDK.ControlSamples.getControlParents();
 html += "</body></html>";
 var theWindow = window.open("", "_blank", "height=400,width=350,scrollbars=1,resizable=1", false);
 theWindow.document.open();
 theWindow.document.write(html);
 theWindow.document.close();
};

SDK.ControlSamples.getControlParents = function () {
 var html = "<table summary='This table displays the parent section label for each control on the form.'><thead><tr><th scope='col'>Control Label</th><th scope='col'>Section Label</th></tr>" +
    "</thead><tbody>";
 var controls = Xrm.Page.ui.controls.get();
 for (var i in controls) {
  var control = controls[i];

  var controlLabel = control.getLabel();
  var sectionLabel = control.getParent().getLabel();
  if (sectionLabel == null) {
   sectionLabel = "No Label";
  }

  html += "<tr><td>" + controlLabel +
         "</td><td>" + sectionLabel +
          "</td></tr>";
 }
 html += "</tbody></table>";
 return html;
};
// </snippetXrmPageScriptsControlSamples.showControlParents>

// control.getSrc() example
// Example: The SDK.ControlSamples.showIframeUrls function displays the url for every Iframe on the form
// <snippetXrmPageScriptsControlSamples.showIframeUrls>
SDK.ControlSamples.showIframeUrls = function () {
 var controls = Xrm.Page.ui.controls.get(SDK.ControlSamples.isIframe);
 if (controls.length > 0) {
  var iframeUrls = [];
  for (var i in controls) {
   iframeUrls.push(controls[i].getSrc());
  }

  var message = "The iframes on the current form have the following urls:\n\n- " + iframeUrls.join("\n- ");
 }
 else {
  var message = "There are no iframe controls on the current form.";
 }

 alert(message);
};

SDK.ControlSamples.isIframe = function (control, index) {
 return control.getControlType() == "iframe";
};
// </snippetXrmPageScriptsControlSamples.showIframeUrls>

// control.getInitialUrl() example
// control.setSrc() example
// Example: The SDK.ControlSamples.redirectAllIframes function sets the src for every Iframe on the form to www.microsoft.com, 
// and then alerts the user with the old and new url.
// <snippetXrmPageScriptsControlSamples.redirectAllIframes>
SDK.ControlSamples.redirectAllIframes = function () {
 var controls = Xrm.Page.ui.controls.get(SDK.ControlSamples.isIframe);
 if (controls.length > 0) {
  for (var i in controls) {
   var control = controls[i];

   var controlName = control.getName();

   var newUrl = "http://www.microsoft.com";
   control.setSrc(newUrl);

   var oldUrl = control.getInitialUrl();
   alert("The source of the iframe '" + controlName + "' has been changed from '" + oldUrl + "' to '" + newUrl + "'.");
  }
 }
 else {
  alert("There are no iframe controls on the current form.");
 }
};
// </snippetXrmPageScriptsControlSamples.redirectAllIframes>

// control.getVisible() example
// control.setVisible() example
// Example: The SDK.ControlSamples.toggleVisibleControls function hides or reveals all controls on the form each time the event occurs.
// <snippetXrmPageScriptsControlSamples.toggleVisibleControls>
SDK.ControlSamples.toggleVisibleControls = function () {
 var controls = Xrm.Page.ui.controls.get();
 for (var i in controls) {
  var control = controls[i];
  if (control.getVisible()) {
   control.setVisible(false);
  }
  else {
   control.setVisible(true);
  }
 }
};
// </snippetXrmPageScriptsControlSamples.toggleVisibleControls>

// control.refresh() example
// Example: The SDK.ControlSamples.refreshAllSubGrids function refreshes every sub-grid on the form.
// <snippetXrmPageScriptsControlSamples.refreshAllSubGrids>
SDK.ControlSamples.refreshAllSubGrids = function () {
 var controls = Xrm.Page.ui.controls.get(SDK.ControlSamples.isSubGrid);

 if (controls.length > 0) {

  var subGridNames = "";
  for (var i in controls) {
   controls[i].refresh();
   subGridNames += (" - " + controls[i].getName() + "\n");
  }
  alert("The following subgrids were refreshed: \n" + subGridNames);
 }
 else {
  alert("There are no subgrid controls on the current form.");
 }
};

SDK.ControlSamples.isSubGrid = function (control, index) {
 return control.getControlType() == "subgrid";
};
// </snippetXrmPageScriptsControlSamples.refreshAllSubGrids>

// control.removeOption() example
// Example: The SDK.ControlSamples.removeLastOption function removes the last option from the first optionset control on the form.
// <snippetXrmPageScriptsControlSamples.removeLastOption>
SDK.ControlSamples.removeLastOption = function () {
 var controls = Xrm.Page.ui.controls.get(SDK.ControlSamples.isOptionSet);
 if (controls.length > 0) {
  var firstOptionSet = controls[0];
  var options = firstOptionSet.getAttribute().getOptions();
  //The last option may be null when no default value is set.
  // Make sure the null option is not the one being removed.

  var lastOptionIndex = options.length - 1;
  var lastOption = null;

  if (options[lastOptionIndex].value != "null") {
   lastOption = options[lastOptionIndex];
  }
  else {
   lastOption = options[lastOptionIndex - 1];
  }

  if (lastOption.value != null) {
   firstOptionSet.removeOption(lastOption.value);
   alert("The option '" + lastOption.text + "' has been removed from the '" + firstOptionSet.getName() + "' control.");
  }
  else {
   alert("The '" + firstOptionSet.getName() + "' control does not have any options.");
  }
 }
 else {
  alert("There are no optionset controls on the current form.");
 }
};

SDK.ControlSamples.isOptionSet = function (control, index) {
 return control.getControlType() == "optionset";
};
// </snippetXrmPageScriptsControlSamples.removeLastOption>

// control.setFocus() example
// Example: The SDK.ControlSamples.setFocusDemo function will open a new page containing a table with rows for each enabled and visible control 
// corresponding to an attribute. Each row contains a button that will use the window.opener to access the Xrm.Page object 
// to call the setFocus method for the control in the entity record form.
// <snippetXrmPageScriptsControlSamples.setFocusDemo>
SDK.ControlSamples.setFocusDemo = function () {
 var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>Set focus demo</title>";
 html += "<style type=\"text/css\">body { font-family:Calibri;}";
 html += "table {border:1px solid gray; border-collapse:collapse;}";
 html += "th {text-align:left; border:1px solid gray;}";
 html += "td {border:1px solid gray;}</style>";
 html += "<script type=\"text/javascript\" >";
 html += "function setFocus(name) { ";
 html += "window.opener.Xrm.Page.data.entity.attributes.get(name).controls.get(0).setFocus();";
 html += "}";
 html += "</script>";
 html += "</head><body>";
 html += SDK.ControlSamples.buildFocusDemoTable();
 html += "</body></html>";
 var theWindow = window.open("", "_blank", "height=400,width=400,scrollbars=1,resizable=1", false);
 theWindow.document.open();
 theWindow.document.write(html);
 theWindow.document.close();
};

SDK.ControlSamples.buildFocusDemoTable = function () {
 var html = "<table summary='This table displays a row for each enabled and visible control corresponding to an attribute. Each row has a button to call the setFocus method for that control on the page.'><thead><tr><th scope='col'>Control Label</th><th scope='col'>Set Focus</th>" +
    "</tr></thead><tbody>";
 var attributes = Xrm.Page.data.entity.attributes.get();
 for (var i in attributes) {
  var control = attributes[i].controls.get(0);
  //setFocus will cause an error if used on a control that is 
  //disabled, not visible, or cannot accept focus.
  if (control != null && !control.getDisabled() && control.getVisible()) {
   var controlLabel = attributes[i].controls.get(0).getLabel();
   var attributeName = attributes[i].getName();
   html += "<tr><td>" + controlLabel +
         "</td><td><input type=\"button\" onclick=\"setFocus('" + attributeName +
          "');\" value='Set Focus on " + controlLabel + "' /></td></tr>";
  }
 }
 html += "</tbody></table>";
 return html;
};
// </snippetXrmPageScriptsControlSamples.setFocusDemo>
//End of Control Samples Functions
// </snippetXrmPageScriptsControlSamples>