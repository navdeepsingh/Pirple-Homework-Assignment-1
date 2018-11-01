/*
*
* Main API File
* Author: Navdeep Singh
*
*/

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

const server =  http.createServer((req, res) => {

	// Get parsed url
	const parsedUrl = url.parse(req.url, true);

	// Get query string as an object
	const queryStringObject = parsedUrl.query;

	// Get path
	const path = parsedUrl.pathname;

	// Get trimmed path
	const trimmedPath = path.replace(/^\/+|\/$/g, '');

	// Get method;
	const method = req.method;

	// Get headers
	const headers = req.headers;
	
	// Get Payload, if any
	let buffer = '';
	const decoder = new StringDecoder('utf-8');
	req.on('data', (data) => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();

		// Choose the handler this request should go to, If one is not found go to NotFound handler
		const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construct a data object to pass into handler
		const data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		}

		chosenHandler(data, (statusCode, payload) => {
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			payload = typeof(payload) == 'object' ? payload : {};

			const payloadString = JSON.stringify(payload);

			// Send the response
			res.writeHead(statusCode, {
				 'Content-Type': 'application/json'
			});
			res.end(payloadString);

			// Log the request path
			console.log('Returning the response: ', statusCode, payload);
		});

	});

});

server.listen(config.port, () => {
	console.log('Server is listening at port: ' + config.port);
});

// Define handlers
let handlers = {};

// Hello Handler
handlers.hello = (data, callback) => {
	callback(null, {'message': 'Welcome to NodeJs World.'});
}

// NotFound Handler
handlers.notFound = (data, callback) => {
	callback(404);
}


// Define Router
const router = {
	'hello' : handlers.hello
}
