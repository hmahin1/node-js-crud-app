

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');

chai.use(chaiHttp);

describe('/register user', () => {
  it('user registration', (done) => {
    let registerUserObj= {
            email: "abc@gmail.com",
            name: "abc",
            password:"abcd1234"
    }
    chai.request(server)
        .post('/api/auth/register')
        .send(registerUserObj)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.code(200);
          expect(res).to.have.status(true);
          done();
        });

  });
});

describe('/login user', () => {
  it('user login', (done) => {
    let loginUserObj= {
            email: "abc@gmail.com",
            password:"abcd1234"
    }
    chai.request(server)
        .post('/api/auth/login')
        .send(loginUserObj)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.code(200);
          expect(res).to.have.status(true);
          done();
        });

  });
});

describe('/GET items', () => {
    it('it should GET all the items', (done) => {
      chai.request(server)
          .get('/api/user/items')
          .set('token','0fnGzlkxjbMemCKzl9crG9LqXQbk2US+k7SnaNkU')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.code(200);
            expect(res).to.have.status(true);
            expect(res).to.have.status(true);
            expect(res.body).should.be.a('array');
            done();
          });
    });
});

describe('/add item', () => {
  it('add item', (done) => {
    let addItemObj= {
            name: "abc",
            price: 50,
            quantity: 50,
    }
    chai.request(server)
        .post('/api/user/add-item')
        .set('token','0fnGzlkxjbMemCKzl9crG9LqXQbk2US+k7SnaNkU')
        .send(addItemObj)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.code(200);
          expect(res).to.have.status(true);
          done();
        });
  });
});

describe('/delete item', () => {
  it('delete item', (done) => {
    let id = 5;
    chai.request(server)
        .delete('/api/del-item/' + id)
        .set('token','0fnGzlkxjbMemCKzl9crG9LqXQbk2US+k7SnaNkU')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.code(200);
          expect(res).to.have.status(true);
          done();
        });
  });
});