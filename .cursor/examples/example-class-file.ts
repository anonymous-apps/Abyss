// Allways use objects stored in seperate types file for all props and interfaces
import { MyCustomError } from "./errors.ts";
import { MyBusinessLogicMethodProps, MyBusinessLogicMethodResult, MyControllerClassProps } from "./types.ts";

/**
 * @description Descriptions for class usage and what its goal is in the system
 */
export class MyControllerClass {
    // Properties are readonly as much as possible
    private readonly myProp: string;
    private readonly myProp2: number;

    constructor(props: MyControllerClassProps) {
        this.myProp = props.myProp;
        this.myProp2 = props.myProp2;
    }

    //
    // Break down methods into sections
    // Utilities
    //

    private _myUtilityMethod(): MyBusinessLogicMethodResult {
        return "Hello, world!";
    }

    //
    // Public methods
    //

    /**
     * @description All public methods should have a description of what it does
     */
    public myBusinessLogicMethod(props: MyBusinessLogicMethodProps): MyBusinessLogicMethodResult {
        return this._myUtilityMethod();
    }

    /**
     * @description Business logic method that throws an error
     * @throws {MyCustomError} When an error condition is met
     */
    public myBusinessLogicMethod2(): void {
        // Always use custom errors defined in a seperate file
        throw new MyCustomError("An error occurred during business logic execution");
    }
}
