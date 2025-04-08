export enum StreamParserState {
    Text = 'Text',
    InsideObject = 'InsideObject',
    InsideData = 'InsideData',
}

export const Keys = {
    CDATAStart: '<![CDATA[',
    CDATAEnd: ']]>',
};
export const Regex = {
    ObjectTagStartPartial: /^<[\w-]*$/,
    ObjectTagStartFull: /^<[\w-]+>/,
    ObjectTagStartCapture: /^<([\w-]+)>/,
    ObjectTagEndPartial: /^<\/[\w-]*$/,
    ObjectTagEndFull: /^<\/[\w-]+>/,
    ObjectTagEndCapture: /^<\/([\w-]+)>/,
    DataTagEndFull: /\]\]>/,
    DataTagEndPartial: /\]\>/,
};
