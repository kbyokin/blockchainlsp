const fs = require('fs');

// Data structure
// const data1 = [{
//     "name": "spizy2",
//     "password": "123",
//     "peer": "peer0"
// }];

// const data2 = JSON.stringify(data1);

// read JSON object from file
fs.readFile('user/userData.json', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    var json = JSON.parse(data);
    json.push(data1);
    console.log(json);

    fs.writeFile("user/userData.json", JSON.stringify(json), (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });

});