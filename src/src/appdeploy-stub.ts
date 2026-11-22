export const api = {
  get: async () => ({ data: null }),
  post: async () => ({ data: null }),
  put: async () => ({ data: null }),
  delete: async () => ({ data: null }),
};

export const auth = {
  getUser: async () => null,
  login: async () => null,
  logout: async () => null,
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
};
