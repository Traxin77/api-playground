document.getElementById('api-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const startTime = new Date().getTime();
    const url = document.getElementById('url').value;
    const method = document.getElementById('method').value;
    const api_key = document.getElementById('api_key').value;
    let headers = document.getElementById('headers').value;

    try {
        headers = headers ? JSON.parse(headers) : {};
    } catch (e) {
        alert('Invalid JSON in headers');
        return;
    }

    const queryParams = {};
    document.querySelectorAll('#query-params-container .param').forEach(param => {
        const key = param.querySelector('input[name="query_key"]').value;
        const value = param.querySelector('input[name="query_value"]').value;
        if (key) queryParams[key] = value;
    });

    const bodyParams = {};
    document.querySelectorAll('#body-params-container .param').forEach(param => {
        const key = param.querySelector('input[name="body_key"]').value;
        const value = param.querySelector('input[name="body_value"]').value;
        if (key) bodyParams[key] = value;
    });

    const data = {
        url,
        method,
        api_key,
        headers,
        params: method === 'GET' ? queryParams : bodyParams
    };

    fetch('/api_request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        document.getElementById('status-code').textContent = `Status Code: ${response.status}`; 
        return response.json();
    })
    .then(data => {
        const endTime = new Date().getTime();
        const responseTime = endTime - startTime;
        const size = new Blob([JSON.stringify(data)]).size;
        document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
        document.getElementById('response-time').innerText = `Response time: ${responseTime}ms`; 
        document.getElementById('response-size').textContent = `Response Size: ${size} bytes`; 
    })
    .catch(error => {
        document.getElementById('response-output').textContent = error;
    });
});

function addQueryParam() {
    const container = document.getElementById('query-params-container');
    const paramDiv = document.createElement('div');
    paramDiv.className = 'param';
    paramDiv.innerHTML = `
        <input type="text" name="query_key" placeholder="Key">
        <input type="text" name="query_value" placeholder="Value">
        <button type="button" onclick="removeParam(this)">Remove</button>
    `;
    container.insertBefore(paramDiv, container.children[1]);
}

function addBodyParam() {
    const container = document.getElementById('body-params-container');
    const paramDiv = document.createElement('div');
    paramDiv.className = 'param';
    paramDiv.innerHTML = `
        <input type="text" name="body_key" placeholder="Key">
        <input type="text" name="body_value" placeholder="Value">
        <button type="button" onclick="removeParam(this)">Remove</button>
    `;
    container.insertBefore(paramDiv, container.children[1]);
}

function removeParam(button) {
    button.parentElement.remove();
}

document.getElementById('copy-button').addEventListener('click', function() {
    const responseText = document.getElementById('response-output').innerText;
    copyToClipboard(responseText);
    alert('Response copied to clipboard!');
});


function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}