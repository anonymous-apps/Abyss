import { AsyncStream, ChatThread } from '../../constructs';
import { StreamedChatResponse } from '../../constructs/streamed-chat-response/chat-response';
import { LanguageModel } from '../../models/language-model';
import { LanguageModelStreamResult } from '../../models/types';
import { Keys, Regex, StreamParserState } from './stream-parser.type';

interface Props {
    stream: AsyncStream<string>;
    model: LanguageModel;
    inputThread: ChatThread;
    modelResponse: LanguageModelStreamResult;
}

export class StreamParser {
    private stream: AsyncStream<string>;

    public chatResponse: StreamedChatResponse;
    private state: StreamParserState = StreamParserState.Text;
    private unprocessedCharacters: string = '';
    private scope: string[] = [];

    constructor(props: Props) {
        this.stream = props.stream;
        this.chatResponse = new StreamedChatResponse({
            model: props.model,
            inputThread: props.inputThread,
            modelResponse: props.modelResponse,
        });
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
                const isWhitespace = text.trim() === '';
                const nonWhitespace = text.trim();

                if (isWhitespace) {
                    return text;
                }

                if (nonWhitespace.startsWith(Keys.CDATAStart)) {
                    return this.handleCDATABegin(nonWhitespace);
                }
                if (Regex.ObjectTagStartFull.test(nonWhitespace)) {
                    return this.handleEnterObject(nonWhitespace);
                }
                if (Regex.ObjectTagEndFull.test(nonWhitespace)) {
                    return this.handleExitObject(nonWhitespace);
                }

                if (Keys.CDATAStart.startsWith(nonWhitespace)) {
                    return text;
                }
                if (Regex.ObjectTagStartPartial.test(nonWhitespace)) {
                    return text;
                }
                if (Regex.ObjectTagEndPartial.test(nonWhitespace)) {
                    return text;
                }

                if (this.scope.length === 0) {
                    throw new Error('Tool calls must have keys. Direct data without keys is not allowed.');
                }

                const currentObjKeypath = this.scope.join('.');
                this.chatResponse.updateToolCall(currentObjKeypath, text);
                break;

            case StreamParserState.InsideData:
                const isWhitespace2 = text.trim() === '';
                const nonWhitespace2 = text.trim();

                if (isWhitespace2) {
                    return text;
                }

                if (nonWhitespace2.startsWith(Keys.CDATAEnd)) {
                    return this.handleCDATAEnd(nonWhitespace2);
                }
                if (Keys.CDATAStart.startsWith(nonWhitespace2)) {
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
