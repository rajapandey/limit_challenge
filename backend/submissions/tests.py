"""
Backend tests for the Submissions API.
Covers the key API behaviours: list, filters, detail, and broker dropdown.
"""
from django.test import TestCase
from rest_framework import status
from submissions.models import Broker, Company, Document, Note, Submission, TeamMember


class SubmissionAPITestCase(TestCase):
    def setUp(self):
        self.broker = Broker.objects.create(name="Acme Brokerage", primary_contact_email="acme@broker.com")
        self.other_broker = Broker.objects.create(name="Beta Brokerage")
        self.company = Company.objects.create(legal_name="Redwood Industries", industry="Finance")
        self.other_company = Company.objects.create(legal_name="Sapphire Technologies", industry="Tech")
        self.owner = TeamMember.objects.create(full_name="Jane Smith", email="jane@example.com")

        self.sub_new = Submission.objects.create(
            company=self.company, broker=self.broker, owner=self.owner,
            status="new", priority="high", summary="First submission"
        )
        self.sub_review = Submission.objects.create(
            company=self.other_company, broker=self.other_broker, owner=self.owner,
            status="in_review", priority="medium"
        )

    def test_list_returns_paginated_results_with_counts(self):
        """List endpoint returns paginated results including doc/note count annotations."""
        Document.objects.create(submission=self.sub_new, title="Report", doc_type="pdf")
        Note.objects.create(submission=self.sub_new, author_name="Alice", body="Looks good")

        response = self.client.get("/api/submissions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)
        row = next(r for r in response.data["results"] if r["id"] == self.sub_new.id)
        self.assertEqual(row["document_count"], 1)
        self.assertEqual(row["note_count"], 1)

    def test_filter_by_status(self):
        """status= filter returns only submissions with that status (case-insensitive)."""
        response = self.client.get("/api/submissions/?status=NEW")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["status"], "new")

    def test_filter_by_broker_and_company_search(self):
        """broker_id and company_search filters can be combined."""
        response = self.client.get(
            f"/api/submissions/?broker_id={self.other_broker.id}&company_search=sapphire"
        )
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["broker"]["name"], "Beta Brokerage")

    def test_detail_returns_full_related_data(self):
        """Detail endpoint returns contacts, documents, and notes; 404 for unknown id."""
        Note.objects.create(submission=self.sub_new, author_name="Bob", body="Detail note")
        response = self.client.get(f"/api/submissions/{self.sub_new.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["notes"]), 1)
        self.assertEqual(response.data["notes"][0]["author_name"], "Bob")

        missing = self.client.get("/api/submissions/99999/")
        self.assertEqual(missing.status_code, status.HTTP_404_NOT_FOUND)

    def test_broker_list_and_health_check(self):
        """Broker list returns all brokers; health check returns ok."""
        broker_resp = self.client.get("/api/brokers/")
        self.assertEqual(broker_resp.status_code, status.HTTP_200_OK)
        names = [b["name"] for b in broker_resp.data["results"]]
        self.assertIn("Acme Brokerage", names)
        self.assertIn("Beta Brokerage", names)

        health_resp = self.client.get("/api/health/")
        self.assertEqual(health_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(health_resp.json()["status"], "ok")
