import {Transcripts} from "./transcripts";

declare module "*.json"
{
    const transcripts: Transcripts;
    export default transcripts;
}
