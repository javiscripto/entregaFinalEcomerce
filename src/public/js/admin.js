


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
        });
    })
})

//eliminar usuarios inactivos

const btnDelete= document.getElementById("btn-delete");
btnDelete.addEventListener("click", ()=>{

    fetch("/api/users/delete",{
        method:"DELETE",
        headers:{"Content-Type":"application/json"}
    })
    .then(response=>{
        console.log(response)
        alert("usuarios eliminados")
        location.reload()
    })
    .catch(error=>{
        console.error("errror en la solicitud", error)
    })
});

//eliminar un usuario especifico
const buttonsDelete= document.querySelectorAll(".delete-user")
buttonsDelete.forEach(btn=>{
    btn.addEventListener("click",()=>{
        const userid= btn.getAttribute("userid");

        fetch(`/api/users/delete/${userid}`,{
            method:"DELETE",
            headers:{"Content-Type":"application/json"}
        }).then(response=>{
            if(response.ok){
                alert(`usuario ${userid} eliminado exitosamente`);
                location.reload()
            }else if(response.status===400){
                alert("ha ocurrido un error")
            }
        })
        .catch(error=>{
            console.error("ha ocurrido un error en la solicitud: ", error)
        })
    })
})