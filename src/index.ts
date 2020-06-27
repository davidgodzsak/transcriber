import * as transcript from '../steven.json';
import {ContentSegment, Sentence, Transcripts} from "./transcripts";
import {parse} from "./transcription-parser";


console.log(transcript as Transcripts);
const ups = transcript.results.speaker_labels.segments.filter(it => it.items.some(it2 => it2.speaker_label != it.speaker_label)); //this is not really needed
const sentences = parse(transcript as Transcripts);

//text formatters
const br = (it: any) => it + '</br>';

function writeFormatted(content: ContentSegment) {
    if (!content) {
        return `<span style="color: greenyellow">NOT FOUND</span>`
    }

    const red: number = 255 * (1 - (typeof content.alternatives[0].confidence === "string"
        ? parseFloat(content.alternatives[0].confidence)
        : content.alternatives[0].confidence))

    return `<span style="color: rgb(${red},0,0)" 
                  data-confidence="${content.alternatives[0].confidence}" 
                  data-alternatives="${content.alternatives.map(it => it.content).join(",")}">
                ${content.alternatives[0].content}
            </span>`
}

function writeWithSpeaker(sentence: Sentence): string {
    const text = sentence.contentSegments.map(writeFormatted).join(" ");
    let startTime = sentence.contentSegments[0].start_time;
    let endTime = sentence.contentSegments[sentence.contentSegments.length - 1].end_time;

    return `[<b>${sentence.speaker_label}</b> ${startTime} - ${endTime}] ${text} </br>`
}


//render page
function component() {
    const element = document.createElement('p');

    element.innerHTML = `Oi! </br></br>

<!--    <input id="file" type="file" />-->
    
    Number of words: ${br(transcript.results.transcripts[0].transcript.split(" ").length)} 
    Number of segments: ${br(transcript.results.items.length)}
    Number of labeled segments: ${br(transcript.results.speaker_labels.segments.reduce((acc, c) => acc + c.items.length, 0))}
    Speaker segments which contain item from other speakers: ${br(ups.length)} 
    
    </br>
    Transcription
    </br>
    </br>
    ${sentences.map(it => writeWithSpeaker(it)).join(" ")}
    `

    return element;
}

document.body.appendChild(component());
