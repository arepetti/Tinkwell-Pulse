import { callTinkwell, type ApiResponse } from "./api";
import { Tinkwell } from "./tinkwell";

export type MeasureValue =
  | { type: "undefined" }
  | { type: "number"; timestamp: Date; numberValue: number }
  | { type: "string"; timestamp: Date; stringValue: string };

export type Measure =  
    Omit<ApiMeasureDefinition, "type" | "attributes"> & Omit<ApiMeasureMetadata, "createdAt"> & {
        readonly isDerived: boolean;
        readonly isConstant: boolean;
        readonly type: Lowercase<ApiMeasureDefinition["type"]>;
        readonly createdAt: Date;
        readonly lastUpdatedAt: Date;
        readonly value: MeasureValue;
    }

export async function find(): Promise<ApiResponse<Measure[]>> {
    var response = await callTinkwell<ApiMeasure[]>(Tinkwell.store.methods.find);
    if (response.status === "success")
        return { ...response, data: translateMeasures(response.data) };

    return response;
}

type ApiMeasureDefinition = {
    readonly name: string;
    readonly attributes: number;
    readonly type: "NUMBER" | "STRING";
    readonly quantityType: string | undefined;
    readonly unit: string | undefined;
    readonly minimum?: number | null | undefined;
    readonly maximum?: number | null | undefined;
    readonly precision?: number | null | undefined;
}

type ApiMeasureMetadata = {
    readonly createdAt: string;
    readonly tags: string[];
    readonly description: string;
}

type ApiMeasureValue =
  | { timestamp: string; numberValue: number }
  | { timestamp: string; stringValue: string }
  | { timestamp: string };

type ApiMeasure = {
    readonly definition: ApiMeasureDefinition;
    readonly metadata: ApiMeasureMetadata;
    readonly value: ApiMeasureValue;
}

function translateMeasures(input: ApiMeasure[]): Measure[] {
    return input.map(translateMeasure);
}

function translateMeasure(input: ApiMeasure): Measure {
    return {
        name: input.definition.name,
        type: input.definition.type.toLowerCase() as Measure["type"],
        quantityType: input.definition.quantityType,
        unit: input.definition.unit,
        isConstant: (input.definition.attributes & 1) !== 0,
        isDerived: (input.definition.attributes & 2) !== 0,
        minimum: input.definition.minimum,
        maximum: input.definition.maximum,
        precision: input.definition.precision,
        createdAt: new Date(input.metadata.createdAt),
        description: input.metadata.description,
        tags: input.metadata.tags,
        lastUpdatedAt: !!input.value.timestamp ? new Date(input.value.timestamp) : new Date(0),
        value: translateValue(input.value),
    };
}

function translateValue(input: ApiMeasureValue): MeasureValue {
    if ("numberValue" in input)
        return { type: "number", timestamp: new Date(input.timestamp), numberValue: input.numberValue };

    if ("stringValue" in input)
        return { type: "string", timestamp: new Date(input.timestamp), stringValue: input.stringValue };

    return { type: "undefined" };
}