from django.test import TestCase
from rest_framework import status
from submissions.models import Broker, Company, TeamMember, Submission


class SubmissionAPITestCase(TestCase):
    def setUp(self):
        self.broker = Broker.objects.create(name="Test Broker")
        self.company = Company.objects.create(legal_name="Test Company")
        self.team_member = TeamMember.objects.create(full_name="John Doe", email="john@test.com")
        self.submission = Submission.objects.create(
            company=self.company,
            broker=self.broker,
            owner=self.team_member,
            status="new",
            priority="high"
        )

    def test_submissions_list_endpoint(self):
        """Test the submissions list API endpoint"""
        response = self.client.get('/api/submissions/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['company']['legal_name'], 'Test Company')
