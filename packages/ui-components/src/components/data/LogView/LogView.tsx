import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

export interface LogEntry {
    level: string;
    startTime: string;
    scope: string;
    message: string;
    metadata?: Record<string, any>;
}

interface LogViewProps {
    logs: LogEntry[];
    className?: string;
}

export const LogView: React.FC<LogViewProps> = ({ logs, className = '' }) => {
    const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

    const toggleLog = (index: number) => {
        const newExpanded = new Set(expandedLogs);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedLogs(newExpanded);
    };

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'error':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            case 'info':
                return 'text-blue-500';
            case 'debug':
                return 'text-gray-500';
            default:
                return 'text-text-300';
        }
    };

    const formatTime = (time: string) => {
        const date = new Date(time);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    if (!logs || logs.length === 0) {
        return <div className="text-text-700 p-4 text-center">No logs available</div>;
    }

    return (
        <div className={`w-full rounded-sm ${className} p-2 bg-background-100`}>
            <div className="space-y-1">
                {logs.map((log, index) => (
                    <div key={index} className="transition-all duration-200 rounded-sm text-sm">
                        <div
                            className={`p-2 flex items-center gap-4 cursor-pointer hover:bg-background-200 transition-colors ${
                                expandedLogs.has(index) ? 'bg-background-200' : ''
                            }`}
                            onClick={() => toggleLog(index)}
                        >
                            <span className="text-text-700 text-xs w-20 text-right">{formatTime(log.startTime)}</span>
                            <span className={`font-medium opacity-70 ${getLevelColor(log.level)} text-left`}>{log.level}</span>
                            <span className="text-text-700  truncate">{log.scope}</span>
                            <span className="text-text-300 flex-1 truncate">{log.message}</span>

                            {expandedLogs.has(index) ? (
                                <ChevronDown className="w-4 h-4 text-text-300 transition-transform duration-200" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-text-300 transition-transform duration-200" />
                            )}
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-200 ${
                                expandedLogs.has(index) ? 'max-h-[500px]' : 'max-h-0'
                            }`}
                        >
                            {log.metadata && (
                                <div className="p-2 bg-background-300 border-t border-background-200">
                                    <pre className="text-xs text-text-300 whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogView;
