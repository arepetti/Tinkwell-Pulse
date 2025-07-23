import React, { useEffect } from "react";
import EventList from "./EventList";

const EventsPage: React.FC = () => {
    useEffect(() => {}, []);

    return <EventList data={null!} />;
};

EventsPage.displayName = "EventsPage";
export default EventsPage;
