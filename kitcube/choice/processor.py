from provider.datamgmt.models import Project

def get_context(request):
	projects = Project.objects.all()
	return {'projects': projects}



 
