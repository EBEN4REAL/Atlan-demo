export const downloadMetadata = {
    template: `
  
    <EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="{{audienceUrl}}">
      <SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="false"
              protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol urn:oasis:names:tc:SAML:1.1:protocol http://schemas.xmlsoap.org/ws/2003/07/secext">
          <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="{{redirectUrl}}"/>
          <NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
          </NameIDFormat>
          <AssertionConsumerService
                  Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="{{redirectUrl}}"
                  index="1" isDefault="true" />
      </SPSSODescriptor>
    </EntityDescriptor>
  
    `,
}

const googleDefaultConfig = {
    displayName: 'Sign in with Google',
    attributeList: [
        {
            userAttr: 'email',
            idpAttr: 'email',
            isSystem: true,
        },
        {
            userAttr: 'firstName',
            idpAttr: 'firstName',
            isSystem: true,
        },
        {
            userAttr: 'lastName',
            idpAttr: 'lastName',
            isSystem: true,
        },
    ],
}
const oktaDefaultConfig = {
    displayName: 'Sign in with Okta',
    attributeList: [
        {
            userAttr: 'email',
            idpAttr: 'email',
            isSystem: true,
        },
        {
            userAttr: 'firstName',
            idpAttr: 'firstName',
            isSystem: true,
        },
        {
            userAttr: 'lastName',
            idpAttr: 'lastName',
            isSystem: true,
        },
    ],
}
const azureDefaultConfig = {
    displayName: 'Sign in with Microsoft',
    attributeList: [
        {
            userAttr: 'email',
            idpAttr: 'email',
            isSystem: true,
        },
        {
            userAttr: 'firstName',
            idpAttr: 'firstName',
            isSystem: true,
        },
        {
            userAttr: 'lastName',
            idpAttr: 'lastName',
            isSystem: true,
        },
    ],
}
const jumpCloudDefaultConfig = {
    displayName: 'Sign in with JumpCloud',
    attributeList: [
        {
            userAttr: 'email',
            idpAttr: 'email',
            isSystem: true,
        },
        {
            userAttr: 'firstName',
            idpAttr: 'firstName',
            isSystem: true,
        },
        {
            userAttr: 'lastName',
            idpAttr: 'lastName',
            isSystem: true,
        },
    ],
}

export const customSAMLDefaultConfig = {
    displayName: 'Login with SAML',
    attributeList: [
        {
            userAttr: 'email',
            idpAttr: 'email',
            isSystem: true,
        },
        {
            userAttr: 'firstName',
            idpAttr: 'firstName',
            isSystem: true,
        },
        {
            userAttr: 'lastName',
            idpAttr: 'lastName',
            isSystem: true,
        },
    ],
}

export const topSAMLProviders = [
    {
        title: 'Google',
        alias: 'google',
        isCustomSaml: false,
        image: '/logo/google-icon.png',
        ctaText: {
            default: 'Add',
        },
        defaultConfig: {
            ...googleDefaultConfig,
        },
        samlAssertionUrlSuffix: '/broker/google/endpoint',
        serviceProviderMetadata: [
            {
                label: 'ACS URL',
                suffix: ['/broker/google/endpoint'],
            },
            {
                label: 'Entity ID',
                suffix: [''],
            },
        ],
    },
    {
        title: 'Azure AD',
        alias: 'azure',
        isCustomSaml: false,
        image: '/logo/microsoft.png',
        ctaText: {
            default: 'Add',
        },
        defaultConfig: {
            ...azureDefaultConfig,
        },
        samlAssertionUrlSuffix: '/broker/azure/endpoint/clients/atlan-saml',
        serviceProviderMetadata: [
            {
                label: 'Identifier (Entity ID)',
                suffix: [''],
            },
            {
                label: 'Reply URL (Assertion Consumer Service URL)',
                suffix: [
                    '/broker/azure/endpoint/clients/atlan-saml',
                    '/broker/azure/endpoint',
                ],
            },
        ],
    },
    {
        title: 'Okta',
        alias: 'okta',
        isCustomSaml: false,
        image: '/logo/okta2.png',
        ctaText: {
            default: 'Add',
        },
        defaultConfig: {
            ...oktaDefaultConfig,
        },
        samlAssertionUrlSuffix: '/broker/okta/endpoint/clients/atlan-saml',
        serviceProviderMetadata: [
            {
                label: 'Single sign on URL',
                suffix: ['/broker/okta/endpoint/clients/atlan-saml'],
            },
            {
                label: 'Audience URI (SP Entity ID)',
                suffix: [''],
            },
        ],
    },
    {
        title: 'Jumpcloud',
        alias: 'jumpcloud',
        isCustomSaml: false,
        image: '/logo/jumpcloud.png',
        ctaText: {
            default: 'Add',
        },
        defaultConfig: {
            ...jumpCloudDefaultConfig,
        },
        imageClass: 'w-8 h-5',
        samlAssertionUrlSuffix: '/broker/jumpcloud/endpoint/clients/atlan-saml',
        serviceProviderMetadata: [
            {
                label: 'IdP Entity ID',
                suffix: ['/broker/jumpcloud/endpoint'],
            },
            {
                label: 'SP Entity ID',
                suffix: [''],
            },
            {
                label: 'ACS URL',
                suffix: ['/broker/jumpcloud/endpoint/clients/atlan-saml'],
            },
        ],
    },
]
export const customSamlProvider = {
    title: 'SAML 2.0',
    alias: '', // False alias means it needs to be set
    isCustomSaml: true,
    ctaText: {
        default: 'Add',
    },
    samlAssertionUrlSuffix: '/endpoint/clients/atlan-saml',
    serviceProviderMetadata: [
        {
            label: 'Atlan SAML Assertion URL',
            suffix: ['/endpoint/clients/atlan-saml'],
        },
        {
            label: 'Atlan Audience URI (SP Entity ID)',
            suffix: [''],
        },
    ],
}

export const mapperList = [
    {
        userAttr: 'email',
        idpAttr: 'email',
        isSystem: true,
    },
    {
        userAttr: 'firstName',
        idpAttr: 'firstName',
        isSystem: true,
    },
    {
        userAttr: 'lastName',
        idpAttr: 'lastName',
        isSystem: true,
    },
]
