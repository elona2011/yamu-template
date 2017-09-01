#!/usr/bin/env node

const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const os = require('os')
const opn = require('opn')
const program = require('commander')
const spawn = require('child_process').spawn;

let port = 9000,
    dir = path.resolve(process.cwd(), process.env.npm_package_config_dir || '')

program
    .option('-d, --dir <dir>')
    .option('-p, --port <port>')
    .parse(process.argv)

if (program.port) {
    port = program.port
}

if (program.dir) {
    dir = path.resolve(process.cwd(), program.dir)
}

console.log('watching css file at', dir, '...')
if (os.platform() === 'win32') {
    var cmd = 'npm.cmd'
} else {
    var cmd = 'npm'
}
const pcss = spawn(cmd, ['run', 'pcss', '--', '-w', dir])
pcss.stdout.on('data', d => {
    //输出无空行
    process.stdout.write(`pcss: ${d}`)

    //输出有空行
    // console.log(`pcss: ${d}`)
})
// exec('npm run pcss -- -w ' + program.dir)

console.log('starting server at', dir, '...')

http.createServer(function(req, res) {
    console.log(`${req.method} ${req.url}`)

    const parsedUrl = url.parse(req.url)
    let pathname = dir + parsedUrl.pathname

    const mimeType = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.eot': 'appliaction/vnd.ms-fontobject',
        '.ttf': 'aplication/font-sfnt'
    };

    fs.exists(pathname, function(exists) {
        if (!exists) {
            res.statusCode = 404
            res.end(`File ${pathname} not found!`)
            return
        }

        if (fs.statSync(pathname).isDirectory()) {
            let dirUrl = req.url.substr(-1) === '/' ? req.url : req.url + '/'
            res.writeHead(302, {
                'Location': url.resolve(dirUrl, 'index.html')
            })
            res.end()
            return
        }

        fs.readFile(pathname, function(err, data) {
            if (err) {
                res.statusCode = 500
                res.end(`Error getting the file: ${err}`)
            } else {
                const ext = path.parse(pathname).ext
                res.setHeader('Content-type', mimeType[ext] || 'text/plain')
                res.end(data)
            }
        })
    })
}).listen(parseInt(port))

opn('http://localhost:' + port)