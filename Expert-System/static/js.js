const subBnt = document.querySelector(".submit");

async function predict({symptoms}) {
  try {

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({
        symptoms
      }),
      headers: {
        "Content-Type":"application/json",
        "Access-Control-Allow-Origin":"*",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);

    }
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

const form = document.querySelector(".form")

form.addEventListener('change',(e)=>{
  e.preventDefault()
})

subBnt.addEventListener("click", (e) => {
  e.preventDefault();
  const getSymptoms = document.querySelector(".unique");
  let symptomsVal = getSymptoms.value.trim();


  if (!symptomsVal) {
    console.log("Please enter symptoms before submitting.");
    return;
  }
  predict({symptoms:[symptomsVal]});
});
