from django.db import models

class TaskConstants(models.Model):
    class Status(models.IntegerChoices):
        TODO = 0, 'Todo'
        IN_PROGRESS = 1, 'In Progress'
        REVIEW = 2, 'Review'
        DONE = 3, 'Done'
    class Priority(models.IntegerChoices):
        LOW = 0, 'Low'
        MEDIUM = 1, 'Medium'
        HIGH = 2, 'High'