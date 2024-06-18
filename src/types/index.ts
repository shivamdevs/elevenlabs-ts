export interface TextToSpeechAudio {
    audio_base64: string;
    alignment: TextToSpeechAlignment;
    normalized_alignment: TextToSpeechAlignment;
}

export interface TextToSpeechAlignment {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
}
