var nodegit = require('nodegit');
var fs = require('fs');

function getFileList() {
	// This code walks the history of the master branch and prints results
	// that look very similar to calling `git log` from the command line
	var list = {};
	var commitList = {};
	var libraryName = process.argv[2];
	if (libraryName) {
		nodegit.Repository.open(
			// '/mnt/yantra/rodrigo-e/LibraryTool/npm/' + libraryName + '/.git'
			'/mnt/yantra/npm/projects/npm/' + libraryName + '/.git'
		)
			.then(function(repo) {
				nodegit.Tag.list(repo).then(async function(tag_list) {
					const tmpList = tag_list.map(tag => tag.replace('v', '')).sort();

					for (let i = 0; i < tmpList.length; i += 1) {
						await nodegit.Reference.lookup(repo, `refs/tags/${tag_list[i]}`)
							.then(ref => ref.peel(nodegit.Object.TYPE.COMMIT))
							.then(ref => nodegit.Commit.lookup(repo, ref.id()))
							.then(commit => {
								commitList[tag_list[i].replace('v', '')] = commit.sha();
							})
							.catch(error => {
								console.log(error);
							});
					}

					var directoryName = 'fileLists/' + libraryName;
					if (!fs.existsSync(directoryName)) {
						fs.mkdirSync(directoryName);
					}

					for (var commitVersion in commitList) {
						await repo
							.getCommit(commitList[commitVersion])
							.then(function(commit) {
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
					console.log(commitList);
				});
			})
			.done();
	} else {
		console.log('Please provide library name');
	}
}

getFileList();
