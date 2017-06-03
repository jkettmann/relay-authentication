export default class User {
  constructor(fields) {
    this.id = fields.id
    this.email = fields.email
    this.password = fields.password
    this.role = fields.role
    this.firstName = fields.firstName
    this.lastName = fields.lastName
  }
}
