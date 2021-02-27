import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { PostRequestEncryptHooks } from './PostRequestEncryptHooks';
import { PostRequestDecryptHooks } from './PostRequestDecryptHooks';
import ipfs from './ipfs';
import getWeb3 from "./utils/getWeb3";
import SimpleStorageContract from "./contracts/SimpleStorage.json";


function App() {
  var useStateRef = require('react-usestateref')
  const [placeholder, setPlaceholder] = useState('Hi');
  const [filebuffer, setBuffer] = useState(null);
  const [state, setState] = useState({
    send_file: "",
    sign_file: ""
  })
  var [block_sign, setBlock, blockRef] = useStateRef(null)
  var [block_content, setBlock2, blockRef2] = useStateRef(null)
  const [ethcontract, setEthContract] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null
  })

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
    console.log("Contract's get call: ", await contract.methods.get().call())
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('buffer is changed')
      console.log("ethcontract: ", ethcontract)
      const contract = ethcontract.contract;
      const accounts = ethcontract.accounts;
      /*let amount = 1
      let tokens = web3.utils.toWei(amount.toString(), 'ether')
      let bntokens = web3.utils.toBN(tokens)*/
      console.log(accounts[0]);
      console.log("block.content: ", block_content);
      console.log("block.sign: ", block_sign);
      await contract.methods.set(block_content, block_sign).send({ from: accounts[0] });
      // await contract.methods.set("test1", "test2").send({ from: accounts[0] });
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
        <PostRequestEncryptHooks msg={filebuffer} block_sign={block_sign} setBlock={setBlock} blockRef={blockRef}
        block_content={block_content} setBlock2={setBlock2} blockRef2={blockRef2}/>
        <button onClick={onSubmit}>
          Contract send call
        </button>
        <button onClick={retrieveFile}>
          Contract get call
        </button>
        <form onSubmit={onSubmit_decrypt}>
          <h2>Decrytion</h2>
          <p>Enter your content:</p>
          <input type='text' onChange={onChange} name="send_file" value={state.send_file}/>
          <p>Enter your sign:</p>
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
