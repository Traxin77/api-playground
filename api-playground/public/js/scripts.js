document.getElementById('api-form').addEventListener('submit', function(e) {
    e.preventDefault();

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
    .then(response => response.json())
    .then(data => {
        document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
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
