// =====================================================================
//
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
//
// =====================================================================
//<snippetCreateUpdateEntityMetadata>
using System;
using System.ServiceModel;
using System.ServiceModel.Description;

// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// found in the SDK\bin folder.
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Discovery;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;

// This namespace is found in Microsoft.Crm.Sdk.Proxy.dll assembly
// found in the SDK\bin folder.
using Microsoft.Crm.Sdk.Messages;

namespace Microsoft.Crm.Sdk.Samples
{
    public class CreateUpdateEntityMetadata
    {
        #region Class Level Members
        /// <summary>
        /// Stores the organization service proxy.
        /// </summary>
        private OrganizationServiceProxy _serviceProxy;

        private const String _customEntityName = "new_bankaccount"; 

        #endregion Class Level Members

        #region How To Sample Code
        /// <summary>
        /// Create a custom entity.
        /// Update the custom entity.
        /// Optionally delete the custom entity.
       /// </summary>
        /// <param name="serverConfig">Contains server connection information.</param>
        /// <param name="promptForDelete">When True, the user will be prompted to delete all
        /// created entities.</param>
        public void Run(ServerConnection.Configuration serverConfig, bool promptForDelete)
        {
            try
            {

                // Connect to the Organization service. 
                // The using statement assures that the service proxy will be properly disposed.
                using (_serviceProxy = ServerConnection.GetOrganizationProxy(serverConfig))
                {
                    // This statement is required to enable early-bound type support.
                    _serviceProxy.EnableProxyTypes();


                    // Create the custom entity.
                    //<snippetCreateUpdateEntityMetadata1>
                    CreateEntityRequest createrequest = new CreateEntityRequest
                    {

                        //Define the entity
                        Entity = new EntityMetadata
                        {
                            SchemaName = _customEntityName,
                            DisplayName = new Label("Bank Account", 1033),
                            DisplayCollectionName = new Label("Bank Accounts", 1033),
                            Description = new Label("An entity to store information about customer bank accounts", 1033),
                            OwnershipType = OwnershipTypes.UserOwned,
                            IsActivity = false,

                        },

                        // Define the primary attribute for the entity
                        PrimaryAttribute = new StringAttributeMetadata
                        {
                            SchemaName = "new_accountname",
                            RequiredLevel = new AttributeRequiredLevelManagedProperty(AttributeRequiredLevel.None),
                            MaxLength = 100,
                            Format = StringFormat.Text,
                            DisplayName = new Label("Account Name", 1033),
                            Description = new Label("The primary attribute for the Bank Account entity.", 1033)
                        }

                    };
                    _serviceProxy.Execute(createrequest);
                    Console.WriteLine("The bank account entity has been created.");
                    //</snippetCreateUpdateEntityMetadata1>


                    // Add some attributes to the Bank Account entity
                    //<snippetCreateUpdateEntityMetadata2>
                    CreateAttributeRequest createBankNameAttributeRequest = new CreateAttributeRequest
                    {
                        EntityName = _customEntityName,
                        Attribute = new StringAttributeMetadata
                        {
                            SchemaName = "new_bankname",
                            RequiredLevel = new AttributeRequiredLevelManagedProperty(AttributeRequiredLevel.None),
                            MaxLength = 100,
                            Format = StringFormat.Text,
                            DisplayName = new Label("Bank Name", 1033),
                            Description = new Label("The name of the bank.", 1033)
                        }
                    };

                    _serviceProxy.Execute(createBankNameAttributeRequest);
                    //</snippetCreateUpdateEntityMetadata2>
                    Console.WriteLine("An bank name attribute has been added to the bank account entity.");

                    //<snippetCreateUpdateEntityMetadata3>
                    CreateAttributeRequest createBalanceAttributeRequest = new CreateAttributeRequest
                    {
                        EntityName = _customEntityName,
                        Attribute = new MoneyAttributeMetadata
                        {
                            SchemaName = "new_balance",
                            RequiredLevel = new AttributeRequiredLevelManagedProperty(AttributeRequiredLevel.None),
                            PrecisionSource = 2,
                            DisplayName = new Label("Balance", 1033),
                            Description = new Label("Account Balance at the last known date", 1033),

                        }
                    };

                    _serviceProxy.Execute(createBalanceAttributeRequest);
                    //</snippetCreateUpdateEntityMetadata3>
                    Console.WriteLine("An account balance attribute has been added to the bank account entity.");

                    //<snippetCreateUpdateEntityMetadata4>
                    CreateAttributeRequest createCheckedDateRequest = new CreateAttributeRequest
                    {
                        EntityName = _customEntityName,
                        Attribute = new DateTimeAttributeMetadata
                        {
                            SchemaName = "new_checkeddate",
                            RequiredLevel = new AttributeRequiredLevelManagedProperty(AttributeRequiredLevel.None),
                            Format = DateTimeFormat.DateOnly,
                            DisplayName = new Label("Date", 1033),
                            Description = new Label("The date the account balance was last confirmed", 1033)

                        }
                    };

                    _serviceProxy.Execute(createCheckedDateRequest);
                    Console.WriteLine("An date attribute has been added to the bank account entity.");
                    //</snippetCreateUpdateEntityMetadata4>
                    //Create a lookup attribute to link the bank account with a contact record.

                    //<snippetCreateUpdateEntityMetadata5>
                    CreateOneToManyRequest req = new CreateOneToManyRequest()
                    {
                        Lookup = new LookupAttributeMetadata()
                        {
                            Description = new Label("The owner of the bank account", 1033),
                            DisplayName = new Label("Account Owner", 1033),
                            LogicalName = "new_parent_contactid",
                            SchemaName = "New_Parent_ContactId",
                            RequiredLevel = new AttributeRequiredLevelManagedProperty(AttributeRequiredLevel.ApplicationRequired)
                        },
                        OneToManyRelationship = new OneToManyRelationshipMetadata()
                        {
                            AssociatedMenuConfiguration = new AssociatedMenuConfiguration()
                            {
                                Behavior = AssociatedMenuBehavior.UseCollectionName,
                                Group = AssociatedMenuGroup.Details,
                                Label = new Label("Bank Accounts", 1033),
                                Order = 10000
                            },
                            CascadeConfiguration = new CascadeConfiguration()
                            {
                                Assign = CascadeType.Cascade,
                                Delete = CascadeType.Cascade,
                                Merge = CascadeType.Cascade,
                                Reparent = CascadeType.Cascade,
                                Share = CascadeType.Cascade,
                                Unshare = CascadeType.Cascade
                            },
                            ReferencedEntity = Contact.EntityLogicalName,
                            ReferencedAttribute = "contactid",
                            ReferencingEntity = _customEntityName,
                            SchemaName = "new_contact_new_bankaccount"
                        }
                    };
                    _serviceProxy.Execute(req);
                    //</snippetCreateUpdateEntityMetadata5>
                    Console.WriteLine("A lookup attribute has been added to the bank account entity to link it with the Contact entity.");



                    //<snippetCreateUpdateEntityMetadata9>
                   
                    //<snippetCreateUpdateEntityMetadata.RetrieveEntity>
                    RetrieveEntityRequest retrieveBankAccountEntityRequest = new RetrieveEntityRequest
                    {
                        EntityFilters = EntityFilters.Entity,
                        LogicalName = _customEntityName
                    };
                    RetrieveEntityResponse retrieveBankAccountEntityResponse = (RetrieveEntityResponse)_serviceProxy.Execute(retrieveBankAccountEntityRequest);
                    //</snippetCreateUpdateEntityMetadata.RetrieveEntity>
                    //<snippetCreateUpdateEntityMetadata8>
                    EntityMetadata BankAccountEntity = retrieveBankAccountEntityResponse.EntityMetadata;

                    // Disable Mail merge
                    BankAccountEntity.IsMailMergeEnabled = new BooleanManagedProperty(false);
                    // Enable Notes
                    UpdateEntityRequest updateBankAccountRequest = new UpdateEntityRequest
                    {
                        Entity = BankAccountEntity,
                        HasNotes = true
                    };
                    _serviceProxy.Execute(updateBankAccountRequest);
                    //</snippetCreateUpdateEntityMetadata8>
                    //</snippetCreateUpdateEntityMetadata9>

                    Console.WriteLine("The bank account entity has been updated");

                    // Customizations must be published after an entity is updated.
                    //<snippetCreateUpdateEntityMetadata6>
                    PublishAllXmlRequest publishRequest = new PublishAllXmlRequest();
                    _serviceProxy.Execute(publishRequest);
                    //</snippetCreateUpdateEntityMetadata6>
                    Console.WriteLine("Customizations were published.");

                    DeleteRequiredRecords(promptForDelete);
                }
            }

            // Catch any service fault exceptions that Microsoft Dynamics CRM throws.
            catch (FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>)
            {
                // You can handle an exception here or pass it back to the calling method.
                throw;
            }
        }

