// Test files match .test.ts and are stored in the same directory as sidecar files
// Use vitest for testing

import { MyControllerClass } from "./example-class-file";

// We want a top level describe for the class

describe("MyControllerClass", () => {
    // Then inside it, we want a describe for each public method as to test its usage

    describe("myBusinessLogicMethod", () => {
        // Then we want to conciously test all happy cases, edge cases and unhappy cases
        // Use clear labels

        it("[Happy] when ... we expect ...", () => {
            // We prefer to define data inline rather than use @beforeEach or @afterEach
            const object = new MyControllerClass({
                myProp: "test",
                myProp2: 1,
            });

            const result = object.myBusinessLogicMethod({
                myProp: "test",
                myProp2: 1,
            });

            expect(result).toBe("Hello, world!");
        });

        it("[Edge] when ... we expect ...", () => {
            //  ....
        });

        it("[Unhappy] should throw an error when ...", () => {
            //  ....
        });
    });

    // We may have many methods, many it blocks, and one top level describe
});
