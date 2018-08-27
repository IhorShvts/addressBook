import  BookItem from './bookItem';
import  App from './app';
import AddressBook from './addbook';

const doc = document;

// ****************
// Modal
const addModal = new Modal(doc.querySelector('#fullModal'),{ keyboard: true });
const regModal = new Modal(doc.querySelector('#regModal'));
export const infoModal = new Modal(doc.querySelector('#infoModal'));
export const editModal = new Modal(doc.querySelector('#editModal'));
export const matchesModal = new Modal(doc.querySelector('#matchesModal'));
export const importModal = new Modal(doc.querySelector('#import'));

// ***************
// listeners
doc.querySelector('#btn-delete').addEventListener('click', () => { if(confirm("Delete?")) {app.UserBook.del() }});
doc.querySelector('#btn-open').addEventListener('click', () => { addModal.show() });
doc.querySelector('#btn-regModal').addEventListener('click', () => { regModal.show() });
doc.querySelector('#SignIn').addEventListener('click', () => { app.login() });
doc.querySelector('#SignUp').addEventListener('click', () =>{ app.register() });
doc.querySelector('#btn-exit').addEventListener('click', () => { app.exit() });
doc.querySelector('#btn-info').addEventListener('click', () => { infoModal.toggle(); app.UserBook.fullView() });
doc.querySelector('#btn-select-all').addEventListener('click', () => { app.UserBook.checkAll() });
doc.querySelector('#importJson').addEventListener('click', () => { importModal.show() });
doc.querySelector('#btn-import').addEventListener('click', () => { app.UserBook.importJSON()});
doc.querySelector('#btn-allow').addEventListener('click', () => { matchesModal.hide();  addBook() });

// filters
// f - firstname l-lastname e -email n -number
doc.querySelector('#byF').addEventListener('click', () => { app.UserBook.filter('f') });
doc.querySelector('#byL').addEventListener('click', () => { app.UserBook.filter('l') });
doc.querySelector('#byE').addEventListener('click', () => { app.UserBook.filter('e') });
doc.querySelector('#byN').addEventListener('click', () => { app.UserBook.filter('n') });

// sN - place (city,country) sE - email, number w- work place, i - first,last name
doc.querySelector('#btn-search').addEventListener('click', () => {

    const sel = document.querySelector('#iSelect');
    const val = sel.options[sel.selectedIndex].value;
    if (val == 0) { app.UserBook.filter('p') }
    else { app.UserBook.filter('w') }

});

// paramsSearch
doc.querySelector('#search0').addEventListener('input', () => { app.UserBook.filter() });
doc.querySelector('#search1').addEventListener('input', () => { app.UserBook.filter() });
doc.querySelector('#search2').addEventListener('input', () => { app.UserBook.filter() });
doc.querySelector('#search3').addEventListener('input', () => { app.UserBook.filter() });
// **********
// autocomplete

function complete () {
    const input = document.querySelector('#place');
    const input2 = document.querySelector('#i5');
    const autocomplete = new google.maps.places.Autocomplete(input,{ types: ['(cities)'] });
    const autocomplete2 = new google.maps.places.Autocomplete(input2,{ types: ['(cities)'] })
}

// CSV format coverting
function ConvertToCSV(objArray) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line != '') line += ',';

            line += array[i][index];
        }

        str += line + '\r\n';
    }
    return str;
}

function downloadCSV() {
    const array = [{h1: 'first',h2:'last',h3:'email',h4:'number',h5:'city/country',h6:'work place'}];

    if (app.UserBook.checkedList.length == 0) { return alert('Select the  contacts what you want to export !') }
    for (let i = 0; i < app.UserBook.checkedList.length ; i++) {
        array.push(app.UserBook.items[app.UserBook.checkedList[i]])
    }

    console.log(array);
    const csvString = ConvertToCSV(array);

    const a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
    a.target      = '_blank';
    a.download    = 'myFile.csv';

    a.click()
}

// Start app
const app = new App();
app.start();



function addBook () {


	const d = document;
	const fname = d.querySelector('#first-name').value;
	const lname = d.querySelector('#last-name').value;
	const email = d.querySelector('#email').value;
	const number = d.querySelector('#number').value;
	const place = d.querySelector('#place').value.replace(/,/gi,'/');
	console.log(place);
	const place2 = d.querySelector('#place2').value.replace(/,/gi,'/');
	const book = new BookItem(fname,lname,email,number,place,place2);


	document.querySelector('#addForm').reset();
	app.UserBook.append(book)

}


// ***************
// validate

const form1 = document.getElementsByClassName('needs-validation');

    let validation = Array.prototype.filter.call(form1, function(form) {
      document.querySelector('#btn-add').addEventListener('click', function(event) {

      	if (form.checkValidity() === true) {
      		const arr = [];
      		const number = document.querySelector('#number').value;
      		const email = document.querySelector('#email').value;



      		if (app.UserBook.items.length == 0) { addBook(); return false }
      		for (let i = 0; i < app.UserBook.items.length; i++) {
      			if (app.UserBook.items[i].number == number||app.UserBook.items[i].email == email){
      				arr.push({uid:i,item: app.UserBook.items[i]})
      			}

      		}
      			if (arr.length > 0) {
      				addModal.hide();
      				matchesModal.show();
      				app.UserBook.showMatches(arr)
      			} else {

      				addModal.hide();
      				addBook()

      			}
      	}

      		form.classList.add('was-validated');
      	}, false);
  });

const form2 = document.getElementsByClassName('needs-validation2');

    let validation2 = Array.prototype.filter.call(form2, function(form) {
      document.querySelector('#btn-save').addEventListener('click', function(event) {
        if (form.checkValidity() === true) {
          	app.UserBook.edit()
        }
        form.classList.add('was-validated');
      }, false);
    });
