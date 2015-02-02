using System;
using System.Collections.Generic;
using System.Web;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Web;
using Microsoft.IdentityModel.Web.Configuration;

    public partial class Global : System.Web.HttpApplication
    {
		public override void Init()
		{
			base.Init();
			FederatedAuthentication.WSFederationAuthenticationModule.RedirectingToIdentityProvider +=new EventHandler<RedirectingToIdentityProviderEventArgs>(WSFederationAuthenticationModule_RedirectingToIdentityProvider);
		}
        /// <summary>
        /// Retrieves the address that was used in the browser for accessing
        /// the web application, and injects it as WREPLY parameter in the
        /// request to the STS
        /// </summary>
        void WSFederationAuthenticationModule_RedirectingToIdentityProvider(object sender, RedirectingToIdentityProviderEventArgs e)
        {
             //THe WHR parameter needs to be extracted if available and passed on to the STS
            e.SignInRequestMessage.HomeRealm = HttpContext.Current.Request.QueryString["whr"];
        }
    }
