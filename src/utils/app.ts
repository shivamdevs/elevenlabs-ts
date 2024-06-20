import ElevenLabsAPI from "./api";

export default class ElevenLabs extends ElevenLabsAPI {
    constructor(apiKey: string, voice_id?: string) {
        super(apiKey, voice_id);
    }
}
