const environment = process.env.NODE_ENV || 'development';
const local = "mongodb://localhost:27017/chatapp"
const deploy = 'mongodb+srv://olivierhery:BHsfLqjClb3Ss02F@chatappcluster.z3oku.mongodb.net/chatapp?retryWrites=true&w=majority'

console.log(environment);
let database;
if (environment === 'development') {
    database = local;
} else {
    database = deploy;
}

exports.DATABASE = database;