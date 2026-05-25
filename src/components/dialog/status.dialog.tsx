import {  StatusUpdateForm, type StatusUpdateFormProps} from "@/components/forms/status.form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react";

interface StatusUpdateDialogProps extends StatusUpdateFormProps {
    trigger: ReactNode;
}

export const StatusUpdateDialog = ({ status, onSubmit, trigger }: StatusUpdateDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Status Update</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to update the status.
                    </DialogDescription>
                </DialogHeader>
                <StatusUpdateForm status={status} onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    );
}
