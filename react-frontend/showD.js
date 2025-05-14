const fs = require("fs");
const csv  = require("csvtojson");

csv()
  .fromFile("/home/seif/Desktop/Health-Care-master/Expert-System/datasets/Symptom-severity.csv")
  .then((obj) => {
    console.log("data:- ", obj);
    const file = `Medicine_Details${Date.now()}.json`;
    fs.writeFileSync(file, JSON.stringify(obj, null, 4));
  })
  .catch((error) => {
    console.log(error);
  });
