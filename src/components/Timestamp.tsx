import { Tooltip } from "@mui/material";

export const Timestamp: React.FC<{ value: Date | null | undefined }> = ({
    value,
}) => {
    if (!value || value.getTime() === new Date(0).getTime()) {
        return "";
    }

    const fullDateStr = `${value.toLocaleDateString()} ${value.toLocaleTimeString()}`;
    let displayText = "";
    if (value.toDateString() === new Date().toDateString()) {
        displayText = value.toLocaleTimeString();
    } else {
        displayText = fullDateStr;
    }

    return (
        <Tooltip title={fullDateStr}>
            <time dateTime={value.toISOString()}>{displayText}</time>
        </Tooltip>
    );
};

Timestamp.displayName = "Timestamp";
export default Timestamp;
