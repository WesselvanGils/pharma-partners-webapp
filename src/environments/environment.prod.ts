const packagejson = require('../../package.json')

export const environment = 
{
	production: true,

	apiUrl: "http://localhost:3000/api/",

	version: packagejson.version
}