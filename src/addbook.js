import  BookItem from './bookItem';
import {infoModal,editModal,matchesModal,importModal} from './index';
export  default class AddressBook {
	constructor(book) {
		this.items = book.obj;
		this.uid = book.uid;
		this.checkedList = [];
		this.list = [];
		this.click = '';
		this.selectall = false;
	}

	// add book
	append(data) {
		this.items.push(data);
		this.save();
		this.load();
	}


	del() {
		this.checkedList.sort();
		for (let i = this.checkedList.length - 1; i > -1 ; i--) {
			this.items.splice(this.checkedList[i],1)
		}
		
		this.save();
		this.load()
	}

	importJSON() {
		const url = document.querySelector('#importurl').value;

		axios.get(url)
  			.then(response => {
    			let newArr = this.items.concat(response.data);
    			this.items = newArr;
    			this.save();
				this.load();
				document.querySelector('#importurl').value = '';
				importModal.hide()

  			})
 			.catch(error => {
    			console.log(error);
    			alert('Error, check the entered data')
  			})
	}

	load() {
		const table = document.querySelector('tbody');
		table.innerHTML = '';
		
		for (let i = 0; i < this.items.length; i++) {
			const tr = document.createElement('tr');
			tr.innerHTML = `<tr>
      							<th scope="row"><input type="checkbox" class="form-check-input" bid="${i}"></th>
      							<td>${this.items[i].fname}</td>
      							<td>${this.items[i].lname}</td>
      							<td>${this.items[i].email}</td>
      							<td>${this.items[i].number}</td>
    						</tr>`;
			table.append(tr)


		}
		const del = document.querySelector('#btn-delete');
		const upd = document.querySelector('#btn-info');
		if (upd.classList.contains('open')){upd.classList.remove('open')}
	    if (del.classList.contains('open')){del.classList.remove('open')}


		this.list = [];
		this.checkedList = [];
		this.multiSel()	
	}

	save() {
		localStorage.setItem('user', JSON.stringify({uid:this.uid,obj: this.items}))
	}

