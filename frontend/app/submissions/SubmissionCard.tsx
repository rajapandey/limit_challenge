import { Card, CardContent, Typography, Chip, Stack, Box } from '@mui/material';
import { memo } from 'react';
import Link from 'next/link';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/helper';
import { SubmissionCardProps } from '@/lib/types';

const SubmissionCard = memo(({ submission }: SubmissionCardProps) => (
  <Link href={`/submissions/${submission.id}`} style={{ textDecoration: 'none' }}>
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h6" sx={{ flex: 1 }}>
              {submission.company?.legalName}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={submission.status}
                color={getStatusColor(submission.status) as any}
                size="small"
              />
              <Chip
                label={submission.priority}
                color={getPriorityColor(submission.priority) as any}
                size="small"
              />
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Broker: {submission.broker?.name} | Owner: {submission.owner?.fullName}
          </Typography>

          <Typography variant="body2">
            {submission.summary}
          </Typography>

          {submission.latestNote && (
            <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                <strong>{submission.latestNote.authorName}:</strong> "{submission.latestNote.bodyPreview}"
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(submission.latestNote.createdAt)}
              </Typography>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              <Typography variant="caption" color="text.secondary">
                📄 {submission.documentCount} documents
              </Typography>
              <Typography variant="caption" color="text.secondary">
                💬 {submission.noteCount} notes
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(submission.createdAt)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </Link>
));

SubmissionCard.displayName = 'SubmissionCard';

export { SubmissionCard };
export default SubmissionCard;
