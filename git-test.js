var nodegit = require('nodegit');

// This code walks the history of the master branch and prints results
// that look very similar to calling `git log` from the command line
var list = {};

nodegit.Repository.open('/mnt/yantra/npm/projects/npm/mocha/.git')
    .then(function(repo) {
        return repo.getMasterCommit();
    })
    .then(function(firstCommitOnMaster) {
        // History returns an event.
        var history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.Time);

        // History emits "commit" event for each commit in the branch's history
        history.on('commit', function(commit) {
            if (
                commit
                    .message()
                    .toUpperCase()
                    .startsWith('RELEASE')
            ) {
                list[commit.message()] = [];
                commit.getTree().then(function(tree) {
                    var walker = tree.walk();
                    walker.on('entry', function(entry) {
                        var ext = entry
                            .path()
                            .substr(entry.path().lastIndexOf('.') + 1);
                        if (ext === 'js' || ext === 'jsx') {
                            list[commit.message()].push(entry.path());
                        }
                    });
                    walker.start();
                });
            }
        });

        // Don't forget to call `start()`!
        history.start();
    })
    .done();

console.log(list);
