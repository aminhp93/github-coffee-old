const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const config = {
  pusher: {
    app_id: '1435319',
    key: '15ee77871e1ed5258044',
    secret: '4c2b97bec11d18dc8a13',
    cluster: 'ap1',
  },
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const pusher = new Pusher({
  appId: config.pusher.app_id,
  key: config.pusher.key,
  secret: config.pusher.secret,
  cluster: config.pusher.cluster,
  encrypted: true,
});
app.set('PORT', process.env.PORT || 5000);

app.post('/api/message', (req, res) => {
  const payload = req.body;
  pusher.trigger('chat', 'message', payload);
  res.send(payload);
});

app.listen(app.get('PORT'), () =>
  console.log('Listening at ' + app.get('PORT'))
);
