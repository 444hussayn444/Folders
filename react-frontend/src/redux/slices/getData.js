export default async function getFromDb() {
  try {
    const token = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(
      "http://127.0.0.1:5000/get-products-cart",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.userdata.token}`,
        },
      }
    );
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      return null;
    } else {
      const data = await response.json();
      console.log(data)
       console.log(data)
      return data.cart_data.filter((i) => i.Cart_ID === token?.userdata.id)
    }
  } catch (error) {
    console.log(error);
  }
}


