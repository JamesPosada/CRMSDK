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
Xrm.Page.context.getAuthenticationHeader 
Xrm.Page.context.getOrgLcid 
Xrm.Page.context.getOrgUniqueName 
Xrm.Page.context.getServerUrl 
Xrm.Page.context.getUserId 
Xrm.Page.context.getUserLcid 
Xrm.Page.context.getUserRoles 
Xrm.Page.context.getQueryStringParameters 
*/
//Adding content of json2.js to define a JSON object for the SDK.ContextSamples.isUserSysAdmin function
if (!this.JSON) {
    this.JSON = {};
}
(function () {
    function f(n) { return n < 10 ? '0' + n : n; }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null; };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' },
     rep; function quote(string) {
         escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
             var c = meta[a]; return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
         }) + '"' : '"' + string + '"';
     }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string': return quote(value);
            case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value);
            case 'object': if (!value) { return 'null'; }
                gap += indent; partial = []; if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null'; }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']'; gap = mind; return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length; for (i = 0; i < length; i += 1) {
                        k = rep[i]; if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}'; gap = mind; return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i; gap = ''; indent = ''; if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) { indent += ' '; }
            }
            else if (typeof space === 'string') { indent = space; }
            rep = replacer; if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', { '': value });
        };
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j; function walk(holder, key) {
                var k, v, value = holder[key]; if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) { value[k] = v; }
                            else { delete value[k]; }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0; if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({ '': j },
                '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}
());

// <snippetXrmPageScriptsContextSamples>
//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined") {
    SDK = {};
}

// Create Namespace container for functions in this library;
SDK.ContextSamples = {};



// Xrm.Page.context.getAuthenticationHeader() example
// Example: The SDK.ContextSamples.getAuthenticationHeader function alerts the user with the value of the authentication header.
// <snippetXrmPageScriptsContextSamples.getAuthenticationHeader>
SDK.ContextSamples.getAuthenticationHeader = function () {
    var authenticationHeader = Xrm.Page.context.getAuthenticationHeader();


    alert("The Authentication Header is:\n\n" + authenticationHeader);

};

// </snippetXrmPageScriptsContextSamples.getAuthenticationHeader>

// Xrm.Page.context.getOrgLcid() example
// Xrm.Page.context.getOrgUniqueName example
// Xrm.Page.context.getUserLcid() example
// Example: The SDK.ContextSamples.getOrgAndUserInfo function alerts the organization's name and language code, as well as the current user's language code.
// <snippetXrmPageScriptsContextSamples.getOrgAndUserInfo>
SDK.ContextSamples.getOrgAndUserInfo = function () {
    var orgName = Xrm.Page.context.getOrgUniqueName();

    var message = "The current Organization Name is '" + orgName + "'.\n";

    var orgLcid = Xrm.Page.context.getOrgLcid();

    message += "The current Organization Language Code Id is '" + orgLcid + "'.\n";

    var currentUserLcid = Xrm.Page.context.getUserLcid();

    message += "The current user's Language Code Id is '" + currentUserLcid + "'.";

    alert(message);

};

// </snippetXrmPageScriptsContextSamples.getOrgAndUserInfo>

// Xrm.Page.context.getServerUrl example
// Xrm.Page.context.getUserRoles example
// Example: The SDK.ContextSamples.isUserSysAdmin function calls the CRM oData Endpoint to get the id of the System Administrator role, 
// and then checks if the current user has the System Administrator role.
// This function has a dependency on a JSON object that might need to be created using the json2.js file.
// <snippetXrmPageScriptsContextSamples.isUserSysAdmin>
SDK.ContextSamples.isUserSysAdmin = function () {
    var serverUrl = Xrm.Page.context.getServerUrl();


    if (serverUrl.match(/\/$/)) {
        serverUrl = serverUrl.substring(0, serverUrl.length - 1);

    }


    var query = "/XRMServices/2011/OrganizationData.svc/RoleSet?$top=1&$filter=Name eq 'System Administrator'&$select=RoleId";
    var retrieveRoleRequest = new XMLHttpRequest();

    retrieveRoleRequest.open("GET", serverUrl + query, true);

    retrieveRoleRequest.setRequestHeader("Accept", "application/json");

    retrieveRoleRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    retrieveRoleRequest.onreadystatechange = function () {
        SDK.ContextSamples.retrieveRoleResponse(this);

    };

    retrieveRoleRequest.send();

};

SDK.ContextSamples.retrieveRoleResponse = function (retrieveRoleRequest) {
    if (retrieveRoleRequest.readyState == 4) {
        if (retrieveRoleRequest.status == 200) {
            retrieveRoleRequest.onreadystatechange = null; //avoids memory leaks
            var results = JSON.parse(retrieveRoleRequest.responseText).d.results;

            if (results[0] != null) {
                var sysAdminRoleId = results[0].RoleId;

                var currentUserRoles = Xrm.Page.context.getUserRoles();


                for (var i = 0; i < currentUserRoles.length; i++) {
                    var userRole = currentUserRoles[i];

                    if (userRole == sysAdminRoleId) {
                        alert("The current user has the 'System Administrator' role.");

                        return;
                    }

                }

                alert("The current user does not have the 'System Administrator' role.");


            }

            else {
                alert("The 'System Administrator' role id could not be found");

            }

        }

        else {
            //handle error
        }

    }

};

// </snippetXrmPageScriptsContextSamples.isUserSysAdmin>

// Xrm.Page.context.getUserId() example
// Example: The SDK.ContextSamples.isCurrentUserRecordOwner function checks if the current user's id is equal to the current record's ownerid.
// <snippetXrmPageScriptsContextSamples.isCurrenUserRecordOwner>
SDK.ContextSamples.isCurrenUserRecordOwner = function () {
    var currentUserId = Xrm.Page.context.getUserId();


    var ownerIdAttribute = Xrm.Page.data.entity.attributes.get("ownerid");

    if (ownerIdAttribute != null) {

        var ownerIdValue = ownerIdAttribute.getValue();

        if (ownerIdValue != null && ownerIdValue.length == 1) {
            if (currentUserId == ownerIdValue[0].id) {
                alert("The current user is the owner of this record.");

            }

            else {
                alert("The current user is not the owner of this record.");

            }

        }

        else {
            alert("The ownerid field does not currently have a value.");

        }

    }

    else {
        alert("The ownerid field is not on the current form.");

    }

};

// </snippetXrmPageScriptsContextSamples.isCurrenUserRecordOwner>

// Xrm.Page.context.getQueryStringParameters() example
// Example: The SDK.ContextSamples.getQueryStringParams function displays all of the query string parameters and their values.
// <snippetXrmPageScriptsContextSamples.getQueryStringParams>
SDK.ContextSamples.getQueryStringParams = function () {
    var queryStringParams = Xrm.Page.context.getQueryStringParameters();


    var paramsMessage = "";
    for (var i in queryStringParams) {
        paramsMessage += "\n" + i + ": " + queryStringParams[i];
    }


    alert("The current query string parameters are:\n" + paramsMessage);

};

// </snippetXrmPageScriptsContextSamples.getQueryStringParams>
//End of Context Samples Functions
// </snippetXrmPageScriptsContextSamples>