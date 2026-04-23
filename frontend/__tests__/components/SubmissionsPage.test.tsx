import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmissionsPage from '../../app/submissions/page';

jest.mock('../../app/submissions/SubmissionsPageContent', () => {
  return function MockSubmissionsPageContent() {
    return <div data-testid="submissions-page-content">Mock Submissions Content</div>;
  };
});

describe('SubmissionsPage', () => {
  it('renders the page title', () => {
    render(<SubmissionsPage />);
    expect(screen.getByRole('heading', { name: /submissions/i })).toBeInTheDocument();
  });
});
