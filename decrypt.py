import requests
import okKey
import mfl
import os
import io
from ast import literal_eval
import base64
from base64 import b64encode, b32decode, b64decode
import time
import argparse
import csv
import sys
import json


with open("react-flask-app/src/conf.json", "r") as j:
    cfg = json.load(j)

try:
    import ipfshttpclient
    
    c = ipfshttpclient.connect(cfg['IPFS_HOST'])
    if c == None:
        Exception("There is a problem when getting hash values")
except:
    print("An exception occurred when connecting IPFS[getIPFS_hash]")
    sys.exit(1)


def verify(input_file, sign_file):
    sendfile=input_file
    enList = literal_eval(sendfile)

    # sign verification
    ### open a signature file - sign is a string type
    ### get hash of enList and change a type same as a signf
    se = str(enList)
    cEnList = okKey.getHash(se.encode())
    print(type(sign_file))
    print(sign_file, '\n', input_file, '\n', str(cEnList))
    assert sign_file == str(cEnList)

    return enList


def decrypt(pk_file, enList):
    yrprikey = okKey.readKey(pk_file).to_cryptography_key()
    deList = []

    for item in enList:
        a = okKey.priDecrypt(yrprikey, item)
        deList.append(a)
        #deList.append(a.decode())
    return deList


def getIPFS_hash(deList):
    deList[0] = base64.b32decode(deList[0])  # SymKey
    deList[1] = base64.b16decode(deList[1])  # IV

    oneipfsaddr = deList[2]   # Hash 1
    oneipfsaddr = oneipfsaddr.decode()
    twoipfsaddr = deList[3]   # Hash 2
    twoipfsaddr = twoipfsaddr.decode()

    print ("oneipfsaddr={}".format(oneipfsaddr))
    req1 = c.cat(oneipfsaddr)
    req2 = c.cat(twoipfsaddr)

    return req1, req2


def decrypt2(send_res, sign_res):
    print(send_res)
    print(sign_res)
    input_file = c.cat(send_res)
    sign_file = c.cat(sign_res)
    # bytes -> str : b'[b\'\\x88\\x08\... -> [b'\x88\x08\...
    input_file = input_file.decode()
    sign_file = sign_file.decode()

    pk_file = './yrprikey.pem'
    output_file = './output_file.txt'

        
    # DigSign 검증
    cEnList = verify(input_file, sign_file)
    deList = decrypt(pk_file, cEnList)

    try:
       getcb1, getcb2 = getIPFS_hash(deList)

       if getcb1 == None or getcb2 == None:
           Exception("There is a problem when getting hash values")
    except:
       print("An exception occurred when connecting IPFS[getIPFS_hash]")
       sys.exit(1)

    count = 2
    for i in range(count):
        with open('pef.csv', mode='a') as pef:
           pw = csv.writer(pef, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

           t0 = time.time()

           db1 = okKey.decrypt(deList[0], deList[1], getcb1)
           db2 = okKey.decrypt(deList[0], deList[1], getcb2)

           mergedbs = mfl.mergeToString(db1, db2)
           getmyfile = open(output_file, 'wb')

           getmyfile.write(mergedbs)

           getmyfile.close()

           elapsed = time.time() - t0
           fSize = len(mergedbs)
           print("size = {}, elaped time = {}".format(fSize, elapsed))
           pw.writerow([fSize, elapsed])

    out = open(output_file, 'r')
    output_buffer = out.read() # .encode()
    print(type(output_buffer))
    out.close()

    return output_buffer


if __name__ == "__main__":
    h1 = "Qmbp8YM4d5yMdnsKpqHajqQTVxyM4PiRrkm8AgsE6TpCzc"
    h2 = "QmNrs5Qm4tVBSCRqUK3X5NCNr4V7rxDSuMfPmpS54qG1cM"
    res = decrypt2(h1, h2)
    print(res)
