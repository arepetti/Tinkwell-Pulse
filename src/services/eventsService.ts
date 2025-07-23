import { callTinkwell } from './api';
import { Tinkwell } from './tinkwell';

export type PublishEventRequest = {
  readonly topic: string;
  readonly verb: string;
  readonly object: string;
  readonly payload?: string;
  readonly correlationId?: string;
};


export type PublishEventResponse = {
  readonly id: string;
  readonly correlationId: string;
};

export function publish(request: PublishEventRequest) {
    return callTinkwell<PublishEventResponse>(Tinkwell.watchdog.methods.list, request);
}
