import AddressBook from './addbook';
export default class App {
    constructor() {
        this.UserBook = null
    }

    // set login page or register page
    page(data) {
        const sp = document.querySelector('#startPage');
        const lp = document.querySelector('#LoginedSide');

        if (data == 0) {
            if (sp.classList.contains('open')){sp.classList.remove('open')}
            if (lp.classList.contains('open')){lp.classList.remove('open')}
        } else if ( data == 1 ) {
            if (!sp.classList.contains('open')){sp.classList.add('open')}
            if (lp.classList.contains('open')){lp.classList.remove('open')}
        } else {
            if (sp.classList.contains('open')){sp.classList.remove('open')}
            if (!lp.classList.contains('open')){lp.classList.add('open')}
        }
    }

    // start app, set login page or user address boook interface
    start() {
        this.page(0);

        if (localStorage.getItem('user') == null) {
            if (localStorage.getItem('Data') == null) { app.init() } else { return this.page(1) }
        } else { return app.load() }
    }

    // load books
    load () {
        const obj = JSON.parse(localStorage.getItem('user'));

        this.page(2);
        this.UserBook = new AddressBook(obj);
        this.UserBook.load();
        this.UserBook.multiSel();

    }

    // first starting
    init() {
        const obj = JSON.stringify({users: [{ Username: "root",Password: "",Books: []}]});
        localStorage.setItem('Data', obj);
        localStorage.setItem('user', JSON.stringify({uid: 0, obj: []}));

        return this.load()
    }

    login() {


        const u = document.querySelector('#lUserLogin').value;
        const p = document.querySelector('#lUserPass').value;
        const obj = JSON.parse(localStorage.getItem('Data'));

        document.querySelector('#loginForm').reset();
        let f = 0;

        for (let i = 0; i < obj.users.length; i++) {
            if (obj.users[i].Username == u) {

                if (obj.users[i].Password == p) {

                    const list = JSON.parse(localStorage.getItem('Data'));
                    localStorage.setItem('user',JSON.stringify({uid:i,obj:list.users[i].Books}));
                    f = 1;

                    return this.load()
                }
            }
        }

        if (f == 0) {
            alert('login or password entered incorrectly check input data');
        } else {
            return false
        }
    }

    register() {

        const u = document.querySelector('#UserLogin').value;
        const p = document.querySelector('#UserPass').value;
        if(u || p === null) {
            alert('fill all the fields');
        }else {
            const obj = {Username: u,Password: p,Books: []};

            const data = JSON.parse(localStorage.getItem('Data'));
            data.users.push(obj);
            localStorage.setItem('Data',JSON.stringify(data));
            localStorage.setItem('user',JSON.stringify({uid:data.users.length-1,obj:[]}));

            document.querySelector('#regForm').reset();
            regModal.hide();

            return this.load()
        }
    }

    exit () {
        const obj = JSON.parse(localStorage.getItem('Data'));
        const userObj = JSON.parse(localStorage.getItem('user'));

        obj.users[userObj.uid].Books = userObj.obj;

        localStorage.setItem('Data',JSON.stringify(obj));
        localStorage.removeItem('user');

        document.querySelector('#LoginedSide').classList.toggle('open');

        return this.start()
    }
}
