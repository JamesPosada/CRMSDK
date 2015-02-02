using System;
using System.Collections.Generic;
using System.ServiceModel.Description;
using System.Text;
using System.Web.Services.Protocols;
using System.Security.Cryptography.X509Certificates;
using System.Net;
using System.Net.Security;
using System.Security;
using System.Runtime.InteropServices;


using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Protocols.WSTrust;

using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Discovery;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;


namespace ExternalCRM
{
	public sealed class CrmConnect
	{
		//to ignore certificates errors
		private static bool AcceptAllCertificatePolicy(
		Object sender,
		X509Certificate certificate,
		X509Chain chain,
		SslPolicyErrors sslPolicyErrors)
		{
			return true;
		}

		private Uri _organizationUri, _discoveryUri;
		private string _adminName;
        private SecureString _adminPassword;

		private DiscoveryServiceProxy _discServiceProxy;
		private OrganizationServiceProxy _orgServiceProxy;


		public CrmConnect(Uri organizationUri, Uri discoveryUri, string adminName, string adminPassword )
		{
			//to ignore certificates errors
			ServicePointManager.ServerCertificateValidationCallback =
				new RemoteCertificateValidationCallback(AcceptAllCertificatePolicy);

			_organizationUri = organizationUri;
			_discoveryUri = discoveryUri;
			_adminName = adminName;
			_adminPassword = ConvertToSecureString(adminPassword);

			ClientCredentials userCredentials = new ClientCredentials();
			//authenticating the user and obtaining the SecurityToken from the STS		
			userCredentials.UserName.UserName = _adminName;
			userCredentials.UserName.Password = ConvertToUnsecureString(_adminPassword);

			IServiceConfiguration<IDiscoveryService> discoveryConfiguration =
				ServiceConfigurationFactory.CreateConfiguration<IDiscoveryService>(_discoveryUri);
			SecurityTokenResponse userResponseWrapper = discoveryConfiguration.Authenticate(userCredentials);
			_discServiceProxy = new DiscoveryServiceProxy(discoveryConfiguration, userResponseWrapper);

			IServiceConfiguration<IOrganizationService> serviceConfiguration =
				ServiceConfigurationFactory.CreateConfiguration<IOrganizationService>(_organizationUri);
			_orgServiceProxy = new OrganizationServiceProxy(serviceConfiguration, userResponseWrapper);
			_orgServiceProxy.EnableProxyTypes();

		}

		public CrmInfo DoCrmStuff(string upn)
		{
			//<snippetCrmConnect>
			Guid orgId = ((WhoAmIResponse)_orgServiceProxy.Execute(new WhoAmIRequest())).OrganizationId;

			//Obtaining user's systemuserid
			RetrieveUserIdByExternalIdRequest request = new RetrieveUserIdByExternalIdRequest();
			request.ExternalId = "C:" + upn;
			request.OrganizationId = orgId;

			RetrieveUserIdByExternalIdResponse response = (RetrieveUserIdByExternalIdResponse)_discServiceProxy.Execute(request);
			Guid userId = response.UserId;
			//</snippetCrmConnect>

			//Executing RetrieveUser 
			Entity su = _orgServiceProxy.Retrieve("systemuser", userId, new ColumnSet(true));
			EntityReference bizRef = (EntityReference)su["businessunitid"];
			Guid bizId = bizRef.Id;

			//Executing account on behalf of user
			Entity account = new Entity();
			account.LogicalName = "account";
			account["name"] = "On Behalf " + DateTime.Now.ToLongTimeString();

			Guid originalCallerId = _orgServiceProxy.CallerId;
			_orgServiceProxy.CallerId = userId;
			Guid accountId;

			try
			{
				accountId = _orgServiceProxy.Create(account);
			}
			finally
			{
				_orgServiceProxy.CallerId = originalCallerId;
			}

			return new CrmInfo(userId, bizId, (string)su["fullname"], accountId);
		}

		public int RetrieveNumberOfOrgs()
		{
			RetrieveOrganizationsRequest retrOrgs = new RetrieveOrganizationsRequest();
			retrOrgs.AccessType = EndpointAccessType.Default;
			RetrieveOrganizationsResponse orgs = (RetrieveOrganizationsResponse)_discServiceProxy.Execute(retrOrgs);
			return orgs.Details.Count;
		}

		public string RetrieveOrgsNames()
		{
			RetrieveOrganizationsRequest retrOrgs = new RetrieveOrganizationsRequest();
			retrOrgs.AccessType = EndpointAccessType.Default;
			RetrieveOrganizationsResponse orgs = (RetrieveOrganizationsResponse)_discServiceProxy.Execute(retrOrgs);
			string orgsNames = String.Empty;
			foreach (OrganizationDetail od in orgs.Details)
			{
				orgsNames += od.UniqueName;
				orgsNames += "; ";
			}
			return orgsNames;
		}

        /// <summary>
        /// Convert SecureString to unsecure string.
        /// </summary>
        /// <param name="securePassword">Pass SecureString for conversion.</param>
        /// <returns>unsecure string</returns>
        public string ConvertToUnsecureString(SecureString securePassword)
        {
            if (securePassword == null)
                throw new ArgumentNullException("securePassword");

            IntPtr unmanagedString = IntPtr.Zero;
            try
            {
                unmanagedString = Marshal.SecureStringToGlobalAllocUnicode(securePassword);
                return Marshal.PtrToStringUni(unmanagedString);
            }
            finally
            {
                Marshal.ZeroFreeGlobalAllocUnicode(unmanagedString);
            }
        }

        /// <summary>
        /// Convert unsecure string to SecureString.
        /// </summary>
        /// <param name="password">Pass unsecure string for conversion.</param>
        /// <returns>SecureString</returns>
        public SecureString ConvertToSecureString(string password)
        {
            if (password == null)
                throw new ArgumentNullException("password");

            var securePassword = new SecureString();
            foreach (char c in password)
                securePassword.AppendChar(c);
            securePassword.MakeReadOnly();
            return securePassword;
        }
	}

	public class CrmInfo
	{
		public Guid CrmUserId {private set; get;}
		public Guid CrmBusinessUnitId {private set; get;}
		public string FullName { private set; get; }
		public Guid AccountId { private set; get; }

		/// <summary>
		/// encapsulates some CRM info (just a way to pass on this info)
		/// </summary>
		/// <param name="crmUserId"></param>
		/// <param name="crmBusinessUnitId"></param>
		/// <param name="fullName"></param>
		/// <param name="accountId"></param>
		public CrmInfo(Guid crmUserId, Guid crmBusinessUnitId, string fullName, Guid accountId)
		{
			this.CrmUserId = crmUserId;
			this.CrmBusinessUnitId = crmBusinessUnitId;
			this.FullName = fullName;
			this.AccountId = accountId;
		}
	}
}
		