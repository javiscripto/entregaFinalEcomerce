

const sendData = document.getElementById("send-form").addEventListener("submit", (e)=>{
    e.preventDefault();
  
    

    const productId= document.getElementById("product-id").innerText;
    const cart= document.getElementById("cart").value;
    const quantity= document.getElementById("quantity").value;


    fetch(`/api/carts/${cart}/products/${productId}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({quantity:quantity})
    })
    // .then(response=>{
    //     if(response.ok){
    //         alert(`se ha agregado el producto ${productId} al carrito ${cart}`);
            
    //     }else if(response.status===400){
    //         alert("no se ha podido agregar el producto")
    //     }
    // })
    .catch(error=>{
        alert("error en la solicitud");
        console.log("ha ocurrido un error: ", error)
    })
    

})






//      /api/carts/{{cart}}/products/{{pid}}