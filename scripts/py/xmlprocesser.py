import xml.sax
import csv
import json

nodeset = set()
nodemap = {}
count = 1

with open('example_traveltime.csv','r') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        nodeset.add(row[0])
        nodeset.add(row[1])

class NodesHandler(xml.sax.ContentHandler):
    def startElement(self,name,attrs):
        global count;
        global nodemap;
        global nodeset;
        if name == "node":
            id = attrs["id"]
            if id in nodeset:
                lat = attrs["lat"]
                lon = attrs["lon"]
                nodeset.remove(id)
                nodemap[id] = [lat,lon]
                print(count)
                count += 1

parser = xml.sax.make_parser()
parser.setContentHandler(NodesHandler())
parser.parse(open("new-york-latest.osm","r",encoding='utf-8'))

# Write the result
jsonstr = json.dumps(nodemap)
with open('nodes.js','w') as file:
    file.write('var nodes = '+jsonstr+';')
