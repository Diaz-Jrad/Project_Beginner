window.onload = init;

// The contact manager as a global variable
let cm; 


function init() { 
	// create an instance of the contact manager
	cm = new ContactManager();
	
  	cm.addTestData();
  	cm.printContactsToConsole();

	// Display contacts in a table
	// Pass the id of the HTML element that will contain the table
	cm.displayContactsAsATable("contacts");
}

function formSubmitted(event) {
    event.preventDefault();
  
	// Get the values from input fields
	let name = document.querySelector("#name");
  	let email = document.querySelector("#email");
    let lastName = document.querySelector("#Lname");
	let newContact = new Contact(name.value, lastName.value, email.value);
	cm.add(newContact);
    cm.sortByName();
          
	// Empty the input fields
	name.value = "";
    lastName.value = "";
	email.value = "";
	
    // refresh the html table
	cm.displayContactsAsATable("contacts");
	
	// do not let your browser submit the form using HTTP
	return false;
}

function emptyList() {
	cm.empty();
  	cm.displayContactsAsATable("contacts");
}

function saveList() {
    cm.save();
  	cm.displayContactsAsATable("contacts");
}

function loadList() {
	cm.load();
  	cm.displayContactsAsATable("contacts");
}

//Delete a contact from the list when click on a "bin button"
function removeContact(contactId) {
    //"contactId" is the index of selected contact
    cm.remove(contactId);
    cm.displayContactsAsATable("contacts");
}

//Return a list of contact found by his name 
function searchContact() { 
    //a timeout is init in the search input in order to execute the function 
    //each time a key is pressed
    let contactName = document.getElementById("Search");
  
    //Load the table which is saved on the "cm.add" and "cm.remove" functions
    //it allows to look in the last version of the table and to modify the input to infinity
    //the search will always be correct
    cm.load();
    cm.search(contactName)
    cm.displayContactsAsATable("contacts");
    return false;
}

//Sort contacts in differents way depending of which header is clicked
function orderByName() {
    cm.sortByName();
    cm.displayContactsAsATable("contacts");
}

function orderByLname() {
    cm.sortByLname();
    cm.displayContactsAsATable("contacts");
}

function orderByEmail() {
    cm.sortByEmail();
    cm.displayContactsAsATable("contacts");
}


//Create a class of contact
class Contact {
	constructor(name, lastName,email) {
		this.name = name;
        this.lastName = lastName;
		this.email = email;
	}
}

//Create a class of contact manager which is defined by the contact class elements
//Initialize methods used to make working the html window
class ContactManager {
	constructor() {
	this.listOfContacts = [];
	}
	
	addTestData() {
		let c1 = new Contact("Jimi", "Hendrix", "jimi@rip.com");
  		let c2 = new Contact("Robert", "Fripp", "robert.fripp@kingcrimson.com");
  		let c3 = new Contact("Angus", "Young", "angus@acdc.com");
  		let c4 = new Contact("Arnold", "Schwarzenneger", "T2@terminator.com");
		
		this.add(c1);
		this.add(c2);
		this.add(c3);
		this.add(c4);
		
		// Let's sort the list of contacts by Name
		this.sortByName();
	}
	
	// Will erase all contacts
	empty() {
		this.listOfContacts = [];
	}
  
    add(contact) {
		this.listOfContacts.push(contact);
        this.sortByName();

        //Save the table each time you add a new contact
        //for the purposes of the "searchContact" function 
        this.save();
    }
    
    //Remove a contact by clicking on a trashbin  
    remove(index) {
		this.listOfContacts.splice(index,1)
        
        //Save the table each time you remove a contact
        //for the purposes of the "searchContact" function 
        this.save();
	}
    
    //Sort table to differents ways  
	sortByName() {
		this.listOfContacts.sort(ContactManager.compareByName);
	}
    sortByLname() {
		this.listOfContacts.sort(ContactManager.compareByLname);
	}
    sortByEmail() {
		this.listOfContacts.sort(ContactManager.compareByEmail);
	}
  	
	//class method for comparing two contacts by name
    //toUpperCase method is use to sort contact without care of uppercase
	static compareByName(c1, c2) {
        if (c1.name.toUpperCase() < c2.name.toUpperCase())
     		return -1;
		
        if (c1.name.toUpperCase() > c2.name.toUpperCase())
     		return 1;
  
    	return 0;
	}
    static compareByLname(c1, c2) {
        if (c1.lastName.toUpperCase() < c2.lastName.toUpperCase())
     		return -1;
		
        if (c1.lastName.toUpperCase() > c2.lastName.toUpperCase())
     		return 1;
  
    	return 0;
	}
    static compareByEmail(c1, c2) {
        if (c1.email.toUpperCase() < c2.email.toUpperCase())
     		return -1;
		
        if (c1.email.toUpperCase() > c2.email.toUpperCase())
     		return 1;
  
    	return 0;
	}
    
  	printContactsToConsole() {
		this.listOfContacts.forEach(function(c) {
			console.log(c.name);
		});
	}
	
	load() {
		if(localStorage.contacts !== undefined) {
			// the array of contacts is savec in JSON, let's convert
			// it back to a reak JavaScript object.
			this.listOfContacts = JSON.parse(localStorage.contacts);
		}
	}
	
	save() {
        localStorage.contacts = JSON.stringify(this.listOfContacts);
    } 
    
    //search contact is like remove contact that not correspond to the research
    //There is no need to put the entire contact's name
    search(contactName) {
        for(let j=0; j < contactName.value.length; j++) {
              
      //We compare the names letter by letter and remove when there is no corresponding
            for(let i = 0; i < this.listOfContacts.length; i++) { 
            
		        let c = this.listOfContacts[i];
        		//Changing letters to uppercase so search "a" give the same result than "A" 
        		let letterC = c.name.substring(j,j+1).toUpperCase();
        		let letterContactName = contactName.value.substring(j,j+1).toUpperCase(); 
              
       			 if (letterC !== letterContactName) {
            		 this.listOfContacts.splice(i, 1);
            		 i -= 1; 
            		 j -= 1; } 
        }
      }
    }  
  
	
  	displayContactsAsATable(idOfContainer) {
		// empty the container that contains the results
    	let container = document.querySelector("#" + idOfContainer);
    	container.innerHTML = "";

		
		if(this.listOfContacts.length === 0) {
			container.innerHTML = "<p>No contacts to display!</p>";
			// stop the execution of this method
			return;
		}  
  
    	// creates and populate the table with users
    	let table = document.createElement('table');
      
      
       	// change the way that the table is build for making identifiable trashbin
        for(let i = 0; i < this.listOfContacts.length; i++) { 
            let c = this.listOfContacts[i];
            
            // creates a row
        	let row = table.insertRow();
            let trashbin = document.createElement("img"); 
            trashbin.src = "http://i.imgur.com/yHyDPio.png"; 
         
			row.innerHTML =   "<td>" + c.name + "</td>"
                            + "<td>" + c.lastName + "</td>"
							+ "<td>" + c.email + "</td>"
							+ "<img onclick=removeContact("+i+") src="+trashbin.src+">";       	   }
                
  
     	// add head to the table
        let header = table.createTHead();
        header.innerHTML =   "<th onclick=orderByName()>Name</th>"
                           + "<th onclick=orderByLname()>lastName</th>"
                           + "<th onclick=orderByEmail()>Email</th>"
                           + "<th>Trashbin</th>";
        
        //add caption to the table
        let caption = table.createCaption();
        caption.innerHTML = "<caption>List of contacts</caption>";
      
        // adds the table to the div 
     	container.appendChild(table);
	}
}