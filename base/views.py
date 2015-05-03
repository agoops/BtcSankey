from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader
from helper import *
from blockchain import blockexplorer
import json
from django.views.decorators.csrf import csrf_exempt

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
	address = request.POST.get('address')
	# '1FFRuJT7xiBZ5xN25VGzxdKWgZdxXgjAJp'
	template = loader.get_template('selfloop.html')
	jsonString = getSankey(address)
	context = RequestContext(request, {'jsonString': jsonString})
	return HttpResponse(template.render(context))

@csrf_exempt
def build(request):
	if request.method == 'POST':
		graphString = request.POST.get('graphString')
		address = request.POST.get('address')
		print ''
		print address
		print graphString
		print ''

		edge_factory = EdgeFactory()
		edges = []

		graphObj = json.loads(graphString)
		nodes = graphObj['nodes']
		for i in range(len(nodes)):
			name = nodes[i]['name']
			edge_factory.node_index_map[name] = i

		edge_factory.node_counter = len(nodes)

		links = graphObj['links']
		for l in links:
			source_index = l['source']
			target_index = l['target']
			weight = l['value']
			edge = Edge(s='onthefly', t='onthefly', w=weight, si=source_index, ti=target_index)
			edges.append(edge)

		# need to pass in already explored addresses also
		exploredAddresses = set()
		newGraphString = buildSankey(exploredAddresses, edge_factory, edges, address)
		print exploredAddresses
		return HttpResponse(newGraphString)
	else:
		return HttpResponse('NOPE!')

def buildSankey(exploredAddresses, edge_factory, edges, address):
	address_string = address
	address_object = blockexplorer.get_address(address_string)
	transactions = address_object.transactions
	unexploredAddresses = {}
	for t in transactions:
		inputs = t.inputs
		outputs = t.outputs
		createLeavingEdges(exploredAddresses, unexploredAddresses, edge_factory, edges, address_string, inputs, outputs)
		createIncomingEdges(exploredAddresses, unexploredAddresses, edge_factory, edges,address_string,inputs,outputs)

	exploredAddresses.add(address_string)
	result = printSankeyInfo(edge_factory, edges)
	return result

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



