import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { useCallback, memo, useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { SubmissionStatus, SubmissionListFilters, FilterUpdate } from '@/lib/types';
import { STATUS_OPTIONS } from '@/lib/helper';
import { useDebounce } from '@/lib/hooks/useDebounce';
import SubmissionCard from './SubmissionCard';

interface SubmissionsPageContentProps { }

const SubmissionsPageContent = memo(({ }: SubmissionsPageContentProps) => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const status = (searchParams.get('status') as SubmissionStatus) || '';
  const broker_id = searchParams.get('broker_id') || '';
  const company_search = searchParams.get('company_search') || '';
  const page = searchParams.get('page') || '';
  const created_from = searchParams.get('created_from') || '';
  const created_to = searchParams.get('created_to') || '';
  const has_documents = searchParams.get('has_documents') === 'true';
  const has_notes = searchParams.get('has_notes') === 'true';

  const [localCompanySearch, setLocalCompanySearch] = useState(company_search);

  const filters: SubmissionListFilters = useMemo(() => ({
    status: status || undefined,
    broker_id: broker_id || undefined,
    company_search: company_search || undefined,
    page: page || undefined,
    created_from: created_from || undefined,
    created_to: created_to || undefined,
    has_documents: has_documents || undefined,
    has_notes: has_notes || undefined,
  }), [status, broker_id, company_search, page, created_from, created_to, has_documents, has_notes]);

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const total = submissionsQuery.data?.count || 0;
  const start = (currentPage - 1) * 10 + 1;
  const end = Math.min(currentPage * 10, total);
  const rangeText = `${start}-${end} of ${total} submissions`;
  const displayText = `${rangeText}`;

  const updateFilters = (newFilters: FilterUpdate) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = useCallback((key: string, value: string | boolean) => {
    const stringValue = typeof value === 'boolean' ? (value ? 'true' : '') : value;
    updateFilters({ [key]: stringValue });
  }, [updateFilters]);

  const debouncedUpdate = useDebounce((value: string) => {
    handleFilterChange('company_search', value);
    //Also we can cache the value in the redux
  }, 300);

  const debouncedCompanyChange = (value: string) => {
    setLocalCompanySearch(value);
    debouncedUpdate(value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    handleFilterChange('page', page.toString());
  };

  const handleClearAllFilters = () => {
    updateFilters({
      status: '',
      broker_id: '',
      company_search: '',
      created_from: '',
      created_to: '',
      has_documents: '',
      has_notes: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  select
                  label="Status"
                  value={status}
                  onChange={(e) => handleFilterChange('status', e.target.value as SubmissionStatus | '')}
                  fullWidth
                  aria-label="Filter submissions by status"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Broker"
                  value={broker_id}
                  onChange={(event) => handleFilterChange('broker_id', event.target.value)}
                  fullWidth
                  helperText="Populate options via /api/brokers"
                  aria-label="Filter submissions by broker"
                >
                  <MenuItem value="">All brokers</MenuItem>
                  {brokerQuery.data?.map((broker) => (
                    <MenuItem key={broker.id} value={String(broker.id)}>
                      {broker.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Company search"
                  value={localCompanySearch}
                  onChange={(e) => debouncedCompanyChange(e.target.value)}
                  fullWidth
                  helperText="Send as ?company_search=..."
                  aria-label="Search submissions by company name"
                  InputProps={{
                    endAdornment: localCompanySearch && (
                      <IconButton
                        onClick={() => {
                          setLocalCompanySearch('');
                          handleFilterChange('company_search', '');
                        }}
                        size="small"
                        aria-label="Clear company search"
                      >
                        <Clear />
                      </IconButton>
                    ),
                  }}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Created From"
                  type="date"
                  value={created_from}
                  onChange={(e) => handleFilterChange('created_from', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  helperText="Filter submissions created after this date"
                />
                <TextField
                  label="Created To"
                  type="date"
                  value={created_to}
                  onChange={(e) => handleFilterChange('created_to', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  helperText="Filter submissions created before this date"
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={has_documents}
                        onChange={(e) => handleFilterChange('has_documents', e.target.checked)}
                      />
                    }
                    label="Has Documents"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={has_notes}
                        onChange={(e) => handleFilterChange('has_notes', e.target.checked)}
                      />
                    }
                    label="Has Notes"
                  />
                </FormGroup>
                <Box sx={{ ml: 'auto' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={handleClearAllFilters}
                    color="secondary"
                    size="small"
                    aria-label="Clear all filters"
                  >
                    Clear All Filters
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Submission list</Typography>

              {submissionsQuery.isLoading && (
                <Typography color="text.secondary">Loading submissions...</Typography>
              )}

              {submissionsQuery.isError && (
                <Typography color="error">
                  Error loading submissions: {submissionsQuery.error?.message || 'Unknown error'}
                </Typography>
              )}

              {submissionsQuery.isSuccess && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {displayText}
                  </Typography>

                  {submissionsQuery.data?.results?.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} />
                  ))}
                </Box>
              )}

              {!submissionsQuery.isLoading && !submissionsQuery.isError && (!submissionsQuery.data?.results?.length) && (
                <Typography color="text.secondary">No submissions found</Typography>
              )}

              {submissionsQuery.isSuccess && submissionsQuery.data?.count && submissionsQuery.data.count > 10 && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={Math.ceil((submissionsQuery.data.count || 0) / 10)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
});

SubmissionsPageContent.displayName = 'SubmissionsPageContent';

export default SubmissionsPageContent;
