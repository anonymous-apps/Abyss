import { PromptTemplate } from '@abyss/prompts';
import { SystemErrorPartial } from '@abyss/records';

export const systemErrorPrompt = new PromptTemplate<SystemErrorPartial>()
    .addHeader3(params => `Error: ${params.payloadData.error}`)
    .addText('An error occured while processing something. This may be relevant to you, or it may not.')
    .addText(params => params.payloadData.message)
    .addText(params => params.payloadData.body);
