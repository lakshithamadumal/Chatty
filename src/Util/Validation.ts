export const isValidFirstName = (firstName: string): string | null => {
  if (!firstName || firstName.trim().length === 0) {
    return "First name is required.";
  }
  return null;
};

export const isValidLastName = (lastName: string): string | null => {
  if (!lastName || lastName.trim().length === 0) {
    return "Last name is required.";
  }
  return null;
};

export const isValidCountryCode = (countryCode: string): string | null => {
  const countryCodePattern = /^\+\d{1,3}$/;
  if (!countryCode) {
    return "Country code is required.";
  }
  if (!countryCodePattern.test(countryCode)) {
    return "Please select a valid country code.";
  }
  return null;
};

export const isValidPhoneNumber = (phoneNumber: string): string | null => {
  const phoneNumberPattern = /^[1-9][0-9]{6,15}$/;
  if (!phoneNumber) {
    return "Phone number is required.";
  }
  if (!phoneNumberPattern.test(phoneNumber)) {
    return "Please enter a valid phone number.";
  }
  return null;
};

export const isvalidProfilePicture = (
  image: {
    uri: string;
    type?: string;
    fileSize?: number;
  } | null
): string | null => {
  if (!image) {
    return "Profile picture is required.";
  }
  if (
    image.type &&
    !["image/jpeg", "image/png", "image/jpg"].includes(image.type)
  ) {
    return "Select a valid image format (JPEG, PNG , JPG).";
  }
  return null;
};
