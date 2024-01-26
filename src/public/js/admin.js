

//actualizar el rol de usuario desde la vista del administrador
const buttons= document.querySelectorAll(".update-role-btn")
buttons.forEach(btn=>{
    btn.addEventListener("click",()=>{
        let userId= btn.getAttribute("userid");
        let currentRole= btn.getAttribute("userRole")

        let newUserRole;
        currentRole =="user" ? (newUserRole = "premium") : (newUserRole = "user");
        fetch(`/api/users/premium/${userId}`,{
            method:"PUT",
            headers:{"Content-Type":`application/json`},
            body: JSON.stringify({role:newUserRole})
        })
        .then(response=>{
            if(response.ok){
                alert("rol actualizado");
                location.reload();
            }else if(response.status===400){
                alert("el usuario no puede actualizar su rol")
            }
        })
        .catch(error=>{
            console.error("Error en la solicitud:", error);
            alert("Error en la solicitud");
        })





    })
})
