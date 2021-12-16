const express = require('express')
const path = require('path')
const http = require('http')
const compression = require('compression')

const app = express()

// Compress static assets to enhance performance.
// Decrease the download size of your app through gzip compression:
app.use(compression())

//
// appname is the name of the "defaultProject" value that was set in the angular.json file.
// When built in production mode using 'ng build', a ./dist/{appname} folder is
// created, containing the generated application. The appname points to that folder.
//
// Replace the name below to match your own "defaultProject" value!
//
const appname = 'pharma-partners-webapp'

// Set express options
const options = {
    setHeaders: (res, stat) =>
    {
        res.set(
            'Content-Security-Policy',
            "default-src 'self' http://angular-gitlab-heroku.herokuapp.com/; script-src 'self' http://angular-gitlab-heroku.herokuapp.com/; connect-src http://angular-gitlab-heroku.herokuapp.com/ 'self'; img-src 'self' www.google.com; style-src 'self' 'unsafe-inline';"
        )
    }
}

// Point static path to dist
app.use(express.static(path.join(__dirname, '..', 'dist', appname), options))

// Catch all routes and return the index file
app.get('*', (req, res) =>
{
    res.sendFile(path.join(__dirname, '..', 'dist', appname, 'index.html'))
})

// Get port from environment and store in Express.
const port = process.env.PORT || '4200'
app.set('port', port)
// Create HTTP server.
const server = http.createServer(app)
// Listen on provided port, on all network interfaces.
server.listen(port, () =>
{
    console.log(`Angular app \'${appname}\' running in ${process.env.NODE_ENV} mode on port ${port}`)
})
