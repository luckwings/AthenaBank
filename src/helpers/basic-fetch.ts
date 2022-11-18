export function get<T>(endPoint: string) {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/${endPoint}`).then((response) => {
    if (response.status === 200) {
      return response.json() as Promise<T>;
    } else {
      throw new Error(response.statusText);
    }
  });
}
