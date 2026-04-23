import django_filters

from submissions import models


class SubmissionFilterSet(django_filters.FilterSet):
    """Basic filter set for the submissions list endpoint.

    Only the status filter is implemented so the candidate can extend the
    remaining filters (broker, company search, optional extras, etc.).
    """

    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")
    broker_id = django_filters.NumberFilter(field_name="broker__id")
    company_search = django_filters.CharFilter(field_name="company__legal_name", lookup_expr="icontains")
    created_from = django_filters.DateFilter(field_name="created_at", lookup_expr="gte")
    created_to = django_filters.DateFilter(field_name="created_at", lookup_expr="lte")
    has_documents = django_filters.BooleanFilter(method="filter_has_documents")
    has_notes = django_filters.BooleanFilter(method="filter_has_notes")

    def filter_has_documents(self, queryset, name, value):
        if value is True:
            return queryset.filter(documents__isnull=False).distinct()
        elif value is False:
            return queryset.filter(documents__isnull=True).distinct()
        return queryset

    def filter_has_notes(self, queryset, name, value):
        if value is True:
            return queryset.filter(notes__isnull=False).distinct()
        elif value is False:
            return queryset.filter(notes__isnull=True).distinct()
        return queryset

    class Meta:
        model = models.Submission
        fields = ["status", "broker_id", "company_search", "created_from", "created_to", "has_documents", "has_notes"]

