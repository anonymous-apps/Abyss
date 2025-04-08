// Allways use objects stored in seperate types file for all props and interfaces
import { MyBusinessLogicMethodResult } from "./types.ts";

/**
 * @description Descriptions for utility usage and what its goal is in the system
 */
export function myUtilityMethod(): MyBusinessLogicMethodResult {
    return _myUtilityMethod2();
}

// For helper methods that are not exported, use a leading underscore and don't add a description
function _myUtilityMethod2(): MyBusinessLogicMethodResult {
    return "Hello, world!";
}
