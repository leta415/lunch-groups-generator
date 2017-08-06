/* add/remove people modal search typeahead */
$(document).ready(function() {
    $('.search').on('keyup',function() {
        var searchTerm = $(this).val().toLowerCase();
        var showCount = 0;
        $('#userTbl tbody tr').each(function() {
            var lineStr = $(this).text().toLowerCase();
            
            if(lineStr.indexOf(searchTerm) === -1) {
                $(this).hide();
            } else {
            	showCount++;
                $(this).show();
            }
        });

        //check if we should show the 'Add new person ...' table row
        if (showCount <= 0) {
        	console.log('Unable to find search');
        	var searchInput = $('#people-search-input').val();
        	var addNewPersonUrl = '/addPerson/' + searchInput;
        	$('#add-new-person-tr td').html("<a id='addNewPersonATag'>Add new person <b>" + searchInput + "</b></a>");
        	$('#add-new-person-tr').css('display', 'inherit');
        } else {
        	$('#add-new-person-tr').css('display', 'none');
        }
    });

});


$(document).ready(function() {
    $(document).on("click", "#addNewPersonATag", function(e) {
        console.log('addNewPersonATag clicked');
		var searchInput = $('#people-search-input').val();
	    var addNewPersonUrl = '/addPerson/' + searchInput;
	    console.log('addNewPersonUrl: ' + addNewPersonUrl);
		$.ajax({
			type: 'GET',
			url: addNewPersonUrl,
			success: function(data) {
				$('#myModal').modal('show');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				console.log('There was a problem adding new person ' + searchInput + '. Status: ' + textStatus + '  Error: ' + errorThrown);
			}
		});

        return false;
    });
});


$(document).ready(function() {
    $('.singlePerson .deletePersonImg').on('click', function(e) {
        var name = $(this).parent().text();

        // console.log('trying to delete ' + name);

		var removePersonUrl = '/removePerson/' + name;

		$.ajax({
			type: 'GET',
			url: removePersonUrl,
			success: function(data) {
				$('#myModal').modal('show');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				console.log('There was a problem removing person ' + name + '. Status: ' + textStatus + '  Error: ' + errorThrown);
			}
		});          
    });
});



$('#newLunchGroupsButton').click(function() {

	$('#newLunchGroupsButton').removeClass('active').addClass('disabled');

	$.ajax({
		type: 'GET',
		url: '/newLunchGroups',
		success: function(data) {
					// data = {'newList': [<person1>, <person2>, ...]}

					$('#cardsWrapper').empty(); //empty out the lunch groups

					var newLunchGroups = convertListToGroups($.parseJSON(data).newList);

					for (var groupIndex = 0; groupIndex < newLunchGroups.length; groupIndex++) {
						createLunchGroupCard(newLunchGroups[groupIndex], groupIndex);
					}

					$('#newLunchGroupsButton').removeClass('disabled').addClass('active');
			   },
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
				   $('#newLunchGroupsButton').removeClass('disabled').addClass('active');
				   console.log('There was a problem generating new lunch groups. Status: ' + textStatus + '  Error: ' + errorThrown);
        	   }

	});
});

function convertListToGroups(list) {
	var groupsArray = [];

	//Calculate number of lunch groups
	var numGroups = Math.floor(list.length/4);

	for (var i = 0; i < list.length; i++) {
		var groupIndex = i%numGroups;

		if (!groupsArray[groupIndex]) {
			groupsArray[groupIndex] = {'members': []};
		}

		groupsArray[groupIndex].members.push({'person': list[i]});
	}

	// lunchgroups: [ { members: [ {'person': <name>}, {'person': <name>}, ... ] },
	// 				  { members: [ {'person': <name>}, {'person': <name>}, ... ] },
	// 				  ... 
	//              ]
	return groupsArray;
}

function createLunchGroupCard(lunchGroup, lunchGroupNumber) {
	//lunchGroup = { members: [ {'person': <name>}, {'person': <name>}, ... ] }
	//lunchGroupNumber = <int>

	//create the html strings for the card divs
	var card = "<div class='card' style='width: 20rem;'></div>";
	var cardTitleWrapper = "<div class='card-block'></div>";
	var cardTitle = "<h4 class='card-title'></h4>"; 
	var personGroup = "<ul class='list-group list-group-flush'></ul>";
	var person = "<li class='list-group-item'></li>";

	//create the card divs
	var cardDiv = $(card).appendTo('#cardsWrapper')[0]; 
	var cardTitleWrapperDiv = $(cardTitleWrapper).appendTo(cardDiv)[0];
	var cardTitleDiv = $(cardTitle).appendTo(cardTitleWrapperDiv)[0]; 
	cardTitleDiv.append('Group ' + lunchGroupNumber);
	var personGroupDiv = $(personGroup).appendTo(cardDiv)[0];

	//append the lunch group members to the card
	var members = lunchGroup.members;
	for (var memberIndex = 0; memberIndex < members.length; memberIndex++) {
		var personDiv = $(person).appendTo(personGroupDiv)[0];
		var personName = members[memberIndex].person;
		personDiv.append(personName);
	}
}


