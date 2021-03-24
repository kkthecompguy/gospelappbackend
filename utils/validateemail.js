const validateEmail = (emailphone) => {
  const isValidEmail =  emailphone.includes('@');
  if (isValidEmail) {
    return true
  } else {
    return false
  }
}

module.exports = validateEmail;