from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from .models import Task
from .serializers import TaskSerializer
import uuid

class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.filter(assignee=self.request.user)
        status = self.request.query_params.get('status')

        if status is not None:
            queryset = queryset.filter(status=status)

        return queryset

    def get_object(self):
        """
        Fetch a task by numeric id or UUID.
        """
        queryset = self.get_queryset()
        lookup_value = self.kwargs.get('pk')  # DRF default

        # Try numeric ID first
        try:
            return queryset.get(id=int(lookup_value))
        except (ValueError, Task.DoesNotExist):
            pass  # fall through to UUID

        # Try UUID
        try:
            task_uuid = uuid.UUID(str(lookup_value))  # safely convert string to UUID
            return queryset.get(uuid=task_uuid)
        except (ValueError, Task.DoesNotExist):
            raise NotFound(detail="Task not found")

    def perform_create(self, serializer):
        serializer.save(assignee=self.request.user)

    def perform_destroy(self, instance):
        """Custom logic before deletion, safe print"""
        print(f"Deleting task {instance.id} / UUID: {getattr(instance, 'uuid', None)} for user {self.request.user}")
        instance.delete()
