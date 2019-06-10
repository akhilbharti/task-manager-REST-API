const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 2000);
  });
};

const dowork = async () => {
  const sum = await add(2, 4);
  const sum2 = await add(sum, 1);
  const sum3 = await add(sum2, 1);
  return sum3;
};
dowork()
  .then(result => {
    console.log("result", result);
  })
  .catch(error => {
    console.log(error);
  });
