var User = require('./model/pipeline').User,
    constants = require('./Utility/constants').constants,
    Crypto = require('./Utility/cryptolib');


// var createAdmin = function(username, password, email) {
//          User.findAdmin(function(err, result){
//             if( result.length != 0 ){
//                 console.log("Admin already exist");
//             }
//             else{
//                 var data = {};
//                 data.email = email;
//                 data.username = username;
//                 data.password = Crypto.encrypt(password);
//                 data.firstName = 'Karn';
//                 data.lastName = 'Prem';
//                 data.scope = [0];
//                 data.isActive= true;
//                 data.isEmailVerified = true;

//                 User.saveUser( data, function(err, user) {
//                     if (!err) {
//                         var tokenData = {
//                             userName: user.userName,
//                             scope: [user.scope],
//                             id: user._id
//                         };
//                         console.log( "Admin successfully created" );
//                     } else {
//                         if ( constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code ) {
//                             console.log("user name already registered");
//                         } else console.log(err);
//                     }
//                 });
//             }
//          });
// };

var createPipe = function() {
         Pipeline.findPipeLine(function(err, result){
            if( result.length != 0 ){
                console.log("Pipeline available");
            }
            else{
                var data = {};
                data.fromCity = "gujrat",
                data.toCity = "barmer",
                data.pipeName = "gujrat to barmer",
                data.length = 34,
                data.diameter= 10,
                data.density = 870,
                data.pressure= 45,
                data.viscosity = 28.28,
                Pipeline.savePipeline( data, function(err, user) {
                    if (!err) {
                        console.log( "Pipe created successfully" );
                    } else {
                        
                            console.log(err, err);
                        
                    }
                });
            }
         });
};


// {"fromCity":"gujrat","toCity":"barmer","pipeName":"gujrat to barmer","length":34,"diameter":10,"density":870,"pressure":45,"viscosity":28.28}



// createPipe('admin', 'password', 'sushant1@cronj.com');
// // createUser('admin', 'password', 'sushant1@cronj.com');
// // createUser('admin', 'password', 'sushant1@cronj.com');