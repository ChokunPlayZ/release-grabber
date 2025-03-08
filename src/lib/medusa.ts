async function GuessitLookup(medusaurl: string, medusaapikey: string, filename:string) {
  const conf = {
    method: "GET",
    maxBodyLength: Infinity,
    headers: {
      "x-api-key": medusaapikey,
    },
  };

  const res = await fetch(`${medusaurl}/api/v2/guessit?release=${filename}`, conf);

  return await res.json();
}

export { GuessitLookup };
