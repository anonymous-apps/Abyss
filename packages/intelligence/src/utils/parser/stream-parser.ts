import { AsyncStream, ChatThread } from '../../constructs';
import { StreamedChatResponse } from '../../constructs/streamed-chat-response/chat-response';
import { LanguageModel } from '../../models/language-model';
import { Keys, Regex, StreamParserState } from './stream-parser.type';

interface Props {
    stream: AsyncStream<string>;
    model: LanguageModel;
    inputThread: ChatThread;
}

export class StreamParser {
    private stream: AsyncStream<string>;

    public chatResponse: StreamedChatResponse;

    private state: StreamParserState = StreamParserState.Text;
    private unprocessedCharacters: string = '';
    private scope: string[] = [];

    constructor(props: Props) {
        this.stream = props.stream;
        this.chatResponse = new StreamedChatResponse(props);
    }

    public async parse() {
        for await (const chunk of this.stream) {
            for (const character of chunk) {
                this.chatResponse.addText(character);
                this.unprocessedCharacters = this._consume(this.unprocessedCharacters + character) || '';
            }
        }
        this.chatResponse.complete();
    }

    private _consume(text: string): string | undefined {
        switch (this.state) {
            case StreamParserState.Text:
                if (Regex.ObjectTagStartFull.test(text)) {
                    return this.handleBeginTool(text);
                }
                if (Regex.ObjectTagStartPartial.test(text)) {
                    return text;
                }
                this.chatResponse.addTextToCurrentTextMessage(text);
                break;

            case StreamParserState.InsideObject:
                text = text.trim();
                if (text.length === 0) {
                    return undefined;
                }
                if (text.startsWith(Keys.CDATAStart)) {
                    return this.handleCDATABegin(text);
                }
                if (Regex.ObjectTagStartFull.test(text)) {
                    return this.handleEnterObject(text);
                }
                if (Regex.ObjectTagEndFull.test(text)) {
                    return this.handleExitObject(text);
                }

                if (Keys.CDATAStart.startsWith(text)) {
                    return text;
                }
                if (Regex.ObjectTagStartPartial.test(text)) {
                    return text;
                }
                if (Regex.ObjectTagEndPartial.test(text)) {
                    return text;
                }

                if (this.scope.length === 0) {
                    throw new Error('Tool calls must have keys. Direct data without keys is not allowed.');
                }

                const currentObjKeypath = this.scope.join('.');
                this.chatResponse.updateToolCall(currentObjKeypath, text);
                break;

            case StreamParserState.InsideData:
                if (text.startsWith(Keys.CDATAEnd)) {
                    return this.handleCDATAEnd(text);
                }
                if (Keys.CDATAStart.startsWith(text)) {
                    return text;
                }

                if (this.scope.length === 0) {
                    throw new Error('Tool calls must have keys. Direct data without keys is not allowed.');
                }

                const currentDataKeypath = this.scope.join('.');
                this.chatResponse.updateToolCall(currentDataKeypath, text);
                break;
        }
    }

    private handleBeginTool(text: string): string | undefined {
        const scopeName = text.match(Regex.ObjectTagStartCapture)?.[1];
        this.state = StreamParserState.InsideObject;
        this.chatResponse.startNewToolCall(scopeName!);
        return undefined;
    }

    private handleEnterObject(text: string): string | undefined {
        const scopeName = text.match(Regex.ObjectTagStartCapture)?.[1];
        this.state = StreamParserState.InsideObject;
        this.scope.push(scopeName!);
        return undefined;
    }

    private handleExitObject(text: string): string | undefined {
        if (this.scope.length === 0) {
            this.state = StreamParserState.Text;
        } else {
            this.scope.pop();
        }
        return undefined;
    }

    private handleCDATABegin(text: string): string | undefined {
        this.state = StreamParserState.InsideData;
        return undefined;
    }

    private handleCDATAEnd(text: string): string | undefined {
        this.state = StreamParserState.InsideObject;
        return undefined;
    }
}
