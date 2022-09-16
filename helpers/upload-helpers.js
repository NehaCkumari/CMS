const path = require('path');

module.exports = {

    uploadDir:  path.join(__dirname, '../public/uploads/'),
    
    isEmpty: function(obj) {
        
        for(let key in obj) { 
            if(obj.hasOwnProperty(key)) { // I added the key param to the hasOwnProperty() method
                return false;
            }
        }
        
        return true;
        
    }
    
};