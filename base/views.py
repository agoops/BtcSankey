from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader
from helper import *
from blockchain import blockexplorer
import json

# Create your views here.


def index(request):
	template = loader.get_template('sankey.html')
	jsonString = getSankey('1DJv4wgJXCwK4m2BEmjg5P4meYKhKtcp9K')
	# print jsonString
	jsonObject = json.loads(jsonString)
	context = RequestContext(request, {'jsonObject': jsonObject, 'jsonString': jsonString})
	# return render(request, 'sankey.html')
	return HttpResponse(template.render(context))

def landing(request):
	template = loader.get_template('landing.html')
	context = RequestContext(request)
	return HttpResponse(template.render(context))


	
def loop(request):
	template = loader.get_template('selfloop.html')
	jsonString = getSankey('1LZpJP5zKGAXnH4SnJF98cVn7sBHJroViG')
	context = RequestContext(request, {'jsonString': jsonString})
	return HttpResponse(template.render(context))


def getSankey(address):
	unexploredAddresses = {}
	exploredAddresses = set()
	edges = []
	edge_factory = EdgeFactory()

	# address_string = popUnexploredAddress(unexploredAddresses)
	address_string = address
	address_object = blockexplorer.get_address(address_string)
	transactions = address_object.transactions
	for t in transactions:
		inputs = t.inputs
		outputs = t.outputs
		createLeavingEdges(exploredAddresses, unexploredAddresses, edge_factory, edges, address_string, inputs, outputs)
		createIncomingEdges(exploredAddresses, unexploredAddresses, edge_factory, edges,address_string,inputs,outputs)

	exploredAddresses.add(address_string)
	result = printSankeyInfo(edge_factory, edges)
	return result



