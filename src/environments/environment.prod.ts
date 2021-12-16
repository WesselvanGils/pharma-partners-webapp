const packagejson = require('../../package.json')

export const environment = 
{
	production: true,

	apiUrl: "https://pharma-partners-api.herokuapp.com/api/",

	version: packagejson.version
}