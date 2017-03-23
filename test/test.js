const assert = require('assert')
//const assert = require('chai').assert
const download = require('../index')
const rimraf = require('rimraf').sync
const fs = require('fs')

describe('Git Repo Download', function() {
    describe('#clone', function() {
        it('should download repo git-download from github', async() => {
            let b = true
            try {
                await download('yxxx5/git-download', {
                    clone: true
                })
                assert.ok(fs.existsSync('./git-download'), 'git-download folder not exist')
            } catch (err) {
                assert.ok(null, 'git-download folder not exist')
            }

            rimraf('./git-download')
        })
    })

    describe('#download', function() {
        it('should download repo git-download from github', async() => {
            await download('github:github.com:yxxx5/git-download', {
                clone: false,
                dest: './'
            })

            assert.ok(fs.existsSync('./git-download-master'), 'git-download folder not exist')
            rimraf('./git-download-master')
        })
    })
})
