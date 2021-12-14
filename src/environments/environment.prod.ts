const packagejson = require('../../package.json')

export const environment = 
{
	production: false,

	apiUrl: "http://localhost:3000/api/",

	version: packagejson.version
}