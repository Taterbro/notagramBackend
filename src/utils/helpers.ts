export function passwordValidator(iss: any) {
  if (iss.format === "passwordFormat") {
    const validPattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    if (!validPattern.test(String(iss.input))) {
      return "Invalid password";
    }
    if (String(iss.input).length < 8) {
      return "Passwords must be at least 8 characters long";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(String(iss.input))) {
      return "Passwords must have at least one special character";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])/.test(String(iss.input))) {
      return "Passwords must be a combination of uppercase and lowercase passwords";
    }
    if (!/\d/.test(String(iss.input))) {
      return "Passwords must be a combination of letters and numbers";
    }
  }
}
