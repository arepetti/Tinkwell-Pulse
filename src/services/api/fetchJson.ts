export type ApiResponse<T> =
    | ({ status: "success" } & { data: T; error: null })
    | ({ status: "error" } & { data: null; error: string });

export type StreamMessageHandler<T> = (message: T) => void;
export type StreamErrorHandler = (error: unknown, fatal: boolean) => void;

export async function fetchJson<T>(
    url: string,
    body: any = {},
): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
    });

    if (response.ok)
        return {
            status: "success",
            data: (await response.json()) as T,
            error: null,
        };

    return { status: "error", data: null, error: `HTTP ${response.status}` };
}

export async function fetchNdJson<T>(
    url: string,
    body: any = {},
): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return {
            status: "error",
            data: null,
            error: `HTTP ${response.status}`,
        };
    }

    if (!response.body) {
        return { status: "error", data: null, error: `Empty response` };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    const results = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Split by newline and parse complete lines
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // Keep incomplete line for next chunk

        for (const line of lines) {
            if (line.trim()) {
                try {
                    const obj = JSON.parse(line);
                    results.push(obj);
                } catch (e) {
                    console.warn("Invalid JSON line:", line);
                }
            }
        }
    }

    return { status: "success", data: results as T, error: null };
}

export function streamNdJson<T>(
    url: string,
    body: any = {},
    controller: AbortController,
    onMessage: StreamMessageHandler<T>,
    onError?: StreamErrorHandler,
) {
    (async () => {
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.body) {
                console.warn("No stream body available.");
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const obj = JSON.parse(line) as T;
                            onMessage(obj);
                        } catch (e) {
                            console.warn("Invalid JSON line:", line);
                            onError?.(e, false);
                        }
                    }
                }
            }
        } catch (e) {
            if (controller.signal.aborted) {
            } else {
                console.error("Stream error:", e);
                onError?.(e, true);
            }
        }
    })();
}