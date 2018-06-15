import delay from './delay';

export default async (callApi, reject, nameApi) => {
  let retry = 0;
  while (true) {
    try {
      await callApi();
      // console.log(nameApi, 'success');
      return true;
    } catch (e) {
      retry += 1;
      await delay(3000);
      // console.log(`[${nameApi}] retry ${retry} failed, retrying`);
      if (retry === 3) {
        // console.log(`[${nameApi}] retry ${retry} failed, stop retry`);
        // throw new Error(nameApi, e)
        if (reject) {
          reject(e);
        }
        return false;
      }
    }
  }
};
