import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Container } from '@mui/material';
import type { Measure } from '@/services/storeService';

export interface IResourceUsageTableProps {
  data: Measure[];
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
          <TableCell>Payload</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((m) => (
          <TableRow key={m.name}>
            <TableCell component="th" scope="row">
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

EventList.displayName = "EventList";
export default EventList;
