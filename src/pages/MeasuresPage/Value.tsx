import type { MeasureValue } from '@/services/storeService';

export const Value: React.FC<{ value: MeasureValue }> = ({ value }) => {
    if (value.type === "undefined")
        return "";

    return value.type === "number" ? value.numberValue : value.stringValue;
};

Value.displayName = "Value";
export default Value;
