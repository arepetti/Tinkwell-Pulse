import { Tinkwell, type ServiceMemberInfo } from "./tinkwell";
import { fetchJson, fetchNdJson, streamNdJson, type ApiResponse, type StreamErrorHandler, type StreamMessageHandler } from "./fetchJson";
import { resolveServiceAddress } from "./resolveServiceAddress";

export { type ApiResponse, type StreamMessageHandler, type StreamErrorHandler };
export * from "./tinkwell";

export async function callTinkwell<T>(
    method: ServiceMemberInfo,
    body: any = {},
): Promise<ApiResponse<T>> {
    if (method.stream === undefined || method.stream === "no")
        return await fetchJson(await urlFor(method), body);

    if (method.stream === "yes")
        return await fetchNdJson(await urlFor(method), body);

    throw Error("Infinite streaming is not supported by callTinkwell(), use subscribeTinkwell() instead.");
}

export async function subscribeTinkwell<T>(
    method: ServiceMemberInfo,
    body: any = {},
    controller: AbortController,
    onMessage: StreamMessageHandler<T>,
    onError?: StreamErrorHandler,
): Promise<void> {
    if (method.stream === undefined || method.stream === "no")
        throw Error("Non streamed responses are not supported by  subscribeTinkwell(), use callTinkwell() instead.");

    streamNdJson(await urlFor(method), body, controller, onMessage, onError);
}

async function urlFor(method: ServiceMemberInfo) {
    const serviceName = method.$;
    const methodName = method.$$;
    const host = await resolveServiceAddress(serviceName);
    return `${host}${Tinkwell[serviceName].path}${methodName}`;
}
