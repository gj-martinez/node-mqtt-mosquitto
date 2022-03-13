var mysql = require("mysql")
console.log("llega aca")
function insert(pool, data,callback){
    let insertQuery = "INSERT INTO `tesis`.`metric` (`id_user`, `type`, `value`, `created`) VALUES (?, ?,?, ?)"
    console.log(data)
    let query = mysql.format(insertQuery,[data.user_id,data.topic,data.value,data.created])
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(query, function(err, result) {
            if (err) throw err;
            callback(result)
            
            connection.release();
        });
    });
    
}

module.exports = insert;