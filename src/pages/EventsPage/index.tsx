import React, { useCallback } from "react";
import EventList from "./EventList";
import { subscribeAll, type SystemEvent } from "@/services/eventsService";
import { useDebouncedMount } from "@/hooks/useDebouncedMount";

const EventsPage: React.FC = () => {
    const handleMessage = useCallback((event: SystemEvent) => {
        console.info(event);
    }, []);

    useDebouncedMount(() => {
        const controller = new AbortController();
        subscribeAll(controller, handleMessage);
        return () => {
            controller.abort();
        }
    });

    return <div>test</div>;
};

EventsPage.displayName = "EventsPage";
export default EventsPage;
