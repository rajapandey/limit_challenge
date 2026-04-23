import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';


jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/submissions',
  useParams: () => ({ id: '1' }),
}));

jest.mock('@/lib/hooks/useSubmissions', () => ({
  useSubmissionsList: () => ({
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      count: 2,
      results: [
        {
          id: 1,
          status: 'new',
          priority: 'high',
          summary: 'First submission',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          company: { id: 1, legalName: 'Redwood Industries', industry: 'Finance', headquartersCity: 'NYC' },
          broker: { id: 1, name: 'Acme Brokerage', primaryContactEmail: 'acme@broker.com' },
          owner: { id: 1, fullName: 'Jane Smith', email: 'jane@example.com' },
          documentCount: 3,
          noteCount: 1,
          latestNote: { authorName: 'Alice', bodyPreview: 'Looks promising', createdAt: '2024-01-15T09:00:00Z' },
        },
        {
          id: 2,
          status: 'closed',
          priority: 'low',
          summary: 'Second submission',
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-01-10T08:00:00Z',
          company: { id: 2, legalName: 'Sapphire Technologies', industry: 'Tech', headquartersCity: 'SF' },
          broker: { id: 2, name: 'Beta Brokerage', primaryContactEmail: null },
          owner: { id: 1, fullName: 'Jane Smith', email: 'jane@example.com' },
          documentCount: 0,
          noteCount: 0,
          latestNote: null,
        },
      ],
    },
  }),
  useSubmissionDetail: () => ({
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      id: 1,
      status: 'new',
      priority: 'high',
      summary: 'First submission',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      company: { id: 1, legalName: 'Redwood Industries', industry: 'Finance', headquartersCity: 'NYC' },
      broker: { id: 1, name: 'Acme Brokerage', primaryContactEmail: 'acme@broker.com' },
      owner: { id: 1, fullName: 'Jane Smith', email: 'jane@example.com' },
      contacts: [{ id: 1, name: 'Bob Jones', role: 'CFO', email: 'bob@corp.com', phone: '123' }],
      documents: [{ id: 1, title: 'Policy Doc', docType: 'pdf', uploadedAt: '2024-01-15T10:00:00Z', fileUrl: 'https://example.com/doc.pdf' }],
      notes: [{ id: 1, authorName: 'Alice', body: 'Great opportunity.', createdAt: '2024-01-15T09:00:00Z' }],
    },
  }),
}));

jest.mock('@/lib/hooks/useBrokerOptions', () => ({
  useBrokerOptions: () => ({
    data: [
      { id: 1, name: 'Acme Brokerage', primaryContactEmail: 'acme@broker.com' },
    ],
  }),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

import SubmissionsPageContent from '../../app/submissions/SubmissionsPageContent';
import SubmissionCard from '../../app/submissions/SubmissionCard';
import SubmissionDetailPage from '../../app/submissions/[id]/page';

const mockSubmission = {
  id: 1,
  status: 'new' as const,
  priority: 'high' as const,
  summary: 'A test submission',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  company: { id: 1, legalName: 'Redwood Industries', industry: 'Finance', headquartersCity: 'NYC' },
  broker: { id: 1, name: 'Acme Brokerage', primaryContactEmail: 'acme@broker.com' },
  owner: { id: 1, fullName: 'Jane Smith', email: 'jane@example.com' },
  documentCount: 2,
  noteCount: 1,
  latestNote: { authorName: 'Alice', bodyPreview: 'Looks promising', createdAt: '2024-01-14T09:00:00Z' },
};

describe('SubmissionCard', () => {
  it('renders company name, status chip, broker, and note preview', () => {
    render(<SubmissionCard submission={mockSubmission} />);
    expect(screen.getByText('Redwood Industries')).toBeInTheDocument();
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText(/Acme Brokerage/)).toBeInTheDocument();
    expect(screen.getByText(/Looks promising/)).toBeInTheDocument();
    expect(screen.getByText(/2 documents/)).toBeInTheDocument();
  });

  it('renders without crashing when latestNote is null', () => {
    const submission = { ...mockSubmission, latestNote: null, noteCount: 0 };
    render(<SubmissionCard submission={submission} />);
    expect(screen.getByText('Redwood Industries')).toBeInTheDocument();
    expect(screen.queryByText(/Looks promising/)).not.toBeInTheDocument();
  });
});

describe('SubmissionsPageContent', () => {
  it('renders submission list with filter controls', () => {
    render(<SubmissionsPageContent />);
    expect(screen.getByLabelText(/filter submissions by status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter submissions by broker/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/search submissions by company name/i)).toBeInTheDocument();
  });

  it('shows both submission results from the mocked query', () => {
    render(<SubmissionsPageContent />);
    expect(screen.getByText('Redwood Industries')).toBeInTheDocument();
    expect(screen.getByText('Sapphire Technologies')).toBeInTheDocument();
  });
});

describe('SubmissionDetailPage', () => {
  it('renders contacts, documents, and notes sections from mocked detail query', () => {
    render(<SubmissionDetailPage />);
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Policy Doc')).toBeInTheDocument();
    expect(screen.getByText('Great opportunity.')).toBeInTheDocument();
  });
});
