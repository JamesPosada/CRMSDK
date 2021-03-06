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
//<snippetDataServiceContextExtensions>
using System;
using System.Linq;
using System.Data.Services.Client;
using System.Reflection;
using System.Collections.Generic;
using System.ComponentModel;
using System.Collections.ObjectModel;
using System.Xml.Linq;

namespace RESTSilverlightContactEditor.CrmODataService
{
 partial class AdventureWorksCycleContext
	{
		#region Methods
		partial void OnContextCreated()
		{
			this.ReadingEntity += this.OnReadingEntity;
			this.WritingEntity += this.OnWritingEntity;
		}
		#endregion

		#region Event Handlers
		private void OnReadingEntity(object sender, ReadingWritingEntityEventArgs e)
		{
			ODataEntity entity = e.Entity as ODataEntity;
			if (null == entity)
			{
				return;
			}

			entity.ClearChangedProperties();
		}

		private void OnWritingEntity(object sender, ReadingWritingEntityEventArgs e)
		{
			ODataEntity entity = e.Entity as ODataEntity;
			if (null == entity)
			{
				return;
			}

			entity.RemoveUnchangedProperties(e.Data);
		}
		#endregion
	}

	public abstract class ODataEntity
	{
		private readonly Collection<string> ChangedProperties = new Collection<string>();

		public ODataEntity()
		{
			EventInfo info = this.GetType().GetEvent("PropertyChanged");
			if (null != info)
			{
				PropertyChangedEventHandler method = new PropertyChangedEventHandler(this.OnEntityPropertyChanged);

				//Ensure that the method is not attached and reattach it
				info.RemoveEventHandler(this, method);
				info.AddEventHandler(this, method);
			}
		}

		#region Methods
		public void ClearChangedProperties()
		{
			this.ChangedProperties.Clear();
		}

		internal void RemoveUnchangedProperties(XElement element)
		{
			const string AtomNamespace = "http://www.w3.org/2005/Atom";
			const string DataServicesNamespace = "http://schemas.microsoft.com/ado/2007/08/dataservices";
			const string DataServicesMetadataNamespace = DataServicesNamespace + "/metadata";

			if (null == element)
			{
				throw new ArgumentNullException("element");
			}

			List<XElement> properties = (from c in element.Elements(XName.Get("content", AtomNamespace)
												   ).Elements(XName.Get("properties", DataServicesMetadataNamespace)).Elements()
										 select c).ToList();

			foreach (XElement property in properties)
			{
				if (!this.ChangedProperties.Contains(property.Name.LocalName))
				{
					property.Remove();
				}
			}
		}

		private void OnEntityPropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
		{
			if (!this.ChangedProperties.Contains(e.PropertyName))
			{
				this.ChangedProperties.Add(e.PropertyName);
			}
		}
		#endregion
	}
}
//</snippetDataServiceContextExtensions>