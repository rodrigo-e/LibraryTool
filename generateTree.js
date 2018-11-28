const nodegit = require('nodegit');
const fs = require('fs');
const esprima = require('esprima');
const escodegen = require('escodegen');
const normalizer = require('../JS_WALA/normalizer/lib/normalizer');
const dominators = require('../JS_WALA/cfg/lib/dominators');
const cfg = require('../JS_WALA/cfg/lib/cfg');
const jsp = require('uglify-js').parser;
const pro = require('uglify-js').uglify;

let functionsList = {};
let libraryName = '';

function getFileList() {
	let list = {};
	libraryName = process.argv[2];
	passedFiles = process.argv.slice(3);
	if (libraryName) {
		let repository = nodegit.Repository.open(
			'/mnt/yantra/rodrigo-e/LibraryTool/npm/' + libraryName + '/.git'
		);
		let fileLists =
			passedFiles.length > 0
				? passedFiles
				: fs.readdirSync('fileLists/' + libraryName);

		console.log(fileLists.length);

		for (let i = 0; i < fileLists.length; i += 1) {
			let count = 0;
			let hash = '';
			const fileName = 'fileLists/' + libraryName + '/' + fileLists[i];
			let data = fs
				.readFileSync(fileName, 'utf8')
				.toString()
				.split('\n');
			for (let line in data) {
				if (count === 0) {
					hash = data[line];
					list[fileLists[i]] = { hash: hash, files: [] };
				} else {
					list[fileLists[i]].files.push(data[line]);
				}
				count += 1;
			}
		}
	} else {
		console.log('Please provide library name');
	}

	return list;
}

async function getFunctions() {
	let libraryName = process.argv[2];
	let list = getFileList();
	let repository = nodegit.Repository.open(
		'/mnt/yantra/rodrigo-e/LibraryTool/npm/' + libraryName + '/.git'
	);
	for (let element in list) {
		await repository.then(async function(repo) {
			await repo.getCommit(list[element].hash).then(async function(commit) {
				let functionsListTmp = {};
				for (let file in list[element].files) {
					await commit
						.getEntry(list[element].files[file])
						.then(function(entry) {
							entry.getBlob().then(function(blob) {
								console.log(entry.name());
								let orig_code = blob.toString();
								let ast = esprima.parse(orig_code);
								// console.log(ast);
								let normalized = normalizer.normalize(ast, {
									pp: escodegen.generate
								});
								console.log(JSON.stringify(normalized, null, 4));
								// cfg.buildCFG(normalized);
								// dominators.buildDominatorTrees(normalized, true);

								// let ast = jsp.parse(orig_code);
								// ast = pro.ast_mangle(ast);
								// ast = pro.ast_squeeze(ast);
								// console.log(escodegen.generate(normalized, { comment: true }));
								console.log();
							});
						});
				}
			});
		});
	}

	return true;
}

function test() {
	getFunctions();
}

test();
