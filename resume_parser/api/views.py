from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .utils import extract_text_from_pdf, extract_resume_fields

@api_view(['POST'])
def parse_resume(request):
    file = request.FILES.get('file')
    if file:
        text = extract_text_from_pdf(file)
        print(text)
        parsed_data = extract_resume_fields(text)
        return JsonResponse(parsed_data, safe=False)
    else:
        return JsonResponse({"error": "No file uploaded"}, status=400)
