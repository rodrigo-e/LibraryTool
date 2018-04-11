var nodegit = require('nodegit');
var fs = require('fs');

// This code walks the history of the master branch and prints results
// that look very similar to calling `git log` from the command line
var list = {};
var libraryName = process.argv[2];
const pattern = /^V?[0-9]*\.[0-9]*/g;
if (libraryName) {
	nodegit.Repository.open(
		'/mnt/yantra/npm/projects/npm/' + libraryName + '/.git'
	)
		.then(function(repo) {
			return repo.getMasterCommit();
		})
		.then(function(firstCommitOnMaster) {
			// History returns an event.
			var history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.Time);

			// History emits "commit" event for each commit in the branch's history
			history.on('commit', function(commit) {
				console.log(commit.message().replace(/\n/g, ''));
				const commitName = commit.message().toUpperCase();
				if (commitName.startsWith('RELEASE') || pattern.test(commitName)) {
					list[commit.message()] = [];
					commit.getTree().then(function(tree) {
						var walker = tree.walk();
						walker.on('entry', function(entry) {
							var ext = entry.path().substr(entry.path().lastIndexOf('.') + 1);
							if (ext === 'js' || ext === 'jsx') {
								list[commit.message()].push(entry.path());
							}
						});
						walker.start();
					});
				}
			});

			history.on('end', function() {
				var directoryName = 'fileLists/' + libraryName;
				if (!fs.existsSync(directoryName)) {
					fs.mkdirSync(directoryName);
				}

				for (var element in list) {
					var fileName =
						directoryName +
						'/R_' +
						element
							.toUpperCase()
							.replace(/RELEASE V?/g, '')
							.replace(/\./g, '_')
							.replace(/\n/g, '')
							.replace(/V/g, '') +
						'.txt';

					fs.writeFile(
						fileName,
						list[element]
							.sort()
							.toString()
							.replace(/,/g, '\n'),
						function(err) {
							if (err) throw err;
						}
					);
				}
			});

			// Don't forget to call `start()`!
			history.start();
		})
		.done();
} else {
	console.log('Please provide library name');
}
