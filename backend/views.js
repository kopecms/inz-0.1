const views = (function () {

  const randomInt = () => {
    return Math.floor(Math.random() * 10000);
  };

  return {
    init(app) {
      app.get('/', (req, res, next) => {
        res.render('index', {});
      });
      app.post('/', (req, res) => {
        req.session.room = req.body.room;
        req.session.username = req.body.username;
        res.redirect('/game');
      });
      app.get('/game', (req, res, next) => {
        res.render('game', {
          username: req.session.username,
          room: req.session.room,
          randomInt: randomInt(),
        });
      });
      app.get('/mobile/:username', (req, res, next) => {
        res.render('mobile', {
          randomInt: randomInt(),
        });
      });
      app.get('/health-check', (req, res) => res.sendStatus(200));
    }
  };
})();

module.exports = views;