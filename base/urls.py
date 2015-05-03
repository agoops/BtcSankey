from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.landing, name='landing'),
    # url(r'^index$', views.index, name='index'),
    url(r'^loop$', views.loop, name='loop'),
    url(r'^build$', views.build, name='build')
]