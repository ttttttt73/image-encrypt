import React, { useState, useEffect } from 'react';

function PostRequestEncryptHooks(props) {
    const [Key, setKey] = useState(null);
    const [IV, setIV] = useState(null);
    const [Ciphertext, setCiphertext] = useState(null);
    const [Ciphertext2, setCiphertext2] = useState(null);

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ msg: props.filebuffer })
            body: JSON.stringify({ msg: props.msg })
        };
        if (props.msg !== null) {
            fetch('/encrypt2', requestOptions).then(res => res.json()).then(
                data => {
                    setKey(data.send_res);
                    setIV(data.sign_res);
                    setCiphertext(data.ciphertext);
                    setCiphertext2(data.ciphertext2);
                    props.setBlock2(data.sign_res)
                    props.setBlock(data.send_res)
                    console.log("block.content: ", props.blockRef2)
                    console.log("block.sign: ", props.blockRef)
                })   
        } else {
            console.log('buffer is null')
        }
    }, [props.msg]);
   
    return (
        <div className="card text-cetner m-3">
            <h5 className="card-header">Post Request Result - Encryption</h5>
            <div className="card-body">
                <h6>Returned send_res: {Key}</h6>
                <h6>Returned sign_res: {IV}</h6>
                <h6>Returned Ciphertext: {Ciphertext}</h6>
                <h6>Returned Ciphertext2: {Ciphertext2}</h6>
            </div>
        </div>
    ); 
}

export { PostRequestEncryptHooks };


/*async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        mothod: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

postData('https://example.com/answer', { answer: 42 }).then(data => {
    console.log(data);
});*/
