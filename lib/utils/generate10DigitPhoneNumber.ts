export const generate10DigitPhoneNumber = () => {
  let phoneNumber = '+91 ';
  for(let i=0; i<10; i++){
      phoneNumber += Math.floor(Math.random() * 10);
  }
  return phoneNumber;
}

