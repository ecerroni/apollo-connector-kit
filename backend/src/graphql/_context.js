export const context = async (req) => {
  // Attach additional properties to context if needed
  return { user: req.user };
};

