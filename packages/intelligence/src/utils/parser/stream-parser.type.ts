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
    ObjectTagStartPartial: /^</,
    ObjectTagStartFull: /^<\w+>/,
    ObjectTagStartCapture: /^<(\w+)>/,
    ObjectTagEndPartial: /^<\//,
    ObjectTagEndFull: /^<\/\w+>/,
    ObjectTagEndCapture: /^<\/(\w+)>/,
    DataTagEndFull: /\]\]>/,
    DataTagEndPartial: /\]\>/,
};
