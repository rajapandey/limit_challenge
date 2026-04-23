'use client';

import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSubmissionDetail } from '@/lib/hooks/useSubmissions';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/helper';

export default function SubmissionDetailPage() {

  const params = useParams<{ id: string }>();
  const submissionId = params?.id ?? '';
  const detailQuery = useSubmissionDetail(submissionId);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div>
            <Typography variant="h4">Submission Detail</Typography>
            <Typography color="text.secondary">
              Complete information for this submission including contacts, documents, and notes.
            </Typography>
          </div>
          <MuiLink component={Link} href="/submissions" underline="none">
            Back to list
          </MuiLink>
        </Box>

        {detailQuery.isLoading && (
          <Typography color="text.secondary">Loading submission details...</Typography>
        )}

        {detailQuery.isError && (
          <Typography color="error">
            Error loading submission: {detailQuery.error?.message || 'Unknown error'}
          </Typography>
        )}

        {detailQuery.isSuccess && detailQuery.data && (
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
            {/* Summary Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Summary Information
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Company</Typography>
                  <Typography variant="h6">{detailQuery.data.company?.legalName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {detailQuery.data.company?.industry} • {detailQuery.data.company?.headquartersCity}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">Broker</Typography>
                  <Typography variant="body1">{detailQuery.data.broker?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {detailQuery.data.broker?.primaryContactEmail}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">Owner</Typography>
                  <Typography variant="body1">{detailQuery.data.owner?.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {detailQuery.data.owner?.email}
                  </Typography>
                </Box>

                <Box display="flex" gap={1} flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Typography
                    variant="body2"
                    color={getStatusColor(detailQuery.data.status) + '.main' as any}
                    fontWeight="bold"
                  >
                    {detailQuery.data.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Priority:</Typography>
                  <Typography
                    variant="body2"
                    color={getPriorityColor(detailQuery.data.priority) + '.main' as any}
                    fontWeight="bold"
                  >
                    {detailQuery.data.priority}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">Summary</Typography>
                  <Typography variant="body1">{detailQuery.data.summary}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">Created</Typography>
                  <Typography variant="body2">{formatDate(detailQuery.data.createdAt)}</Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Contacts Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contacts ({detailQuery.data.contacts?.length || 0})
              </Typography>
              <Stack spacing={2}>
                {detailQuery.data.contacts?.map((contact) => (
                  <Box key={contact.id}>
                    <Typography variant="body1" fontWeight="medium">
                      {contact.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.phone}
                    </Typography>
                    <Divider />
                  </Box>
                ))}
                {(!detailQuery.data.contacts?.length) && (
                  <Typography variant="body2" color="text.secondary">
                    No contacts available
                  </Typography>
                )}
              </Stack>
            </Paper>

            {/* Documents Section */}
            <Paper sx={{ p: 3, gridColumn: '1 / -1' }}>
              <Typography variant="h6" gutterBottom>
                Documents ({detailQuery.data.documents?.length || 0})
              </Typography>
              <Stack spacing={2}>
                {detailQuery.data.documents?.map((document) => (
                  <Box key={document.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {document.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {document.docType}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(document.uploadedAt)}
                        </Typography>
                        {document.fileUrl && (
                          <MuiLink href={document.fileUrl} target="_blank" underline="none">
                            View Document
                          </MuiLink>
                        )}
                      </Box>
                    </Box>
                    <Divider />
                  </Box>
                ))}
                {(!detailQuery.data.documents?.length) && (
                  <Typography variant="body2" color="text.secondary">
                    No documents available
                  </Typography>
                )}
              </Stack>
            </Paper>

            {/* Notes Section */}
            <Paper sx={{ p: 3, gridColumn: '1 / -1' }}>
              <Typography variant="h6" gutterBottom>
                Notes ({detailQuery.data.notes?.length || 0})
              </Typography>
              <Stack spacing={2}>
                {detailQuery.data.notes?.map((note) => (
                  <Box key={note.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="body1" fontWeight="medium">
                        {note.authorName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(note.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {note.body}
                    </Typography>
                    <Divider />
                  </Box>
                ))}
                {(!detailQuery.data.notes?.length) && (
                  <Typography variant="body2" color="text.secondary">
                    No notes available
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
