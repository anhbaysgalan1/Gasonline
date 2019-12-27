const {ObjectId} = use("mongodb")

module.exports = function (idString) {
  try {
    if (!ObjectId.isValid(idString)) throw new Error("invalid ObjectId")
    if (typeof idString == "string") return ObjectId(idString)
    return idString
  } catch (error) {
    throw error
  }
}
