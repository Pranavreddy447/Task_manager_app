from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # 👈 Add this line
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.filter(owner = self.request.user)
        print(self.request)
        is_completed = self.request.query_params.get('completed')

        if is_completed is not None:
            if is_completed.lower() == 'true':
                queryset = queryset.filter(is_completed=True)
            elif is_completed.lower() == 'false':
                queryset = queryset.filter(is_completed=False)

        return queryset

    def perform_create(self, serializer):
        # Automatically associate the task with the logged-in user
        serializer.save(owner=self.request.user)
