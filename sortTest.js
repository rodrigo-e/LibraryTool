function getFileList() {
	const list = {
		exports: ['suite'],
		before: ['NO PARAMS'],
		after: ['NO PARAMS'],
		beforeEach: ['NO PARAMS'],
		afterEach: ['NO PARAMS'],
		describe: ['title', 'fn'],
		it: ['title', 'fn'],
		visit: ['obj'],
		setup: ['fn'],
		tearDown: ['fn'],
		suite: ['title', 'fn'],
		test: ['title', 'fn'],
		color: ['type', 'str'],
		hide: ['NO PARAMS'],
		show: ['NO PARAMS'],
		list: ['failures'],
		Base: ['runner'],
		epilogue: ['NO PARAMS'],
		Dot: ['runner'],
		List: ['runner'],
		clean: ['test'],
		JSONReporter: ['runner'],
		Landing: ['runner'],
		runway: ['NO PARAMS'],
		Progress: ['runner', 'options'],
		Spec: ['runner'],
		indent: ['NO PARAMS'],
		TAP: ['runner'],
		noop: ['NO PARAMS'],
		Runner: ['suite'],
		grep: ['re'],
		checkGlobals: ['test'],
		fail: ['test', 'err'],
		failHook: ['hook', 'err'],
		hook: ['name', 'fn'],
		next: ['NO PARAMS'],
		runTest: ['fn'],
		runTests: ['suite', 'fn'],
		runSuite: ['suite', 'fn'],
		done: ['NO PARAMS'],
		run: ['fn'],
		Suite: ['title'],
		timeout: ['ms'],
		beforeAll: ['fn'],
		afterAll: ['fn'],
		addSuite: ['suite'],
		addTest: ['test'],
		fullTitle: ['NO PARAMS'],
		total: ['NO PARAMS'],
		Test: ['title', 'fn'],
		get: ['url', 'body', 'header'],
		request: ['done'],
		set: ['field', 'val'],
		respond: ['body']
	};

	sortObjectList(list);
}

function sortObjectList(obj) {
	let arr = Object.keys(obj);
	const listTmp = {};
	arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

	for (var element in arr) {
		listTmp[arr[element]] = obj[arr[element]];
	}

	return listTmp;
}

getFileList();
