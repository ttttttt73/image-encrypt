import React, { useState, useEffect } from 'react';
import configData from "./conf.json";


function PostRequestDecryptHooks(props) {
    const [Imagebuffer, setImagebuffer] = useState(null);

    useEffect(() => {
        console.log(props.block_sign, typeof(props.block_sign))
        console.log(props.block_content, typeof(props.block_content))
        if (props.block_sign != null && props.block_content != null){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({send_file: props.block_sign, sign_file: props.block_content })
            };
            fetch('/decrypt2', requestOptions).then(res => res.json()).then(data => { setImagebuffer(data.pt) });
        }
    }, [props.block_content, props.block_sign]);

    return (
        <div className="card text-cetner m-3">
            <h5 className="card-header">Post Request Result - Decryption</h5>
            <img src={Imagebuffer} alt="decrypt output"/>
        </div>
    );
}

export { PostRequestDecryptHooks };


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
