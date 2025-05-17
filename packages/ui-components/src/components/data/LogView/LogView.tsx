import { ChevronDown, ChevronRight } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export interface LogEntry {
    timestamp: number;
    level: string;
    scope: string;
    message: string;
    data?: Record<string, any>;
}

interface LogViewProps {
    logs: LogEntry[];
    startTime: number;
    className?: string;
}

export const LogView: React.FC<LogViewProps> = ({ logs, startTime, className = '' }) => {
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

    const formatTime = (time: number) => {
        const sinceStart = time - startTime;
        const minutes = Math.floor(sinceStart / 60000);
        const seconds = Math.floor((sinceStart % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!logs || logs.length === 0) {
        return <div className="text-text-700 p-4 text-center">No logs available</div>;
    }

    return (
        <div className={`w-full rounded-sm ${className} p-2 bg-background-100 font-mono`}>
            <div className="space-y-1">
                {logs.map((log, index) => (
                    <div key={index} className="duration-200 rounded-sm text-xs">
                        <div
                            className={`p-2 flex items-center gap-4 cursor-pointer hover:bg-background-200 transition-colors ${
                                expandedLogs.has(index) ? 'bg-background-200' : ''
                            }`}
                            onClick={() => toggleLog(index)}
                        >
                            <span className="text-text-700 text-xs w-10 text-right">{formatTime(log.timestamp)}</span>
                            <span className={`font-medium opacity-70 ${getLevelColor(log.level)} text-left`}>{log.level}</span>
                            <span className="text-text-700  truncate">{log.scope}</span>
                            <span className="text-text-300 flex-1 truncate">{log.message}</span>

                            {expandedLogs.has(index) ? (
                                <ChevronDown className="w-4 h-4 text-text-300" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-text-300" />
                            )}
                        </div>
                        <div className={`overflow-auto  ${expandedLogs.has(index) ? 'max-h-[500px]' : 'max-h-0'}`}>
                            <div className="p-4 bg-background-300 border-t border-background-200 font-mono">
                                <pre className="text-xs text-text-300 whitespace-pre-wrap">{log.message}</pre>
                                {log.data && Object.keys(log.data).length > 0 && (
                                    <pre className="text-xs text-text-300 whitespace-pre-wrap mt-4">
                                        {JSON.stringify(log.data, null, 2)}
                                    </pre>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogView;
