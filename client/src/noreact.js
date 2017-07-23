const URL = 'http://localhost:3001/graphql';

const query = `
    query {
        payments {
            _id
            date
            description
            amount
        }
    }
`;

const bodyObject = {
    query
}
const body = JSON.stringify(bodyObject);


var myInit = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body
};

var myRequest = new Request(URL, myInit);

fetch(myRequest)
    .then(
        function(response) {
            return response.json();
        }
    ).then(
        function(data) {
            console.log(data);
        }
    );
