from rest_framework.response import Response
from rest_framework import status
from .models import Program
from .serializers import ProgramSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from .serializers import ProgramSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView, DestroyAPIView, CreateAPIView, RetrieveAPIView




class ProgramAPIView(CreateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({"detail": f"{serializer.data['title']} program has been created."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def program_add(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)




class ProgramDetailView(RetrieveAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk' 


class ProgramEditView(RetrieveUpdateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'
    
    


from rest_framework.response import Response
from rest_framework import status

class ProgramDeleteView(DestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]  # Adjust permissions as needed

    def delete(self, request, *args, **kwargs):
        program = self.get_object()
        title = program.title
        program.delete()
        return Response({"detail": f"Program {title} has been deleted."}, status=status.HTTP_204_NO_CONTENT)
   