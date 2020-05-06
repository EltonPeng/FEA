var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler   = require('errorhandler'),
    morgan         = require('morgan'),
    redis          = require('redis');

var app = module.exports = express();
var client = redis.createClient(6379, 'redis');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/'));
app.use('/build', express.static('public'));

var env = process.env.NODE_ENV;
if ('development' == env) {
  app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
}

if ('production' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/items', (req, res) => {
  return client.get('items', (error, result) => {
    return res.status(200).json(JSON.parse(result));
  });
});

app.get('/item', (req, res) => {
  const defaultItems = [
  {
    id: 1,
    header: 'Default Item',
    content: 'I am from Redis'
  }];
  client.set('items', JSON.stringify(defaultItems));
  return res.send('redis setSuccess');
});

app.listen(8080);
console.log('Magic happens on port 8080...');