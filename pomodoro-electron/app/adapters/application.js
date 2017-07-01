import PouchDB from 'pouchdb';
import { Adapter  } from 'ember-pouch';

//var remote = new PouchDB('http://localhost:5984/my_couch');
var db = new PouchDB('local_pouch');

export default Adapter.extend({
  db: db
});
