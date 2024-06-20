import axios, { AxiosError, AxiosInstance } from "axios";
import ElevenLabsAudio from "./audio";
import ElevenLabsAPIError from "./error";
import { TextToSpeechAudio } from "../types";

axios.defaults.baseURL = "https://api.elevenlabs.io/v1";

export default class ElevenLabsAPI {
    #apiKey: string;
    #defaultVoiceId: string = "O652j0KnFYJNQnSLPj88";
    #baseURL: string = "https://api.elevenlabs.io/v1";

    #axios: AxiosInstance;

    constructor(apiKey: string, voice_id?: string) {
        this.#apiKey = apiKey;

        this.#axios = axios.create({
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": this.#apiKey,
            },
            baseURL: this.#baseURL,
        });

        if (voice_id) {
            this.#defaultVoiceId = voice_id;
        }
    }

    set apiKey(apiKey: string) {
        this.#apiKey = apiKey;
    }

    set defaultVoiceId(voice_id: string) {
        this.#defaultVoiceId = voice_id;
    }

    set baseURL(baseURL: string) {
        this.#baseURL = baseURL;
    }

    get defaultVoiceId() {
        return this.#defaultVoiceId;
    }

    get baseURL() {
        return this.#baseURL;
    }

    formatText(text: string, addPause: boolean = true) {
        if (addPause) {
            text = text.replace(/\. /g, '.\n" ", " ", " "\n');
        }

        return text;
    }

    async textToSpeech(
        text: string,
        {
            voice_id = this.#defaultVoiceId,
            addPause = true,
        }: Partial<{ voice_id: string; addPause: boolean }> = {}
    ) {
        text = this.formatText(text, addPause);

        try {
            const response = await this.#axios.post<TextToSpeechAudio>(
                `/text-to-speech/${voice_id}/with-timestamps`,
                {
                    text,
                    voice_id,
                }
            );

            return new ElevenLabsAudio(response.data);
        } catch (error) {
            const e = error as AxiosError<{
                detail: {
                    message: string;
                    status: string;
                };
            }>;
            throw new ElevenLabsAPIError(
                e.response?.data.detail.status || e.message,
                e.response?.data
            );
        }
    }
}
