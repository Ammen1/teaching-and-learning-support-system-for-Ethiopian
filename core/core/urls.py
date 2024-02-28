from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static


from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('account.urls')),
    # Add other paths as needed
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)