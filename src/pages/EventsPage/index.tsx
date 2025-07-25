import React, { useCallback, useState } from "react";
import EventList from "./EventList";
import { subscribeAll, type SystemEvent } from "@/services/eventsService";
import { useDebouncedMount } from "@/hooks/useDebouncedMount";

const HISTORY_LENGTH = 64;

export const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<SystemEvent[]>([]);
    const handleMessage = useCallback((event: SystemEvent) => {
        setEvents(old => prependEvent(old, event))
    }, []);

    useDebouncedMount(() => {
        const controller = new AbortController();
        subscribeAll(controller, handleMessage);
        return () => {
            controller.abort();
        }
    });

    return <EventList data={events} />;
};

EventsPage.displayName = "EventsPage";
export default EventsPage;

function prependEvent(history: SystemEvent[], event: SystemEvent) {
    return [event, ...history].slice(-HISTORY_LENGTH)
}
