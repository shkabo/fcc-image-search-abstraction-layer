const express = require('express');
const router = express.Router();
const config = require('../config/config.js');
const helper = require('../helper');
const request = require('request');
const mongo = require("mongodb").MongoClient;


/**
 * api_endpoint - api endpoint url
 * api_query - query string for search
 * api_num - number of results
 * api_offset - the "offset" of the results
 * api_search_type - must be set to "image"
 * api_key - an API key, obtained from https://console.developers.google.com/
 * api_cx - he custom search engine ID from the previous section
 */
const api_endpoint = 'https://www.googleapis.com/customsearch/v1?';
const api_query = 'q=';
const api_num = 'num=10';
const api_offset = 'start=';
const api_search_type = 'searchType=image';
const api_key = 'key=' + config.gkey;
const api_cx = 'cx=' + config.gcx;

// for testing purpose
router.get('/', (req, res) => {
  res.send("Welcome");
});

router.get('/imagesearch/:query', (req, res) => {
  //build query strings
  let query = api_query + encodeURI(req.params.query);
  let offset = api_offset + 1;

  // store search term in db
  mongo.connect(config.mongo, (err, db) => {
    if (err) throw console.error(err);

    let collection = db.collection("imgsearch");
    let date = new Date();
    collection.insert({ term: req.params.query, when: date.toISOString()});
    db.close();
  });

  if (req.query.offset) {
    offset = api_offset + req.query.offset;
  }

  let url = helper.buildUrl([query, api_num, offset, api_search_type, api_key, api_cx]);
  // do the request and fetch data
  let full_url = api_endpoint + url;
  request.get(full_url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
        let info = JSON.parse(body);
        res.send(helper.parseUrl(info));
    }
  });
});

router.get('/latest/imagesearch/', (req, res) => {
  //return latest search results
  mongo.connect(config.mongo, (err, db) => {
    if (err) throw console.error(err);

    // get last 10 search records from db and display it i json
    db.collection('imgsearch')
    .find(
      {},
      {_id:0, term: 1, when: 1}
    ).sort({_id: -1})
    .limit(10)
    .toArray((err, doc) => {
      if (err) throw console.error(err);
      res.status(200).send(doc);
      
      db.close();
      return;
    });
    
  });
});

module.exports = router;
