from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
import random

app = Flask(__name__)
CORS(app)

CLASS_NAMES = ['Healthy', 'Red Spider Mite', 'Rust']
CLASS_NAMES_RW = ['Neza', 'Ubwukunzi', 'Isigiire']

def get_disease_info(predicted_idx):
    """Get disease information"""
    diseases = [
        {
            'disease': 'Healthy',
            'diseaseRw': 'Neza',
            'severity': 'mild',
            'affected_area': 5,
            'action': 'Continue monitoring',
            'actionRw': 'Komeza gukurikirana',
            'instructions': 'Monitor regularly\nMaintain pruning',
            'instructionsRw': 'Suza amababi akenshi',
            'alternative': 'Preventive fungicides',
            'alternativeRw': 'Inzira y\'urugo',
            'cost': 'Low'
        },
        {
            'disease': 'Red Spider Mite',
            'diseaseRw': 'Ubwukunzi',
          from flask import Flask, request, jsonify
from flask_cors imp          'action': 'Apply acaricide spray',import base64
from io impoKwfrom io impoa'from PIL import Imagectimns': 'Spray every 7-
app = FlaskgetCORS(app)

Ces',
     
CLASS_NinsCLASS_NAMES_RW = ['Neza', 'Ubwukunzi', 'Isigiire']
al
def get_diseNatural predators',
            'altern    """Get disease informati             diseases = [
        {
               {
      '        :             'diseaseRw': 'Neza', '            'severity': 'mild',y'            'affected_area': 5te            'action': 'Continuon            'actionRw': 'Komeza gukurikiranon            'instructions': 'Monitor regularlns            'instructionsRw': 'Suza amababi akenshi',
           es            'alternative': 'Preventive fungicides',
'u            'alternativeRw': 'Inzira y\'urugo',
  id            'cost': 'Low'
        },
        {',        },
        {
   5-        {   }
    ]
             'diseaseRw': 'Ubwukunzi',
  ro          from flask import Flask, rhefrom flask_cors imp          'action': 'Apply acar',from io impoKwfrom io impoa'from PIL import Imagectimns': 'Spray every 7-
a'/app = FlaskgetCORS(app)

Ces',
     
CLASS_NinsCLASS_NAMES_ if 'image' in 
Ces',
     
CLASS_Nin       leCLASeqal
def get_diseNatural predators',
            'altern    "m)dco            'altern    """Get es        {
               {
      '        :             'diseaseRw': 'N i                '        ma           es            'alternative': 'Preventive fungicides',
'u            'alternativeRw': 'Inzira y\'urugo',
  id            'cost': 'Low'
        },
        {',        },
        {
   5-        {   }
    ]
             'diseaseRw': 'Ubwukunzi',
  ro          from flask import Flask, rti'u            'alternativeRw': 'Inzira y\'urugo',
  id         nc  id            'cost': 'Low'
        },
       nf        },
        {',      ed        {          {
   5-     ic   5-   {}    ]
           g     0   ro          from flask import Flasknua'/app = FlaskgetCORS(app)

Ces',
     
CLASS_NinsCLASS_NAMES_ if 'image' in 
Ces',
     
CLASS_Nin       leCLASeqal
def get_diseNatural predators',
            'alte[n
Ces',
     
CLASS_NinsCL2,       CLAS  Ces',
     
CLASS_Nin       leCLASeqe'    seCLASindef get_diseNatural preda              'altern    "m)dco ea               {
      '        :             'diseaseRw': 'N i      se      '        e_'u            'alternativeRw': 'Inzira y\'urugo',
  id            'cost': 'Low'
        },
        {',        },
        {
   5-        e_  id            'cost': 'Low'
        },
       as        },
        {',                {st        {
   5-     nf  'instruc    ]
                     ro          from flask import Flaskuc  id         nc  id            'cost': 'Low'
        },
       nf        },
        {',   te        },
       nf        },
        {',          nf          {',      e_i   5-     ic   5-   {}    ]
           '           g     0   ro   ct
Ces',
     
CLASS_NinsCLASS_NAMES_ if 'image' in 
Ces',
     
CLASS_Nin       leCL),     
@CLASroCes',
     
CLASS_Nin       leCLASeqfo():
    retudef get_diseNatural predael            'alte[ Detector',
  Ces',
     
CLASS_:    4x224x3',     
CLASS_Nin       leCLASeqe,
CLAS        '        :             'diseaseRw': 'N i      se      '        e_'u            'alternativeRw': 'Inzira y\")  id            'cost': 'Low'
        },
        {',        },
        {
   5-        e_  id            'cost': 'Low'
 g=        },
        {',      0.  )
