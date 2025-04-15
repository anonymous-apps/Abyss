import { Check, Loader2, LucideIcon, PlayIcon, TerminalIcon, X } from 'lucide-react';
import React, { useState } from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { MonospaceText } from '../../content/MonospaceText/MonospaceText';
import Button from '../../inputs/Button';

export type ToolCallStatus = 'idle' | 'running' | 'complete' | 'failed';

export interface ActionItem {
    /**
     * Icon for the action item
     */
    icon: LucideIcon;
    /**
     * Tooltip text for the action item
     */
    tooltip: string;
    /**
     * Click handler for the action item
     */
    onClick: () => void;
}

export interface ChatToolCallProps {
    /**
     * Name of the tool being called
     */
    toolName: string;
    /**
     * Status of the tool call
     */
    status: ToolCallStatus;
    /**
     * Input data for the tool (raw JSON)
     */
    inputData: any;
    /**
     * Output text from the tool execution
     */
    outputText?: string;
    /**
     * Handler for invoking the tool
     */
    onInvoke?: () => void;
    /**
     * Action items to display alongside the tool call
     */
    actionItems?: ActionItem[];
    /**
     * Additional CSS class names
     */
    className?: string;
}

export const ChatToolCall: React.FC<ChatToolCallProps> = ({
    toolName,
    status,
    inputData,
    outputText = '',
    onInvoke,
    actionItems = [],
    className = '',
}) => {
    const [viewMode, setViewMode] = useState<'input' | 'output' | null>('input');
    const canInvoke = status === 'idle';
    const isRunning = status === 'running';
    const isError = status === 'failed';
    const isComplete = status === 'complete';

    const formatToolName = (name: string) => {
        return name.split('-').join(' ');
    };

    return (
        <div className={`relative rounded overflow-hidden my-2 w-full ${className}`}>
            <div className="flex items-start">
                <div className={`flex-grow pr-12`}>
                    <div
                        className={`
                            flex items-center justify-between border rounded-t-lg p-2 bg-background-100 text-text-300 border-background-400 z-10 relative 
                            text-sm
                            ${viewMode === null ? 'rounded-b-lg' : ''}
                        `}
                    >
                        <div className="flex items-center gap-2 capitalize">
                            {isRunning && <Loader2 size={18} className="animate-spin text-primary-500" />}
                            {isError && <X size={18} className="text-red-500" />}
                            {canInvoke && <TerminalIcon className="w-4 h-4" />}
                            {isComplete && <Check size={18} className="text-green-500" />}
                            <span>{formatToolName(toolName)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                className={`px-2 py-1 text-xs rounded ${
                                    viewMode === 'input' ? 'border border-primary-500 bg-primary-100 text-primary-500' : ''
                                }`}
                                onClick={() => setViewMode(viewMode === 'input' ? null : 'input')}
                            >
                                Input
                            </button>
                            <button
                                className={`px-2 py-1 text-xs rounded ${
                                    viewMode === 'output' ? 'border border-primary-500 bg-primary-100 text-primary-500' : ''
                                } ${!outputText ? 'opacity-50' : ''}`}
                                onClick={() => setViewMode(viewMode === 'output' ? null : 'output')}
                                disabled={!outputText && status !== 'running'}
                            >
                                Output
                            </button>
                        </div>
                    </div>
                    {viewMode === 'input' && (
                        <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: '500px' }}>
                            <div className="border border-background-400 text-sm bg-background-200 p-2 rounded-b-lg overflow-auto max-h-[500px] -translate-y-2 pt-4">
                                <JsonView src={inputData} />
                            </div>
                        </div>
                    )}
                    {viewMode === 'output' && (
                        <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: '500px' }}>
                            <div className="border border-background-400 p-2 bg-background-200 rounded-b-lg overflow-auto max-h-[500px] -translate-y-2 pt-4">
                                {outputText ? (
                                    <MonospaceText text={outputText} />
                                ) : (
                                    <div className="italic text-text-400">
                                        {status === 'running' ? 'Execution in progress...' : 'No output available'}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {canInvoke && onInvoke && (
                        <div className="mt-1">
                            <Button onClick={onInvoke} icon={PlayIcon} variant="secondary">
                                Invoke Tool
                            </Button>
                        </div>
                    )}
                </div>
                {actionItems.length > 0 && (
                    <div className="flex flex-col gap-1 px-1 absolute right-1 top-1">
                        {actionItems.map((action, index) => (
                            <Button key={index} variant="secondary" icon={action.icon} tooltip={action.tooltip} onClick={action.onClick} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatToolCall;
