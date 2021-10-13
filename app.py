import os
import hashlib
from hashlib import sha256
from typing import Sized
from flask import Flask, request, redirect, url_for, send_from_directory, render_template
from werkzeug import secure_filename
from datetime import datetime
from flask_cors import CORS
import json
import requests
import ipfshttpclient


with open("react-flask-app/src/conf.json", "r") as j:
    cfg = json.load(j)

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/encrypt', methods=['POST'])
def encrypt():
    from base64 import b64encode
    from Crypto.Cipher import AES
    from Crypto.Util.Padding import pad
    from Crypto.Random import get_random_bytes

    data = request.get_json(force=True)
    data = data['msg']
    data = data.encode('utf-8')
    
    key = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(data, AES.block_size))
    
    key = b64encode(key).decode('utf-8')
    iv = b64encode(cipher.iv).decode('utf-8')
    ct = b64encode(ct_bytes).decode('utf-8')

    result = json.dumps({'iv':iv, 'ciphertext':ct})
    return { 'key': key, 'iv': iv, 'ciphertext': ct }


@app.route('/decrypt', methods=['POST'])
def decrypt():
    from base64 import b64decode, b64encode
    from Crypto.Cipher import AES
    from Crypto.Util.Padding import unpad
    
    json_input = request.get_json(force=True)
    try:
        b64 = json_input
        key = b64decode(b64['key'])
        iv = b64decode(b64['iv'])
        ct = b64decode(b64['ciphertext'])
        print(iv)
        print(ct)
        
        cipher = AES.new(key, AES.MODE_CBC, iv)
        print(f"size of block = {AES.block_size}")
        pt = unpad(cipher.decrypt(ct), AES.block_size)
        print("The message was: ", pt)
        pt = pt.decode('utf-8')
        iv = b64encode(iv).decode('utf-8')
        print(type(iv), type(pt))
        return {'iv': iv, 'pt': pt}
    except ValueError as e:
        print("Incorrect decryption: ", e)
    except KeyError as e:
        print("Incorrect decryption: ", e)


@app.route('/encrypt2', methods=['POST'])
def encrypt2():
    import encrypt

    json_input = request.get_json(force=True)
    msg = json_input['msg']
    count = 2

    send_res, sign_res, res1, res2 = encrypt.encrypt2(msg)

    return { 'send_res': send_res, 'sign_res': sign_res, 'ciphertext': res1, 'ciphertext2': res2 }


@app.route('/decrypt2', methods=['POST'])
def decrypt2():
    import decrypt

    json_input = request.get_json(force=True)
    send_file = json_input['send_file']
    sign_file = json_input['sign_file']

    output_buffer = decrypt.decrypt2(send_file, sign_file)

    return { 'pt': output_buffer }


# if __name__ == "__main__":
    # INS = contract.deploy()
    # app.run(host=cfg['FLASK_HOST'], port=cfg['FLASK_PORT'])
