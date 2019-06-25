export default async ({ res, req }) =>
  // Attach additional properties to context if needed
  ({
    user: req.user,
    res,
    req
  });
