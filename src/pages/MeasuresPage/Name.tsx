import { Tooltip, Typography, Stack, Badge } from "@mui/material";
import NumberTypeIcon from "@mui/icons-material/Sensors";
import StringTypeIcon from "@mui/icons-material/Abc";
import type { Measure } from "@/services/storeService";
import { pascalToTitle } from "./utils";

export const Name: React.FC<{ measure: Measure }> = ({ measure }) => {
    let description = "";

    if (measure.description) {
        description += "\n" + measure.description;
    }

    if (measure.tags.length !== 0) {
        description += "\n" + measure.tags.join(", ");
    }

    let attributesColor: React.ComponentProps<typeof Badge>["color"] = "primary";
    let attributesDescription = pascalToTitle(measure.type);
    if (measure.isConstant) {
        attributesColor = "success";
        attributesDescription += " (constant)";
    } else if (measure.isDerived) {
        attributesColor = "secondary";
        attributesDescription += " (derived)";
    }

    return (
        <Stack direction="row" spacing={1}>
            <Tooltip title={attributesDescription}>
                <Badge color={attributesColor} variant="dot">
                    {measure.type === "number" ? (
                        <NumberTypeIcon />
                    ) : (
                        <StringTypeIcon />
                    )}
                </Badge>
            </Tooltip>
            <Tooltip title={description}>
                <Typography>{measure.name}</Typography>
            </Tooltip>
        </Stack>
    );
};

Name.displayName = "Name";
export default Name;
