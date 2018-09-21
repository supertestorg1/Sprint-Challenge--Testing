const req = require('supertest');
const server = require('./server');

describe('server.js', () => {
  describe('GET /games', () => {
    let res;

    beforeAll(async () => {
      res = await req(server).get('/games');
    });

    it('should return an OK http code (200)', () => {
      expect(res.status).toBe(200);
    });

    it('should return an array', () => {
      expect(Array.isArray(res.body)).toBe(true);
    });

    if (res.body.length > 0) {
      it('should have game objects structured correctly', () => {
        expect(
          res.body[0].hasOwnProperty('title') && 
          res.body[0].hasOwnProperty('genre')
        ).toBe(true);
      });
    }
  });

  describe('POST /games', () => {
    let res;

    beforeAll(async () => {
      res = await req(server).post('/games')
        .send({
          'title': 'Pacman',
          'genre': 'Arcade',
          'releaseYear': 1980
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
    });

    it('should return a Created http code (201)', () => {
      expect(res.status).toBe(201);
    });

    it('should return a number (the newly created game\'s id)', () => {
      expect(typeof res.body).toBe('number')
    });

    it('should return a Created http code (201) when only given a title and genre', async () => {
      const goodRes = await req(server).post('/games')
        .send({
          'title': 'Pacman',
          'genre': 'Arcade'
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      expect(goodRes.status).toBe(201);
    });

    it('should return an Unprocessable Entity http code (422) if not given genre.', async () => {
      const badRes = await req(server).post('/games')
        .send({
          'title': 'Pacman',
          'releaseYear': 1980
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      expect(badRes.status).toBe(422);
    });

    it('should return an Unprocessable Entity http code (422) if not given title.', async () => {
      const badRes = await req(server).post('/games')
        .send({
          'genre': 'Arcade',
          'releaseYear': 1980
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      expect(badRes.status).toBe(422);
    });
  });
});
