"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

interface ErrorProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    className?: string; // Added so you can adjust padding/margins from the parent
}

export function Error({
    title = "Something went wrong",
    description = "An unexpected error occurred while trying to load this content. Please try again.",
    onRetry,
    className
}: ErrorProps) {
    return (
        <Alert variant="destructive" className={`w-full ${className}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
            {onRetry && (
                <AlertAction className="ml-auto">
                    <Button variant="outline" size="sm" onClick={onRetry}>
                        <RefreshCcw className="h-4 w-4" />
                        Retry
                    </Button>
                </AlertAction>
            )}
        </Alert>
    );
}