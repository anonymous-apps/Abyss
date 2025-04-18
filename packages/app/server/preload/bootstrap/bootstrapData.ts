import { ToolController } from '../controllers/tool';
import { UserSettingsController } from '../controllers/user-settings';

export const PrismaBoostrapper = {
    bootstrapDB: async () => {
        await ToolController.create({
            name: 'Propose NodeJs Tool',
            description: `
Allow the AI to write a new NodeJS script, save it to disk, and register it as an tool for future use. You will need to define a name for the tool, its source code, the expected key-value map of inputs, and a list of npm dependencies that need to be installed for your tool to work.

Format your code using module syntax like below:

<example>
// IMPORTS at top
import a from 'dep1'
import b from 'dep2'

// Type of whatever you need, but has to ultimately be a string record
interface InputType {
    [key: string]: string | InputType
}

// Will be automatically invoked when your tool is called
// MAKE SURE IT IS EXPORTED AS DEFAULT
export default function handler (input_object_matching_your_type: InputType) {
    // Will be provided back to the model when the tool is called
    return my_response
}
</example>
`,
            type: 'BUILD-NODE-TOOL',
            schema: {
                name: '2-3 words describing the tool',
                description: '1 sentence description of the tool',
                code: 'Raw Nodejs Source code as common js format as detailed in the example',
                inputs: {
                    parameter1:
                        'description of what this parameter is for, you can have many keys to describe all the inputs needed for the tool. All keys must be strings and the values will be strings. This means that if you need a number from the invoker you will have to convert it from a string to a number.',
                },
                dependencies:
                    'a comma separated list of npm dependencies that will be installed automaticallty before the script runs like axios, lodash, ect',
            },
        });
        await UserSettingsController.updateFirst({ bootstrapped: true });
    },
};
