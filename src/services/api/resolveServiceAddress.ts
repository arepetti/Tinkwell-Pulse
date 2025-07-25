import { Tinkwell, type Services } from "./tinkwell";
import { fetchJson } from "./fetchJson";

// DEV_DISCOVERY_SERVICE_HOST is used only in development when we serve
// this app with "npm run dev" or "npm run preview" without being hosted by Tinkwell.
const HOST_DISCOVERY_SERVICE = "/api/v1/services";
const DEV_DISCOVERY_SERVICE_HOST = import.meta.env.VITE_DISCOVERY_SERVICE_ADDRESS;

export async function resolveServiceAddress(service: Services) {
    if (!cachedHosts[service]) {
        if (DEV_DISCOVERY_SERVICE_HOST)
            cachedHosts[service] = await queryDiscoveryService(service);
        else
            cachedHosts[service] = await queryHost(service);
    }

    return cachedHosts[service];
}

type DiscoveryFindReply = {
    readonly host: string;
    readonly url: string;
};

// Each service can be hosted on different machines (or the same machine but
// different instances of the web server, with different ports). To determine the address
// of each service we use the Discovery Service (of which we must know the default address)
// then we cache our findings, no need to search again for each call.
const cachedHosts: Partial<Record<Services, string>> = {};

async function queryHost(service: Services) {
    const response = await fetch(`${HOST_DISCOVERY_SERVICE}?name=${encodeURIComponent(Tinkwell[service].name)}`);
    if (!response.ok)
        return undefined;

    return await response.text();
}

async function queryDiscoveryService(service: Services) {
    const discoveryServicePath = Tinkwell.discovery.path;
    const discoveryServiceUrl = `${DEV_DISCOVERY_SERVICE_HOST}${discoveryServicePath}find`;
    const response = await fetchJson<DiscoveryFindReply>(
        discoveryServiceUrl,
        { name: Tinkwell[service].name },
    );

    return response.data?.host ?? "";
}
