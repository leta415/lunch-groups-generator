$(function() {

	$('#newLunchGroupsButton').click(function() {
		
		console.log('inside generateNewLunchGroups()');

		$.ajax({
			type: 'GET',
			url: '/newLunchGroups',
			success: function(data) {
				console.log('/newLunchGroups sucess!!!');

				// console.log('res: ' + res);
				// $('#groupsContainer').html('');
				// document.open("text/html", "replace");
				// document.write(res);
				// document.close();
			}
		});
	});

});