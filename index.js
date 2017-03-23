const download = require('download')
const rimraf = require('rimraf').sync
const fs = require('fs')
const unzip = require('unzip')
const contentstream = require('contentstream')
const exec = require('child_process').exec
const Q = require('q')
const pts = require('promise-from-stream')

module.exports = async(repo, options) => {
    repo = normalize(repo)
    let url = getUrl(repo, options.clone)
    options = Object.assign({
        dest: options.clone ? repo.name : '.',
    }, options)

    if (options.clone) {
        return Q.nfcall(exec, 'git clone ' + url + ' ' + options.dest + ' --depth 1')
            .then(() => {
                rimraf(options.dest + '/.git', fs)
            })
    } else {
        return pts(
            contentstream(
                await download(url)
            ).pipe(unzip.Extract({
                path: options.dest
            }))
        )
    }
}

function getUrl(repo, clone) {
    let url
    if (clone) {
        url = "git@" + repo.host + ":" + repo.owner + "/" + repo.name + ".git"
    } else {
        switch (repo.type) {
            case 'github':
                url = "https://" + repo.host + "/" + repo.owner + "/" + repo.name + "/archive/" + repo.checkout + ".zip"
                break
            case 'gitlab':
                url = "https://" + repo.host + "/" + repo.owner + "/" + repo.name + "/repository/archive.zip?ref=" + repo.checkout
                break
            case 'bitbucket':
                url = "https://" + repo.host + "/" + repo.owner + "/" + repo.name + "/get/" + repo.checkout + ".zip"
                break
            default:

        }
    }
    return url
}

function normalize(repo) {
    let regex = /^((github|gitlab|bitbucket):)?((.+):)?([^/]+)\/([^#]+)(#(.+))?$/
    let match = regex.exec(repo)
    let type = match[2] || "github"
    let host = match[4] || null
    let owner = match[5]
    let name = match[6]
    let checkout = match[8] || "master"
    let archive

    if (host == null) {
        switch (type) {
            case 'github':
                host = "github.com"
                archive = checkout + ".zip"
                break
            case 'gitlab':
                host = "gitlab.com"
                archive = "archive.zip"
                break
            case 'bitbucket':
                host = "bitbucket.com"
                archive = checkout + ".zip"
                break
            default:

        }

    }

    return {
        type: type,
        host: host,
        owner: owner,
        name: name,
        checkout: checkout,
        archive: archive
    }
}
