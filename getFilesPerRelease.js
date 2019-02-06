var nodegit = require('nodegit');
var fs = require('fs');

async function getFileList() {
	// This code walks the history of the master branch and prints results
	// that look very similar to calling `git log` from the command line
	var list = {};
	var commitList = {};
	var libraryName = process.argv[2];
	var commitsReceived = process.argv.slice(3);
	// var libraryName = 'angular';
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
				var _entry;
				var version = '';
				var prevSha = '';

				// History emits "commit" event for each commit in the branch's history
				history.on('commit', function(commit) {
					commit
						.getEntry('package.json')
						.then(function(entry) {
							_entry = entry;
							return _entry.getBlob();
						})
						.then(function(blob) {
							//var firstTenLines = blob.toJson();
							//console.log(commit.message().replace(/\n/g, ''));
							var tmpVersion = JSON.parse(blob.toString()).version;
							//console.log('---' + tmpVersion);
							if (version !== tmpVersion) {
								if (prevSha !== '')
									if (!commitList[version]) commitList[version] = prevSha;
							}
							version = tmpVersion;
							prevSha = commit.sha();
						});

					// const commitName = commit.message().toUpperCase();
					// if (commitName.startsWith('RELEASE') || pattern.test(commitName)) {
					// 	list[commit.message()] = [];
					// 	commit.getTree().then(function(tree) {
					// 		var walker = tree.walk();
					// 		walker.on('entry', function(entry) {
					// 			var ext = entry.path().substr(entry.path().lastIndexOf('.') + 1);
					// 			if (ext === 'js' || ext === 'jsx') {
					// 				list[commit.message()].push(entry.path());
					// 			}
					// 		});
					// 		walker.start();
					// 	});
					// }
				});

				history.on('end', function() {
					if (!commitList[version]) commitList[version] = prevSha;
					console.log(commitList);
					var directoryName = 'fileLists/' + libraryName;
					if (!fs.existsSync(directoryName)) {
						fs.mkdirSync(directoryName);
					}

					nodegit.Repository.open(
						'/mnt/yantra/npm/projects/npm/' + libraryName + '/.git'
					).then(async function(repo) {
						for (var commitVersion in commitList) {
							await repo
								.getCommit(commitList[commitVersion])
								.then(function(commit) {
									// var tmpVersion = commitVersion;
									var tmpSha = commitList[commitVersion];
									var fileName = directoryName + '/R_' + commitVersion + '.txt';
									var listTmp = [];
									commit.getTree().then(function(tree) {
										// console.log(commitVersion);
										var walker = tree.walk();
										walker.on('entry', function(entry) {
											// console.log(entry.path());
											var ext = entry
												.path()
												.substr(entry.path().lastIndexOf('.') + 1);
											if (ext === 'js' || ext === 'jsx') {
												listTmp.push(entry.path());
											}
										});
										walker.on('end', function() {
											// console.log(commitVersion);
											// console.log(listTmp);
											fs.writeFile(
												fileName,
												tmpSha +
													'\n' +
													listTmp
														.sort()
														.toString()
														.replace(/,/g, '\n'),
												function(err) {
													if (err) throw err;
												}
											);
										});
										walker.start();
									});
								});
						}
					});
				});

				// Don't forget to call `start()`!
				history.start();
			})
			.done();
	} else {
		console.log('Please provide library name');
	}
}

async function test() {
	await getFileList();
}

test();
