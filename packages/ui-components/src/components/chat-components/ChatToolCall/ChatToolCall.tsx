import { Check, ChevronDown, ChevronRight, Loader2, PlayIcon, TerminalIcon, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { MonospaceText } from '../../content/MonospaceText/MonospaceText';
import Button from '../../inputs/Button';
import type { ActionItem } from '../ChatMessageText';

export type ToolCallStatus = 'notStarted' | 'inProgress' | 'success' | 'failed';

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
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

    const canInvoke = status === 'notStarted';
    const isRunning = status === 'inProgress';
    const isError = status === 'failed';
    const isComplete = status === 'success';

    const formatToolName = (name: string) => {
        return name.split('-').join(' ');
    };

    const getStatusIcon = () => {
        if (isRunning) return <Loader2 className="w-4 h-4 animate-spin text-primary-500" />;
        if (isError) return <X className="w-4 h-4 text-red-500" />;
        if (isComplete) return <Check className="w-4 h-4 text-green-500" />;
        return <TerminalIcon className="w-4 h-4 text-text-500" />;
    };

    return (
        <div className={`relative w-full rounded text-xs ${className}`}>
            <div
                className={`flex items-center gap-2 py-2 px-2 text-text-500 bg-background-200 rounded-t cursor-pointer hover:bg-background-200`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {getStatusIcon()}
                <span className="capitalize flex-grow">{formatToolName(toolName)}</span>
                {isExpanded ? <ChevronDown className="w-3 h-3 text-text-400" /> : <ChevronRight className="w-3 h-3 text-text-400" />}
            </div>

            {isExpanded && (
                <div className=" relative overflow-hidden transition-all duration-300 ease-in-out border-background-300 w-full ">
                    <div className="flex items-center gap-4 mb-2 text-xs absolute top-2 right-2 bg-background-200 rounded-b p-1">
                        <span
                            className={`cursor-pointer ${activeTab === 'input' ? 'text-primary-500 font-medium' : 'text-text-400'}`}
                            onClick={() => setActiveTab('input')}
                        >
                            Input
                        </span>
                        <span
                            className={`cursor-pointer ${activeTab === 'output' ? 'text-primary-500 font-medium' : 'text-text-400'} 
                            ${!outputText && status !== 'inProgress' ? 'opacity-50' : ''}`}
                            onClick={() => (outputText || status === 'inProgress' ? setActiveTab('output') : null)}
                        >
                            Output
                        </span>
                    </div>

                    {activeTab === 'input' && (
                        <div className="border border-background-300 p-2 bg-background-200 overflow-auto max-h-[500px] w-full">
                            <JsonView src={inputData} />
                        </div>
                    )}

                    {activeTab === 'output' && (
                        <div className="border border-background-300 p-2 bg-background-200 overflow-auto max-h-[500px] w-full">
                            {outputText ? (
                                <MonospaceText text={outputText} />
                            ) : (
                                <div className="italic text-text-400">
                                    {status === 'inProgress' ? 'Execution in progress...' : 'No output available'}
                                </div>
                            )}
                        </div>
                    )}

                    {canInvoke && onInvoke && (
                        <div className="mt-2">
                            <Button onClick={onInvoke} icon={PlayIcon} variant="secondary">
                                Invoke Tool
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {actionItems.length > 0 && (
                <div className="w-full flex justify-end gap-1 z-10 pointer-events-auto">
                    {actionItems.map((action, index) => (
                        <Button
                            key={index}
                            variant="secondary"
                            icon={action.icon}
                            tooltip={action.tooltip}
                            onClick={action.onClick}
                            className="p-1 h-5 w-5 min-w-0 min-h-0 flex items-center justify-center"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatToolCall;
