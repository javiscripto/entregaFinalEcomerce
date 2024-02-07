const cartID= document.getElementById("cartID").innerText;



const deleteBtn = document.querySelectorAll(".delete-btn");

deleteBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        const productID = btn.getAttribute("pid");
        
        fetch(`/api/carts/${cartID}/products/${productID}`,{
            method:"DELETE",
            headers:{"Content-Type":"application/json"}
        })
        .then(response=>{
            if(response.ok){
                alert("producto eliminado del carrito");
                location.reload()
            }else if(response.status==400){
                alert("ocurrio un error al eliminar el producto")
            }
        })
        .catch(error=>{
            console.error(`error interno del servidor :`, error)
        })
    });
});

