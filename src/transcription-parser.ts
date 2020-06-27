import {ContentSegment, Segment, Sentence, SpeakerSegments, Transcript, Transcripts} from "./transcripts";

type Map = { items: { [key: string]: ContentSegment }, get: (segment: Segment) => ContentSegment };

function getSegments(transcript: Transcripts): Map {
    return {
        items: transcript.results.items.reduce(
            (map: { [key: string]: ContentSegment }, obj) => {
                map[obj.start_time as string + obj.end_time] = obj;
                return map;
            },
            {}),
        get(segment: Segment): ContentSegment {
            return this.items[segment.start_time as string + segment.end_time]
        }
    }
}

export function parse(transcript: Transcripts): Sentence[] {
    const segments = getSegments(transcript);

    //build list of sentences with speaker
    return transcript.results.speaker_labels.segments.reduce((sentences: Sentence[], c: SpeakerSegments) => {
        const segment = c.items.length > 0 ? c.items.map(it => segments.get(it)) : [segments.get(c)];

        if (sentences.length == 0 || sentences[sentences.length - 1].speaker_label !== c.speaker_label) {
            return [...sentences, {contentSegments: segment, speaker_label: c.speaker_label}]
        }
        sentences[sentences.length - 1].contentSegments.push(...segment)
        return sentences;
    }, [])


}
