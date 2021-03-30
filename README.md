- 임의의 자료(파일)을 2개로 분해하여 대칭키로 암호화하여 IPFS 에 저장(이떄 cid1, cid2반환),  특정사용자만 자료를 접근할 수 있도록
비대칭키로 암호화하여  대칭키 암호화 정보(iv, symkey, cid1, cid2) 를 별도로 저장함(sendfile.txt)  
- 비대칭키로 암호화된 정보를 디지털 서명으로 만들어서 저장함 (signfile.txt)  
- 서명을 위해 yrpubkey.pem을 사용함 

### 파일 구성 
- createKey.py
- decrypt.py
- encrypt.py
- mfl.py

### openSSL 라이브러리와 ipfsclient 라이브러 설치를 선행해야 함
pip3 install pyopenssl  
pip3 install ipfshttpclient  

### 복호화는 위의 역과정으로 수행됨 
encrypt.py  -i Halra.jpg -c 1 -s 24  
decrypt.py  -i sendfile.txt -o mountain_2.jpg -s signfile.txt -k yrprikey.pem  

# Installation
```
git clone https://github.com/ttttttt73/image-encrypt-dapp.git  
```
```
pip install -r requirements.txt  
python app.py  
```
```
truffle develop  
compile  
migrate --reset  
```
```
cd react-flask-app  
npm install  
npm start  
```
# Configuration
react-flask-app/src/conf.json
