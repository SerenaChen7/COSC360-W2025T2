export async function runRoute(router, { method, path, req, res }) {
  const routeLayer = router.stack.find(
    (layer) =>
      layer.route &&
      layer.route.path === path &&
      layer.route.methods[method.toLowerCase()]
  );

  if (!routeLayer) {
    throw new Error(`Route not found for ${method.toUpperCase()} ${path}`);
  }

  const handlers = routeLayer.route.stack.map((layer) => layer.handle);
  let index = 0;

  async function next(error) {
    if (error) {
      throw error;
    }

    const handler = handlers[index++];
    if (!handler) {
      return undefined;
    }

    return Promise.resolve(handler(req, res, next));
  }

  return next();
}
