import {ContentAlternative, ContentSegment, Segment, Sentence, SpeakerSegments, Transcripts} from "./transcripts";

type Map = { items: { [key: string]: ContentSegment }, get: (segment: Segment) => ContentSegment };

function hasPunctuation(i: number, a: ContentSegment[]) {
    return i < a.length - 1 && !a[i + 1].start_time && !a[i + 1].end_time;
}

function addPunctuation(a: ContentSegment[], i: number) {
    return (it: ContentAlternative) => it.content = it.content + a[i + 1].alternatives[0].content;
}

function getSegments(transcript: Transcripts): Map {
    return {
        items: transcript.results.items.reduce(
            (map: { [key: string]: ContentSegment }, obj,i,a) => {
                // if next segment is punctuation
                // todo this is not the best solution, it should be added as a content segment into the speaker_labels
                if (hasPunctuation(i, a)) {
                     obj.alternatives.forEach(addPunctuation(a, i))
                }
                map[obj.start_time as string + obj.end_time] = obj;
                return map;
            },
            {}),
        get(segment: Segment): ContentSegment {
            return this.items[segment.start_time as string + segment.end_time]
        }
    }
}

//todo this parse method could be rewritten as a zip function zip the speaker_labels with the result items one thing to consider is how to add punctiation
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