	// full info in modal 
	fullView () {
		const i = this.checkedList[0];

		document.querySelector('.values').innerHTML = 
					`
					<span>${this.items[i].fname}</span>
					<span>${this.items[i].lname}</span>
					<span>${this.items[i].email}</span>
					<span>${this.items[i].number}</span>
					<span>${this.items[i].place}</span>
					<span>${this.items[i].place2}</span> 
					`;

		document.querySelector('#btn-edit').addEventListener('click', () => { 

			const i = this.checkedList[0];

			infoModal.hide();
		
			document.querySelector('#i1').value = this.items[i].fname;
			document.querySelector('#i2').value = this.items[i].lname;
			document.querySelector('#i3').value = this.items[i].number;
			document.querySelector('#i4').value = this.items[i].email;
			document.querySelector('#i5').value = this.items[i].place;
			document.querySelector('#i6').value = this.items[i].place2;

			editModal.show()

		})

	}
	edit () {

			editModal.hide();
			const i = this.checkedList[0];
			const d = document;
			const fname = d.querySelector('#i1').value;
			const lname = d.querySelector('#i2').value;
			const number = d.querySelector('#i3').value;
			const email = d.querySelector('#i4').value;
			const place = d.querySelector('#i5').value;
			const place2 = d.querySelector('#i6').value;

			this.items[i] = new BookItem(fname,lname,email,number,place,place2);
			this.save();
			this.load();
	}
	// edit match
	matchesEdit(event) {
		const uid = event.target.getAttribute('bid');
		matchesModal.hide();

		document.querySelector('#i1').value = this.items[uid].fname;
		document.querySelector('#i2').value = this.items[uid].lname;
		document.querySelector('#i3').value = this.items[uid].number;
		document.querySelector('#i4').value = this.items[uid].email;
		document.querySelector('#i5').value = this.items[uid].place.replace(/,/gi,'/');
		document.querySelector('#i6').value = this.items[uid].place2.replace(/,/gi,'/');
		this.checkedList[0] = uid;

		editModal.show()
	}
	// modal witch matches
	showMatches(arr) {
		const table = document.querySelector('#ui2');
			table.innerHTML = '';

			for (let i = 0; i < arr.length; i++) {
				const tr = document.createElement('tr');
				tr.innerHTML = `<tr>
				<th scope="row"><div onclick="app.UserBook.matchesEdit(event)" class="btn btn-primary" bid="${arr[i].uid}">edit</div></th>
				<td>${arr[i].item.fname}</td>
				<td>${arr[i].item.lname}</td>
				<td>${arr[i].item.email}</td>
				<td>${arr[i].item.number}</td>
				</tr>`;
				table.append(tr)
			}
	}
	// sorting and search
	filter (method) {
		const items = this.items;
		const arr = [];

		let load = () => {
			const table = document.querySelector('tbody');
			table.innerHTML = '';

			for (let i = 0; i < arr.length; i++) {
				const tr = document.createElement('tr');
				tr.innerHTML = `<tr>
				<th scope="row"><input type="checkbox" class="form-check-input" bid="${arr[i].uid}"></th>
				<td>${arr[i].item.fname}</td>
				<td>${arr[i].item.lname}</td>
				<td>${arr[i].item.email}</td>
				<td>${arr[i].item.number}</td>
				</tr>`;
				table.append(tr)
			}
			const del = document.querySelector('#btn-delete');
			const upd = document.querySelector('#btn-info');
			if (upd.classList.contains('open')){upd.classList.remove('open')}
				if (del.classList.contains('open')){del.classList.remove('open')}


					this.list = [];
				this.checkedList = [];
				this.multiSel()	
			};

			let f = () => {
				if (this.click == 'f') { 
					this.items = items.reverse();
					this.save();
					this.load();
					return}
				this.click = 'f';
				items.sort(function(a, b){
					let nameA=a.fname.toLowerCase(), nameB=b.fname.toLowerCase();
					if (nameA < nameB) 
						return -1;
					if (nameA > nameB)
						return 1;
					return 0 
				});

				this.items = items;
				this.save();
				this.load();
			};

			let l = () => {

				if (this.click == 'l') { 
					this.items = items.reverse();
					this.save();
					this.load();
					return}

				this.click = 'l';
				items.sort(function(a, b){
					let nameA=a.lname.toLowerCase(), nameB=b.lname.toLowerCase();
					if (nameA < nameB) 
						return -1;
					if (nameA > nameB)
						return 1;
					return 0
				});

				this.items = items;
				this.save();
				this.load()
			};

			let e = () => {
				if (this.click == 'e') { 
					this.items = items.reverse();
					this.save();
					this.load();
					return}

				this.click = 'e';
	
				items.sort(function(a, b){
					let nameA=a.email.toLowerCase(), nameB=b.email.toLowerCase();
					if (nameA < nameB) 
						return -1;
					if (nameA > nameB)
						return 1;
					return 0 
				});

				this.items = items;
				this.save();
				this.load()

			};

			let n = () => {
				if (this.click == 'n') { 
					this.items = items.reverse();
					this.save();
					this.load();
					return}
				this.click = 'n';
				
				items.sort(function(a, b){
					let nameA=a.number.toLowerCase(), nameB=b.number.toLowerCase();
					if (nameA < nameB) 
						return -1;
					if (nameA > nameB)
						return 1;
					return 0 
				});

				this.items = items;
				this.save();
				this.load()

			};

			let searchPlace = () => {

				let search = document.querySelector('#search').value;
				if (search == '') {
					search = ' '
				}

				let f = 0;

				for (let i = 0; i < items.length; i++) {
					let str = items[i].place + ' ';

					if (!(str.match(eval('{' + ('/' + search + '/gi') + '}')) == null)) {
						let obj = {uid:i,item:items[i]};
						arr.push(obj);
						f +=  1;
						load()
					}
				}

				if (f === 0) { alert('Nothing found') }


			};
		let searchParams = () => {
			
			let search0 = document.querySelector('#search0').value;
			let search1 = document.querySelector('#search1').value;
			let search2 = document.querySelector('#search2').value;
			let search3 = document.querySelector('#search3').value.replace('+','');

			if (search0 == '') {search0 = ' '}
			if (search1 == '') {search1 = ' '}
			if (search2 == '') {search2 = ' '}
			if (search3 == '') {search3 = ' '}

			let f = 0;
			for (let i = 0; i < items.length; i++) {
				let str0 = items[i].fname + ' ';
				let str1 = items[i].lname + ' ';
				let str2 = items[i].email + ' ';
				let str3 = items[i].number + ' ';
				let check = true;
				
				if (str0.match(eval('{' + ('/' + search0 + '/gi') + '}')) == null) { check = false}
				if (str1.match(eval('{' + ('/' + search1 + '/gi') + '}')) == null) { check = false}
				if (str2.match(eval('{' + ('/' + search2 + '/gi') + '}')) == null) { check = false}
				if (str3.match(eval('{' + ('/' + search3 + '/gi') + '}')) == null) { check = false}

				if (check == true)		
				  {
					let obj = {uid:i,item:items[i]};
					f +=  1;
					arr.push(obj);
					load()
				} else {
					load()
				}
			}

			
		};

	let searchWork = () => {

		let search = document.querySelector('#search').value;

		if (search == '') {
			search = ' '
		}
		let f = 0;
		for (let i = 0; i < items.length; i++) {
			let str = items[i].place2 + ' ';

			if (!(str.match(eval('{' + ('/' + search + '/gi') + '}')) == null)) {
				
				let obj = {uid:i,item:items[i]};
				f +=  1;
				arr.push(obj);
				load()
			}
		}

		if (f === 0) { alert('Nothing found') }

	};

switch (method) {

	case 'f': f(); break;
	case 'l': l(); break;
	case 'e': e(); break;
	case 'n': n(); break;
	case 'p': searchPlace(); break;
	case 'w': searchWork(); break;
	default: searchParams(); break;
}
}
	// multiselecting
	multiSel() {
		const box = document.querySelectorAll('.form-check-input');
		let result;
	
		for (let i = 0; i < box.length; i++) {
		    result = box[i];
		  
		    if (this.list.indexOf(parseInt(result.getAttribute('bid'),10)) < 0) {
		    	this.list.push(parseInt(result.getAttribute('bid'),10));
	
		    	result.addEventListener('change', (e) => {
		    		
		    		const bid = parseInt(e.target.getAttribute('bid'));

		    		// check
		    		if (e.target.checked) {
		    			if (this.checkedList.indexOf(bid) < 0) { this.checkedList.push(bid) }
		    		} else {
		    			this.checkedList.splice(this.checkedList.indexOf(bid),1)
		    		}

		    		// show/hide buttons
		    		const del = document.querySelector('#btn-delete');
		    		const upd = document.querySelector('#btn-info');

	    			if (this.checkedList.length == 1) {
	    				if (!del.classList.contains('open')){del.classList.toggle('open')}
	    				upd.classList.toggle('open')
	    			} else if(this.checkedList.length > 1) {   
	    				if (upd.classList.contains('open')){upd.classList.toggle('open')}	
	    			} else if (this.checkedList.length == 0) {
	    				if (upd.classList.contains('open')){upd.classList.toggle('open')}
	    				if (del.classList.contains('open')){del.classList.toggle('open')}
	    			}
				})
	    	}	    
		}
	}

