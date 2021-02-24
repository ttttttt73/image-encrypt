import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { PostRequestEncryptHooks } from './PostRequestEncryptHooks';
import { PostRequestDecryptHooks } from './PostRequestDecryptHooks';
import ipfs from './ipfs';
import getWeb3 from "./utils/getWeb3";
import SimpleStorageContract from "./contracts/SimpleStorage.json";


function App() {
  const [placeholder, setPlaceholder] = useState('Hi');
  const [filebuffer, setBuffer] = useState(null);
  const [Plaintext, setPlaintext] = useState(null);
  const [state, setState] = useState({
    send_file: "",
    sign_file: ""
  })
  const [block, setBlock] = useState({
    content: "",
    sign: ""
    //ciphertext: "",
    //ciphertext2: ""
  })
  const [ipfsHash, setIpfsHash] = useState(null);
  const [ethcontract, setEthContract] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null
  })
  const b64 = ""
  useEffect (() => {
    try {
      async function setContract() {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setEthContract({ web3, accounts, contract: instance }, {retrieveFile});
      }

      setContract();
      
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, []);

  const retrieveFile = async () => {
    const { accounts, contract } = ethcontract;
    // const ipfsHash = await contract.methods.get().call();
    // setIpfsHash(ipfsHash);
    console.log("Contract's get call: ", await contract.methods.get().call())
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('buffer is changed')
      // console.log(filebuffer)
      const b64 = new Buffer.from(filebuffer).toString("base64")
      // console.log(b64)
      const mimeType = 'image/png';
      let results = await ipfs.add(filebuffer);
      console.log("ipfs result: ", results)
      let ipfsHash = results.path;
      console.log("ethcontract: ", ethcontract)
      const contract = ethcontract.contract;
      const accounts = ethcontract.accounts;
      /*let amount = 1
      let tokens = web3.utils.toWei(amount.toString(), 'ether')
      let bntokens = web3.utils.toBN(tokens)*/
      console.log(accounts[0]);
      console.log("block.content: ", block.content);
      console.log("block.sign: ", block.sign);
      await contract.methods.set(block.content, block.sign).send({ from: accounts[0] });
      // await contract.methods.set("test1", "test2").send({ from: accounts[0] });
      // setIpfsHash(ipfsHash);
    } catch (error) {
      console.error(error);
    }
  }

  const captureFile = (event) =>{
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new FileReader();
    //reader.readAsArrayBuffer(file);
    /* reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setBuffer(reader.result);
      console.log('buffer', filebuffer);
    }*/
    reader.onloadend = () => {
      setBuffer(reader.result);
    };
    reader.readAsDataURL(file)
  }

  const onSubmit_decrypt = async (event) => {
    event.preventDefault();
    try {
      console.log('onSubmit_decrypt executed!')
    } catch (error) {
      console.error(error);
    }
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    /*const name = event.target.name;
    const value = event.target.value;*/
    setState({
      ...state,
      [name]: value
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>Flask says {placeholder}</p>
        <form onSubmit={onSubmit}>
          <h2>Encryption</h2>
          <input type='file' onChange={captureFile}/>
          <input type='submit'/>
        </form>
        <img src={filebuffer} alt="receive image"/>
        <PostRequestEncryptHooks msg={filebuffer} block={block} setBlock={setBlock}/>
        <button onClick={onSubmit}>
          Contract send call
        </button>
        <button onClick={retrieveFile}>
          Contract get call
        </button>
        <form onSubmit={onSubmit_decrypt}>
          <h2>Decrytion</h2>
          <p>Enter your key:</p>
          <input type='text' onChange={onChange} name="send_file" value={state.send_file}/>
          <p>Enter your iv:</p>
          <input type='text' onChange={onChange} name="sign_file" value={state.sign_file}/>
          <br></br>
          <input type='submit' />
        </form>
        <PostRequestDecryptHooks state={state}/>
      </header>
    </div>
  );
}

export default App;
