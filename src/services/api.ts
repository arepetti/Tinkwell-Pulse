import { Tinkwell, type ServiceMemberInfo, type Services } from "./tinkwell";

const DISCOVERY_SERVICE_HOST = import.meta.env.VITE_DISCOVERY_SERVICE_ADDRESS;

export type ApiResponse<T> =
    | ({ status: "success" } & { data: T; error: null })
    | ({ status: "error" } & { data: null; error: string });

export async function callTinkwell<T>(
    method: ServiceMemberInfo,
    body: any = {},
): Promise<ApiResponse<T>> {
    // This could happen because methods are defined as Record<string, ServiceMemberInfo> then
    // any string is acceptable: Tinkwell.discovery.methods.not_a_real_method compiles but we
    // get an undefined object here.
    if (method === null || method === undefined)
        throw new Error("Invalid or unknown service method.");

    if (method.stream === undefined || method.stream === "no")
        return await fetchJson(await urlFor(method), body);

    if (method.stream === "yes")
        return await fetchNdJson(await urlFor(method), body);

    throw Error("Infinite streaming is not supported yet");
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

async function urlFor(method: ServiceMemberInfo) {
    const serviceName = method.$;
    const methodName = method.$$;
    const host = await resolveServiceAddress(serviceName);
    return `${host}${Tinkwell[serviceName].path}${methodName}`;
}

async function resolveServiceAddress(service: Services) {
    // If not already resolved then query the Discovery Service
    if (!cachedHosts[service]) {
        const discoveryServicePath = Tinkwell.discovery.path;
        const discoveryServiceUrl = `${DISCOVERY_SERVICE_HOST}${discoveryServicePath}find`;
        const response = await fetchJson<DiscoveryFindReply>(
            discoveryServiceUrl,
            { name: Tinkwell[service].name },
        );
        cachedHosts[service] = response.data?.host ?? DISCOVERY_SERVICE_HOST;
    }

    return cachedHosts[service];
}

async function fetchJson<T>(
    url: string,
    body: any = {},
): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
    });

    if (response.ok)
        return {
            status: "success",
            data: (await response.json()) as T,
            error: null,
        };

    return { status: "error", data: null, error: `HTTP ${response.status}` };
}

async function fetchNdJson<T>(
    url: string,
    body: any = {},
): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return {
            status: "error",
            data: null,
            error: `HTTP ${response.status}`,
        };
    }

    if (response?.body === null) {
        return { status: "error", data: null, error: `Empty response` };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    const results = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Split by newline and parse complete lines
        const lines = buffer.split("\n");
        buffer = lines.pop()!; // Keep incomplete line for next chunk

        for (const line of lines) {
            if (line.trim()) {
                try {
                    const obj = JSON.parse(line);
                    results.push(obj);
                } catch (e) {
                    console.warn("Invalid JSON line:", line);
                }
            }
        }
    }

    return { status: "success", data: results as T, error: null };
}
