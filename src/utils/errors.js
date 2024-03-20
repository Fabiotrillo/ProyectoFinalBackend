export const cartErrorDictionary = {
    FETCHING_CARTS: "Error fetching carts",
    CREATE_CART: "Error al intentar crear el carrito",
    ADD_PRODUCT_TO_CART: "Error al intentar agregar producto al carrito",
    REMOVE_PRODUCT_FROM_CART: "Error al intentar eliminar producto del carrito",
    DELETE_CART: "Error al intentar eliminar el carrito",
    CART_NOT_FOUND_BY_ID: "Error al intentar encontrar el producto por ID",
    FINALIZE_PURCHASE:"Error al finalizar la compra!"
};


export const productErrorDictionary = {
    FETCHING_PRODUCTS: "Error fetching products",
    CREATE_PRODUCT: "Error al intentar crear el producto",
    UPDATE_PRODUCT: "Error al intentar actualizar el producto:",
    DELETE_PRODUCT: "Error al intentar eliminar el producto:",
};

export const userErrorDictionary = {
    FETCHING_USERS: "Error fetching users",
    CREATE_USER: "Error al intentar crear el usuario",
    UPDATE_USER: "Error al intentar actualizar el usuario",
    DELETE_USER: "Error al intentar eliminar el usuario",
};


export const customizeError = (errorKey, additionalInfo = "", errorDictionary) => {
    const errorMessage = errorDictionary[errorKey] || "Error desconocido.";
    return `${errorMessage} ${additionalInfo}`;
};

