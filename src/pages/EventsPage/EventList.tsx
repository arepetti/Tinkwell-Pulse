import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Container,
} from "@mui/material";
import type { SystemEvent } from "@/services/eventsService";
import Timestamp from "@/components/Timestamp";

export interface IResourceUsageTableProps {
    data: SystemEvent[];
}

const EventList: React.FC<IResourceUsageTableProps> = ({ data }) => (
    <TableContainer component={Container}>
        <Table sx={{ minWidth: 650 }}>
            <TableHead>
                <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Verb</TableCell>
                    <TableCell>Object</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((ev) => (
                    <TableRow key={ev.id}>
                        <TableCell>
                            <Timestamp value={ev.timestamp} />
                        </TableCell>
                        <TableCell>{ev.topic}</TableCell>
                        <TableCell>{ev.subject}</TableCell>
                        <TableCell>{ev.verb}</TableCell>
                        <TableCell>{ev.object}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

EventList.displayName = "EventList";
export default EventList;
