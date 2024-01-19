interface responseError extends Error {
  response: {
    status: number;
  };
}

export default responseError;
