// MongoDB connection helper for saving structured canvas documents and layer trees

export interface MongoConfig {
  uri?: string;
}

export const getMongoConfig = (): MongoConfig => {
  return {
    uri: process.env.MONGODB_URI,
  };
};

export const isMongoConfigured = (): boolean => {
  return Boolean(process.env.MONGODB_URI);
};
