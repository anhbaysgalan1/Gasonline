var Database = new (require("../Database/Connection"))()
module.exports = (pathFile) => {
  if(pathFile == "Database") return Database
  return require(`../${pathFile}`)
}
