



///fetch para realizar el put del cambio de role desde el front
const updateForm= document.getElementById("updateRole").addEventListener("submit", (e)=>{
    e.preventDefault();


    const currentRole= document.getElementById("role").innerText;
    const userId= document.getElementById("userId").innerText;

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
            location.reload()
        }else if(response.status===400){
            alert("faltan documentos para actualizar el usuario")
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud");
    });


})


