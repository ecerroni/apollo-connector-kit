export const context = async ({ res, req }) => {
  // Attach additional properties to context if needed
  return { user: req.user, res, req };
};

