






// export const generateUserErrorInfo=(user)=>{

//     return `faltan datos :
//     *first_name:type string, received: ${user.first_name}
//     *last_name:type string, received:${user.last_name}
//     *email: type string, received ${user.email}
//     `
// };



//////////verifica el tipo de dato de los productos ingresados

export const invalidTypeError=(product)=>{
   return`
   error en los tipos de datos:
   *title: type string, received: ${typeof(product.title)} 
   *price: Type Number, received: ${typeof(product.price)} 
   `
};
///////////////CASO DE QUE UNO DE LOS CAMPOS SEA UNDEFINED 
export const nullField=(product)=>{
    return `faltan datos :
    *title: type string, received: ${product.title}
    *description: type string, received: ${product.description}
    *code: type string, received: ${product.code}
    *price: type number, received: ${product.price}
    *stock: type number, received: ${product.stock}
    *cat: type string, received: ${product.cat}
    `
}