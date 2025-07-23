import { Tooltip } from "@mui/material";

export const Timestamp: React.FC<{ value: Date | null | undefined }> = ({ value }) => {
  if (!value || value == new Date(0)) {
    return "";
  }

  const fullDateStr = `${value.toLocaleDateString()} ${value.toLocaleTimeString()}`;
  let str = "";
  if (value.toDateString() === new Date().toDateString())
    str = value.toLocaleTimeString();
  else
    str = fullDateStr;

  return (
    <Tooltip title={fullDateStr}>
      <time dateTime={value.toISOString()}>{str}</time>
    </Tooltip>
  );
};

Timestamp.displayName = "Timestamp";
export default Timestamp;