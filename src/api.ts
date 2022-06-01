import { TokenEndpointOptions, TokenEndpointResponse } from './global';
import { DEFAULT_AUTH0_CLIENT, DEFAULT_ENDPOINT_TOKEN } from "./constants"
import { getJSON } from './http';
import { createQueryParams } from './utils';

function getEndpointUrl(endpoint?: string, baseUrl?: string) {
  if (endpoint && endpoint.startsWith('http')) return endpoint

  return `${baseUrl || ''}${endpoint || DEFAULT_ENDPOINT_TOKEN}`
}

export async function oauthToken(
  {
    baseUrl,
    endpoint,
    timeout,
    audience,
    scope,
    auth0Client,
    useFormData,
    endpoints,
    ignore_nonce,
    ...options
  }: TokenEndpointOptions,
  worker?: Worker
) {
  const body = useFormData
    ? createQueryParams(options)
    : JSON.stringify(options);

  return await getJSON<TokenEndpointResponse>(
    getEndpointUrl(endpoint, baseUrl),
    timeout,
    audience || 'default',
    scope,
    {
      method: 'POST',
      body,
      headers: {
        'Content-Type': useFormData
          ? 'application/x-www-form-urlencoded'
          : 'application/json',
        'Auth0-Client': btoa(
          JSON.stringify(auth0Client || DEFAULT_AUTH0_CLIENT)
        )
      }
    },
    worker,
    useFormData
  );
}