        /// <summary>
        /// Deletes the custom entity that was created for this sample.
        /// <param name="prompt">Indicates whether to prompt the user to delete the records created in this sample.</param>
        /// </summary>
        public void DeleteRequiredRecords(bool prompt)
        {
            bool deleteEntity = true;

            if (prompt)
            {
                Console.WriteLine("\nDo you want this custom entity deleted? (y/n)");
                String answer = Console.ReadLine();

                deleteEntity = (answer.StartsWith("y") || answer.StartsWith("Y"));
            }

            if (deleteEntity)
            {
             //<snippetCreateUpdateEntityMetadata10>
                DeleteEntityRequest request = new DeleteEntityRequest()
                {
                    LogicalName = _customEntityName,
                };
                _serviceProxy.Execute(request);
              //</snippetCreateUpdateEntityMetadata10>
                Console.WriteLine("The records have been deleted.");
            }
        }

        #endregion How To Sample Code

        #region Main
        /// <summary>
        /// Standard Main() method used by most SDK samples.
        /// </summary>
        /// <param name="args"></param>
        static public void Main(string[] args)
        {
            try
            {
                // Obtain the target organization's Web address and client logon 
                // credentials from the user.
                ServerConnection serverConnect = new ServerConnection();
                ServerConnection.Configuration config = serverConnect.GetServerConfiguration();

                CreateUpdateEntityMetadata app = new CreateUpdateEntityMetadata();
                app.Run(config, true);
            }
            catch (FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Timestamp: {0}", ex.Detail.Timestamp);
                Console.WriteLine("Code: {0}", ex.Detail.ErrorCode);
                Console.WriteLine("Message: {0}", ex.Detail.Message);
                Console.WriteLine("Plugin Trace: {0}", ex.Detail.TraceText);
                Console.WriteLine("Inner Fault: {0}",
                    null == ex.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
            }
            catch (System.TimeoutException ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Message: {0}", ex.Message);
                Console.WriteLine("Stack Trace: {0}", ex.StackTrace);
                Console.WriteLine("Inner Fault: {0}",
                    null == ex.InnerException.Message ? "No Inner Fault" : ex.InnerException.Message);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine(ex.Message);

                // Display the details of the inner exception.
                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);

                    FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> fe = ex.InnerException
                        as FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>;
                    if (fe != null)
                    {
                        Console.WriteLine("Timestamp: {0}", fe.Detail.Timestamp);
                        Console.WriteLine("Code: {0}", fe.Detail.ErrorCode);
                        Console.WriteLine("Message: {0}", fe.Detail.Message);
                        Console.WriteLine("Plugin Trace: {0}", fe.Detail.TraceText);
                        Console.WriteLine("Inner Fault: {0}",
                            null == fe.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
                    }
                }
            }
            // Additional exceptions to catch: SecurityTokenValidationException, ExpiredSecurityTokenException,
            // SecurityAccessDeniedException, MessageSecurityException, and SecurityNegotiationException.

            finally
            {
                 
                Console.WriteLine("Press <Enter> to exit.");
                Console.ReadLine();
            }

        }
        #endregion Main

    }
}
//</snippetCreateUpdateEntityMetadata>