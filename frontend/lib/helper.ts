import { SubmissionStatus } from "./types";

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'new': return 'primary';
        case 'in_review': return 'warning';
        case 'closed': return 'success';
        case 'lost': return 'error';
        default: return 'default';
    }
};

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'default';
    }
};

export const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
    { label: 'All statuses', value: '' },
    { label: 'New', value: 'new' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Closed', value: 'closed' },
    { label: 'Lost', value: 'lost' },
];
