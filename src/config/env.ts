// Single place for anything that can change between environments.
export const env = {
  baseURL: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  username: process.env.ORANGEHRM_USER ?? 'Admin',
  password: process.env.ORANGEHRM_PASSWORD ?? 'admin123',
};

// Where the logged-in session is stored after the setup project runs.
export const authFile = '.auth/admin.json';
