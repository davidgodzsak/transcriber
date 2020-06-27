export type TranscriptsStatus = 'COMPLETED';

export interface Transcripts {
    jobName: string,
    accountId: string,
    results: Results,
    status: TranscriptsStatus
}

export interface Results {
    transcripts: Transcript[],
    speaker_labels: SpeakerLabels,
    items: ContentSegment[]
}

export interface Transcript {
    transcript: string;
}

export interface SpeakerLabels {
    speakers: number;
    segments: SpeakerSegments[];
}

export interface ContentSegment extends Segment {
    alternatives: ContentAlternative[];
    type: string;
}

export interface ContentAlternative {
    confidence: number | string,
    content: string
}

export interface SpeakerSegments extends Segment {
    speaker_label: string,
    items: SpeakerSegment[]
}

export interface SpeakerSegment extends Segment {
    speaker_label: string,
}

export interface Segment {
    start_time?: number | string,
    end_time?: number | string
}

export type Sentence = { contentSegments: ContentSegment[], speaker_label: string };

