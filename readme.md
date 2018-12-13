### git-repo-downloader
download git repo from github、gitlab

#### install

    $ npm install --save git-repo-downloader

#### Usage

    const download = require('git-repo-downloader')
    download('yxxx5/git-download', {
      clone : true
     })
    async function d(){
      await await download('github:github.com:yxxx5/git-download', {
          clone: false,
          dest: './'
      })
      //done
    }

#### API
    const download = require('git-repo-downloader')
    download(repo, [options])

##### repo
    type String
        type:host/owner/name/branch
        github:github.com:yxxx5/git-download/master
##### options
    type object
        dest:   String
            path to where file will be written
        clone: boolean
            whether use git clone or not
