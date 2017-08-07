$(document).ready(function() {
	//Run the tests
	testGroupSizesReasonableWithSmallList();
	testGroupSizesReasonableWithMediumList();
	testGroupSizesReasonableWithLargeList();
});


/* TESTS */
function testGroupSizesReasonable(list, testName) {
	var groups = convertListToGroups(list);

	for (var i = 0; i < groups.length; i++) {
		if (groups[i].members.length < 3 || groups[i].members.length > 5) {
			console.log('group: ' + groups[i].members);
			console.log(testName + ' failed');
			return;
		}
	}
	console.log(testName + ' passed');
}

function testGroupSizesReasonableWithSmallList() {
	testGroupSizesReasonable(['test1', 'test2', 'test3'], 'testGroupSizesReasonableWithSmallList');
}

function testGroupSizesReasonableWithMediumList() {
	testGroupSizesReasonable(['test1', 'test2', 'test3', 'test4', 'test5', 'test6'], 'testGroupSizesReasonableWithMediumList');
}

function testGroupSizesReasonableWithLargeList() {
	testGroupSizesReasonable(['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12', 'test13'], 'testGroupSizesReasonableWithLargeList');
}