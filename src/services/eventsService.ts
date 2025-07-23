import { callTinkwell, subscribeTinkwell, type StreamMessageHandler } from "./api";
import { Tinkwell } from "./tinkwell";

export type SystemEvent = {
    readonly id: string;
    readonly correlationId: string;
    readonly timestamp: Date;
    readonly topic: string;
    readonly verb: string;
    readonly object: string;
    readonly payload?: string;
};

export type PublishEventRequest = Omit<SystemEvent, "id" | "correlationId" | "timestamp"> & {
    readonly correlationId?: string;
}

export type PublishEventResponse = {
    readonly id: string;
    readonly correlationId: string;
};

export function publish(request: PublishEventRequest) {
    return callTinkwell<PublishEventResponse>(
        Tinkwell.watchdog.methods.list,
        request,
    );
}

export async function subscribeTopic(topic: string, controller: AbortController, onMessage: StreamMessageHandler<SystemEvent>) {
    const handleMessage = (event: ApiSystemEvent) => {
        onMessage(translateEvent(event));
    }

    await subscribeTinkwell(Tinkwell.events.methods.subscribeTopic, { topic }, controller, handleMessage);
}

export async function subscribeAll(controller: AbortController, onMessage: StreamMessageHandler<SystemEvent>) {
    const handleMessage = (event: ApiSystemEvent) => {
        onMessage(translateEvent(event));
    }

    await subscribeTinkwell(Tinkwell.events.methods.subscribeMatching, { topic: "*" }, controller, handleMessage);
}

type ApiSystemEvent = Omit<SystemEvent, "timestamp"> & {
    readonly occurredAt: string;
}

function translateEvent(event: ApiSystemEvent): SystemEvent {
    return {
        ...event,
        timestamp: new Date(event.occurredAt)
    };
}