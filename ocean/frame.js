export const requestBackgroundFrame = (_target, callback) => requestAnimationFrame(callback);
export const cancelBackgroundFrame = id => cancelAnimationFrame(id);
