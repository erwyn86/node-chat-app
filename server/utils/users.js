[{
  id: '/#asdsadasdasdasd',
  name: 'Ervin',
  room: 'The Office Fans'
}]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {

  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = new Person(id, name, room);
    this.users.push(user)
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }


  getUserList(room) {
    var users = this.users.filter((user) =>  user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

class Person {
  constructor(id, name, room) {
    this.id = id;
    this.name = name;
    this.room = room;
  }

  getUserDescription() {
    //return  `${this.name} is ${this.age} year(s) old.`;
    return  `${this.name}`;
  }


}

module.exports = {Users}

//
// var me = new Person('Ervin', 32);
// var description = me.getUserDescription();
// console.log(description);
