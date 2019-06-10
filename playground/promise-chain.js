require("../src/db/mongoose");
const User = require("../src/models/user");

//5ce59ea31c6eec2e6148af01

// User.findByIdAndUpdate("5ce59ebb6199fc2ea2e15a27", { age: 1 })
//   .then(user => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(e => {
//     console.log(e);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return user;
};

updateAgeAndCount("5ce59ebb6199fc2ea2e15a27", 2)
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });
