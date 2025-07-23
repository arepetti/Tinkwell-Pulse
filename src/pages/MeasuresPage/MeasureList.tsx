import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Container,
} from "@mui/material";
import type { Measure } from "@/services/storeService";
import Timestamp from "@/components/Timestamp";
import Name from "./Name";
import Value from "./Value";
import { pascalToTitle } from "./utils";

export interface IMeasureListProps {
    data: Measure[];
}

const MeasureList: React.FC<IMeasureListProps> = ({ data }) => (
    <TableContainer component={Container}>
        <Table sx={{ minWidth: 650 }}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Minimum</TableCell>
                    <TableCell>Maximum</TableCell>
                    <TableCell>Created at</TableCell>
                    <TableCell>Last updated at</TableCell>
                    <TableCell>Value</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((m) => (
                    <TableRow key={m.name}>
                        <TableCell component="th" scope="row">
                            <Name measure={m} />
                        </TableCell>
                        <TableCell>{pascalToTitle(m.quantityType)}</TableCell>
                        <TableCell>{pascalToTitle(m.unit)}</TableCell>
                        <TableCell>{m.minimum}</TableCell>
                        <TableCell>{m.maximum}</TableCell>
                        <TableCell>
                            <Timestamp value={m.createdAt} />
                        </TableCell>
                        <TableCell>
                            <Timestamp value={m.lastUpdatedAt} />
                        </TableCell>
                        <TableCell>
                            <Value value={m.value} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

MeasureList.displayName = "MeasureList";
export default MeasureList;