	checkAll () {
		const checkboxes = document.querySelectorAll('.form-check-input');
		let value = true;
		let event = new Event("change");

		if (this.selectall == true) { 
			value = false;
			this.selectall = false;

			for (let i = 0; i < checkboxes.length; i++) {
				checkboxes[i].checked = value;
				checkboxes[i].dispatchEvent(event)
			}

		} else { 
			this.selectall = true;

			for (let i = 0; i < checkboxes.length; i++) {
				checkboxes[i].checked = value;
				checkboxes[i].dispatchEvent(event)	
			}
		}

		// show/hide buttons
		const del = document.querySelector('#btn-delete');
		const upd = document.querySelector('#btn-info');

	    if (this.checkedList.length == 1) {
	    	if (!del.classList.contains('open')){del.classList.toggle('open')}
	    	upd.classList.toggle('open')
	    } else if(this.checkedList.length > 1) {  
	    	if (!del.classList.contains('open')){upd.classList.toggle('open')}	
	    	if (upd.classList.contains('open')){upd.classList.toggle('open')}	
	    } else if (this.checkedList.length == 0) {
	    	if (upd.classList.contains('open')){upd.classList.toggle('open')}
	    	if (del.classList.contains('open')){del.classList.toggle('open')}
	    }
		this.multiSel()
	}
}
