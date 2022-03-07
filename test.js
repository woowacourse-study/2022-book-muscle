const getInformation = function (baseUrl) {
  return function (path) {
    return function (id) {
      return fetch(baseUrl + path + "/" + id);
    };
  };
};

const getInformation = baseUrl => path => id =>
  fetch(baseUrl + path + "/" + id);
