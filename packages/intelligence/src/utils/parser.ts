export function BestEffortJsonParser(input: string) {
    const firstCurly = input.indexOf('{');
    const lastCurly = input.lastIndexOf('}');
    const json = input.substring(firstCurly, lastCurly + 1);
    try {
        return JSON.parse(json);
    } catch (e) {
        try {
            return eval('(' + json + ')');
        } catch (e) {
            return undefined;
        }
    }
}
