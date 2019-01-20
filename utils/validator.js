var emailValidator = require("email-validator");
var PasswordValidator = require('password-validator');
var passwordValidator = new PasswordValidator();
passwordValidator
.is().min(8)                                    // Minimum length 8                                 // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits() 
.has().symbols()                                // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = {
    emailValidator,
    passwordValidator
}