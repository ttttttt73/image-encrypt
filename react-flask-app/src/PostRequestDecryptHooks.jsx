import React, { useState, useEffect } from 'react';

function PostRequestDecryptHooks(props) {
    const [Plaintext, setPlaintext] = useState(null);

    useEffect(() => {
        if (props.state.send_file.trim() !== "" && props.state.sign_file.trim() !== ""){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({send_file: props.state.send_file, sign_file: props.state.sign_file })
            };
            fetch('/decrypt2', requestOptions).then(res => res.json()).then(data => { setPlaintext(data.pt)});
        }
    }, [props.state]);

    return (
        <div className="card text-cetner m-3">
            <h5 className="card-header">Post Request Result - Decryption</h5>
            <img src={Plaintext} alt="decrypt output"/>
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