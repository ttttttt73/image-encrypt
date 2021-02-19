import React, { useState, useEffect } from 'react';

fucntion App() {
    const [state, setState] = useState({
        storageValue: 0,
        web3: null,
        accounts: null,
        contract: null,
        buffer: null,
        ipfsHash: ''
    })
    const instance = {
        web3: 1,
        accounts: 2,
        contract: 3
    }

    useEffect (() => {
        try {
            setState({ web3, accounts, contract: instance });
        } catch (error) {
            console.log(error);
        }
    }, []);

    console.log(state);
}

export default App;
