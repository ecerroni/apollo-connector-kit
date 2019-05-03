export default (error, message) => {
  if (error) {
    if (message) {
      throw new Error(message);
    }
    throw new Error(error);
  }
  return null;
};
