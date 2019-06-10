require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndRemove("5ce5a2e134aeee343e363f72")
//   .then(task => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(e => {
//     console.log(e);
//   });

const updateAndRemove = async id => {
  const removed = await Task.findByIdAndRemove(id);
  const count = await Task.countDocuments({ completed: false });
  return removed;
};

updateAndRemove("5ce6627c9d2089588abffb38")
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });
