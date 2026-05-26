import 'dotenv/config'; 

const config = {
  mongodb: {
    url: process.env.MONGODB_URI,
    databaseName: "local-services",
    options: {}
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  
  moduleSystem: 'esm', 
};

export default config; // Exportação moderna