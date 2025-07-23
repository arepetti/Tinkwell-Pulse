export type Services = "discovery" | "orchestrator" | "watchdog" | "store" | "events";

export type ServiceMemberInfo = {
    readonly $: Services;
    readonly $$: string;
    readonly stream?: "no" | "yes" | "infinite";
};

export type ServiceInfo = {
    readonly name: string;
    readonly path: string;
    readonly methods: Record<string, ServiceMemberInfo>;
};

export const Tinkwell: Record<Services, ServiceInfo> = {
    discovery: {
        path: '/v1/discovery/',
        name: "Tinkwell.Discovery",
        methods: { 
            "find": { $: "discovery", $$: "find" }
         }
    },
    orchestrator: {
        path: '/v1/orchestrator/',
        name: "Tinkwell.Orchestrator",
        methods: {
            "list": { $: "orchestrator", $$: "list" },
            "start": { $: "orchestrator", $$: "start" },
            "stop": { $: "orchestrator", $$: "stop" },
            "restart": { $: "orchestrator", $$: "restart" },
        }
    },
    watchdog: {
        path: '/v1/watchdog/',
        name: "Tinkwell.Watchdog",
        methods: {
            "list": { $: "watchdog", $$: "list" },
            "assess": { $: "watchdog", $$: "assess" },
        }
    },
    store: {
        path: '/v1/store/',
        name: "Tinkwell.Store",
        methods: {
            "find": { $: "store", $$: "find", stream: "yes" },
            "search": { $: "store", $$: "search", stream: "yes" },
            "update": { $: "store", $$: "update" },
            "set": { $: "store", $$: "set" },
            "subscribe": { $: "store", $$: "subscribe", stream: "infinite" },
        }
    },
    events: {
        path: '/v1/events/',
        name: "Tinkwell.EventsGateway",
        methods: {
            "publish": { $: "events", $$: "publish" },
            "subscribeTopic": { $: "events", $$: "subscribe-topic", stream: "infinite" },
            "subscribeMatching": { $: "events", $$: "subscribe-matching", stream: "infinite" },
        }
    },
};
