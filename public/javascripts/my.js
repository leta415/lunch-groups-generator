/* modify people modal search typeahead */
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

        	var searchInput = $('#people-search-input').val();
        	var addNewPersonUrl = '/addPerson/' + searchInput;
        	$('#add-new-person-tr td').html("<a id='addNewPersonATag'>Add new person <b>" + searchInput + "</b></a>");
        	$('#add-new-person-tr').css('display', 'inherit');

        	$('#addNewPersonATag').click(addNewPersonHandler);

        } else {
        	$('#add-new-person-tr').css('display', 'none');
        }
    });

});


/* Add a new person onclick handler */
var addNewPersonHandler = function() {

	var searchInput = $('#people-search-input').val();

	//this will probably never happen with typscript but just as extra safety check
    if (!searchInput || searchInput.length == 0) {
    	return;
    }

    var addNewPersonUrl = '/addPerson/' + searchInput;

	$.ajax({
		type: 'GET',
		url: addNewPersonUrl,
		success: function(data) {
			// console.log('addPerson data: ' + data);

			redrawModifyEmployeesTable($.parseJSON(data).newList);
			redrawLunchGroups($.parseJSON(data).newList);
			$('#myModal').modal('show');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			console.log('There was a problem adding new person ' + searchInput + '. Status: ' + textStatus + '  Error: ' + errorThrown);
		}
	});
}


/* Remove a person trash can onclick handler */
var removePersonHandler = function() {
	var name = $(this).parent().text();

    //this will probably never happen with typscript but just as extra safety check
    if (!name || name.length == 0) {
    	return;
    }

	var removePersonUrl = '/removePerson/' + name;

	$.ajax({
		type: 'GET',
		url: removePersonUrl,
		success: function(data) {
			// console.log('removePerson data: ' + data);
			console.log('redrawing after remove');
			redrawModifyEmployeesTable($.parseJSON(data).newList);
			redrawLunchGroups($.parseJSON(data).newList);
			$('#myModal').modal('show');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			console.log('There was a problem removing person ' + name + '. Status: ' + textStatus + '  Error: ' + errorThrown);
		}
	}); 
}

/* Remove a person trash can onclick handler */
$(document).on('click', '.singlePerson .deletePersonImg', function(e) {
    var name = $(this).parent().text();

    //this will probably never happen with typscript but just as extra safety check
    if (!name || name.length == 0) {
    	return;
    }

	var removePersonUrl = '/removePerson/' + name;

	$.ajax({
		type: 'GET',
		url: removePersonUrl,
		success: function(data) {
			// console.log('removePerson data: ' + data);
			console.log('redrawing after remove');
			redrawModifyEmployeesTable($.parseJSON(data).newList);
			redrawLunchGroups($.parseJSON(data).newList);
			$('#myModal').modal('show');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			console.log('There was a problem removing person ' + name + '. Status: ' + textStatus + '  Error: ' + errorThrown);
		}
	});    
	return false;      
});


/* Create new lunch groups button onclick handler */
$('#newLunchGroupsButton').click(function() {

	$('#newLunchGroupsButton').removeClass('active').addClass('disabled');

	$.ajax({
		type: 'GET',
		url: '/newLunchGroups',
		success: function(data) {
					// data = {'newList': [<person1>, <person2>, ...]}

					redrawLunchGroups($.parseJSON(data).newList);
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


/* HELPER FUNCTIONS BELOW */
function redrawModifyEmployeesTable(list) {
	list.sort();

   $('#userTbl').empty();

   var tbody = "<tbody></tbody>";
   var addNewPersonTr = "<tr id='add-new-person-tr' style='display:none'><td>hello world</td></tr>";
   var personTr = "<tr></tr>";
   var personTd = "<td></td>";
   var personTdDiv = "<div class='singlePerson'></div>";
   var personTdImg = "<img class='deletePersonImg' style='height: 14px;' src='/images/trash-can.png'>";

   var tbodyElem = $(tbody).appendTo('#userTbl')[0];
   var addNewPersonTrElem = $(addNewPersonTr).appendTo(tbodyElem)[0]; 

   for (var i = 0; i < list.length; i++) {

   		var personTrElem = $(personTr).appendTo(tbodyElem)[0];
   		var personTdElem = $(personTd).appendTo(personTrElem)[0];
   		var personTdDivElem = $(personTdDiv).appendTo(personTdElem)[0];
   		var personTdImgElem = $(personTdImg).appendTo(personTdDivElem)[0];
   		personTdImgElem.click = removePersonHandler;
   		personTdDivElem.append(list[i]);
   }

   $('#people-search-input').val('');
}


function redrawLunchGroups(list) {
	$('#cardsWrapper').empty(); //empty out the lunch group cards

	var newLunchGroups = convertListToGroups(list);

	for (var groupIndex = 0; groupIndex < newLunchGroups.length; groupIndex++) {
		createLunchGroupCard(newLunchGroups[groupIndex], groupIndex);
	}
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