export default class ElevenLabsAPIError extends Error {
    error: unknown;

    constructor(message: string, error: unknown) {
        super(message);

        this.error = error;
        this.name = "ElevenLabsAPIError";
    }
}
