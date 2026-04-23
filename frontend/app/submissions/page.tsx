'use client';

import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Suspense } from 'react';
import SubmissionsPageContent from './SubmissionsPageContent';

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<Typography color="text.secondary">Loading...</Typography>}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" component="h1">
              Submissions
            </Typography>
            <Typography color="text.secondary">
              Filters update the query parameters and drive backend filtering. Hook these inputs to
              your API calls when you implement the actual data fetching.
            </Typography>
          </Box>

          <Card variant="outlined">
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <SubmissionsPageContent />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Suspense>
  );
}
