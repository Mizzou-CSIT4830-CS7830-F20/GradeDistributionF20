# requirements.txt should have:
# beautifulsoup4==4.6.3
# firebase-admin


# test example:
#{
#  "prof": "WERGELES,NICKOLAS MICHA",
#  "user_id": "QkoNwRLciEcmNJ6hoi5tySUGoCy2"
#}

from bs4 import BeautifulSoup
#from google.cloud import firestore
import requests
import datetime
import json

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("put your service account JSON file here")
firebase_admin.initialize_app(cred)

URL = "https://musis1.missouri.edu/gradedist/mu_grade_dist_intro.cfm"
DISTRIBUTION_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded'
}

# call
def update(request):
    # OPTIONS
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    request_body = request.get_json()
    url_params = request.args
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    # check POST
    if request.method != "POST":
        return ('Resource not found', 404, headers)

    # validate
    if request_body and 'prof' in request_body and 'user_id' in request_body:
        prof_name = request_body['prof']
        user_id = request_body['user_id']
        #make sure you use a lowercase "c" here otherwise it will go to Google Cloud Firestore !!!!
        db = firestore.client()
        prof_query_results = list(db.collection('professors').where('name', '==', prof_name).stream())

        # exists
        if len(prof_query_results) > 0:
            prof_doc = prof_query_results[0].reference
            prof_id = prof_doc.id
            prof_doc.update({"trackedBy": firestore.ArrayUnion([user_id]), "updatedAt": datetime.datetime.now()})

        # doesn't exist
        else:
            prof_doc = db.collection('professors').document()
            prof_id = prof_doc.id
            prof_doc.set({"name": prof_name, "id": prof_id, "updatedAt": datetime.datetime.now(), "trackedBy": firestore.ArrayUnion([user_id])})
            classes_coll = prof_doc.collection('classes')
            form_data = {'vinstructor': prof_name}
            raw_html = requests.post(URL, data=form_data, headers=DISTRIBUTION_HEADERS).content
            soup = BeautifulSoup(raw_html, 'html.parser')
            dist_table = soup.find_all('table')[-2]
            rows = dist_table.find_all('tr')
            counter = 0
            for row in rows[1:]:
                tds = row.find_all('td')
                class_doc = classes_coll.document()
                class_obj = {}
                class_obj['dept'] = str(tds[0].getText()).strip()
                class_obj['title'] = str(tds[1].getText()).strip()
                class_obj['number'] = str(tds[2].getText()).strip()
                class_obj['section'] = int(tds[3].getText())
                class_obj['term'] = str(tds[4].getText()).strip()
                class_obj['instructor'] = prof_name
                class_obj['a'] = int(tds[7].getText())
                class_obj['b'] = int(tds[8].getText())
                class_obj['c'] = int(tds[9].getText())
                class_obj['d'] = int(tds[10].getText())
                class_obj['f'] = int(tds[11].getText())
                class_obj['avg'] = float(tds[12].getText())
                class_obj['updatedAt'] = datetime.datetime.now()
                class_obj['instructorId'] = prof_id
                class_obj['id'] = class_doc.id
                class_doc.set(class_obj)
                counter += 1

            # data for caller
            data = {
                'classesAdded': counter,
            }
            return (json.dumps(data), 200, headers)

    # default
    return ('Bad request.', 400, headers)
