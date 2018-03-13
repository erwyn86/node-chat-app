const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Ervin',
      room: 'Node Course'
    },
    {
      id: '2',
      name: 'Jen',
      room: 'React Course'
    },
    {
      id: '3',
      name: 'Julie',
      room: 'Node Course'
    }]
  });


  it('Should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Ervin',
      room: 'The Office Fans'
    };

    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);


  });


    it('Should remove a user', () => {
      var originalLength = users.users.length;
      users.removeUser('1');
      expect(users.users.length).toEqual(originalLength - 1);
    });

    it('Should not remove a user', () => {
      var originalLength = users.length;
      users.removeUser('5');
      expect(users.length).toEqual(originalLength);
    });

    it('Should find user', () => {
      var user = users.getUser('1');

      expect(user.id).toEqual('1');
    });

    it('Should not find user', () => {
      var user = users.getUser('6');

      expect(user).toNotExist();
    });

    it('Should return Node users', () => {
      var userList = users.getUserList('Node Course');

      expect(userList).toEqual(['Ervin', 'Julie']);
    });

    it('Should return React users', () => {
    var userList = users.getUserList('React Course');

    expect(userList).toEqual(['Jen']);
  });
});
