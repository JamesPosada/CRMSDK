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
Functions documented in this file:
Xrm.Page.data.entity.getDataXml
Xrm.Page.data.entity.getEntityName 
Xrm.Page.data.entity.getId 
Xrm.Page.data.entity.getIsDirty
Xrm.Page.data.entity.save 
*/
// <snippetXrmPageScriptsEntitySamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.EntitySamples = {};

 // Xrm.Page.data.entity.getEntityName() example
 // Xrm.Page.data.entity.getId() example
 // Example: The showRecordProperties function displays the entity name and id to the user.
 // <snippetXrmPageScriptsEntitySamples.showRecordProperties>
SDK.EntitySamples.showRecordProperties = function showRecordProperties() {
 var entityName = Xrm.Page.data.entity.getEntityName();
 var entityId = Xrm.Page.data.entity.getId();

 var message = "This record's entity name is '" + entityName + "'.\n";

 if (entityId == null) {
  message += "This record must be saved before it has an id.";
 }
 else {
  message += "This record's id is '" + entityId + "'.";
 }

 alert(message);
};
 // </snippetXrmPageScriptsEntitySamples.showRecordProperties>

 // Xrm.Page.data.entity.getDataXml() example
 // Xrm.Page.data.entity.getIsDirty() example
 // Xrm.Page.data.entity.save() example
// Example: The SDK.EntitySamples.saveDirtyRecordDemo function will check if the form is dirty, and if so will present the user with a 
 // list of fields that will be sent to the server. 
 // <snippetXrmPageScriptsEntitySamples.saveDirtyRecordDemo>
SDK.EntitySamples.saveDirtyRecordDemo = function saveDirtyRecordDemo() {
 var isDirty = Xrm.Page.data.entity.getIsDirty();

 if (isDirty) {
  var dirtyFieldsPassedToServer = [];
  var cleanFieldsPassedToServer = [];

  // Create an XML Object to parse the entity's DataXml
  var xmlDoc;
  if (window.DOMParser) {
   xmlDoc = new DOMParser().parseFromString(Xrm.Page.data.entity.getDataXml(), "text/xml");
  }
  else {
   xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
   xmlDoc.async = false;
   xmlDoc.resolveExternals = false;
   xmlDoc.loadXML(Xrm.Page.data.entity.getDataXml());
  }

  // Assume every attribute being passed to the server is clean.
  // When we loop through the dirty attributes on the form,
  // we will move them from the clean array to the dirty array.
  for (var i = 0; i < xmlDoc.documentElement.childNodes.length; i++) {
   var childNode = xmlDoc.documentElement.childNodes[i];
   cleanFieldsPassedToServer.push(childNode.tagName);
  }

  Xrm.Page.data.entity.attributes.forEach(function (attribute, index) {
   if (attribute.getIsDirty()) {
    var attributeName = attribute.getName();

    // Remove the attribute from the clean fields array. 
    SDK.EntitySamples.removeElementFromArray(cleanFieldsPassedToServer, attributeName);

    // Add it to the dirty fields array.
    dirtyFieldsPassedToServer.push(attributeName);
   }
  });

  if (dirtyFieldsPassedToServer.length > 0) {
   var message = "The following fields are dirty and will be now be saved:\n- ";
   message += dirtyFieldsPassedToServer.join("\n- ");
  }

  if (cleanFieldsPassedToServer.length > 0) {
   message += "\n\nThe following fields are not dirty, but will still be sent to the server:\n- ";
   message += cleanFieldsPassedToServer.join("\n- ");
  }

  alert(message);
  Xrm.Page.data.entity.save();
 }
 else {
  alert("The current record is not dirty.");
 }
};

SDK.EntitySamples.removeElementFromArray = function (array, element) {
 for (var i = 0; i < array.length; i++) {
  if (array[i] == element) {
   array.splice(i, 1);
   break;
  }
 }
};
 // </snippetXrmPageScriptsEntitySamples.saveDirtyRecordDemo>
 //End of Entity Samples Functions

// </snippetXrmPageScriptsEntitySamples>