import { PutObjectCommand } from "@aws-sdk/client-s3";
import { uuidName } from "../lib/uuid";
import { TextToSpeechAlignment, TextToSpeechAudio } from "../types";

export default class ElevenLabsAudio {
    #audio: TextToSpeechAudio;
    #buffer: Buffer;

    key: string = uuidName(true);
    extension: string = "mp3";

    noOfChannels: number = 1;
    sampleRate: number = 44100;

    name: string;
    size: number;
    duration: number;

    alignment: TextToSpeechAlignment;
    normalized_alignment: TextToSpeechAlignment;

    mime: string = "audio/mpeg";

    constructor(audio: TextToSpeechAudio) {
        this.#audio = audio;
        this.alignment = this.#audio.alignment;
        this.normalized_alignment = this.#audio.normalized_alignment;

        this.#buffer = Buffer.from(this.#audio.audio_base64, "base64");

        this.name = `${this.key}.mp3`;
        this.size = this.#buffer.length;

        this.duration =
            this.normalized_alignment.character_end_times_seconds.at(-1) ||
            this.size / (this.noOfChannels * this.sampleRate);
    }

    set fileName(name: string) {
        this.name = name;
    }

    get fileName() {
        return this.name;
    }

    get audio_base64() {
        return this.#audio.audio_base64;
    }

    get buffer() {
        return this.#buffer;
    }

    s3_key?: string;

    putObjectCommand(
        bucket: string,
        key: string = `test`,
        prefix: string = ""
    ) {
        this.s3_key = `${key}${key.endsWith("/") ? "" : "/"}${prefix ? `${prefix}-` : ""}${this.name}`;
        return new PutObjectCommand({
            Bucket: bucket,
            Key: this.s3_key,
            Body: this.buffer,
            ContentType: this.mime,
        });
    }
}
