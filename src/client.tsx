const githubApiUrl = "https://api.github.com/";

async function getFromApi(url: string) {
  const response = await fetch(url);
  const body = await response.json();
  if (response.status !== 200) {
    throw new Error(
      "request failed with error code=" +
        response.status +
        ", body: " +
        JSON.stringify(body)
    );
  }
  return body;
}

export const client = {
  getUsersList: async (since: number) => {
    const url = githubApiUrl + "users?per_page=12&since=" + since;
    return getFromApi(url);
  },
  getUserDetails: async (login: string) => {
    const url = githubApiUrl + "users/" + login;
    return getFromApi(url);
  },
};
