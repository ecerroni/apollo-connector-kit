import initLoaders from '../dataloaders';

export const context = async ({ res, req }) =>
  // Attach additional properties to context if needed
  ({
    user: req.user, res, req, loaders: initLoaders(),
  });

