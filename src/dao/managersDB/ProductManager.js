import productModel from "../db/models/products.model.js";


class ProductManager {
    // Obtener todos los productos paginados y filtrados
    getProducts = async (limit, page, sort, category, availability, query) => {
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (availability) {
            filter.stock = { $gt: 0 };
        }
        if (query) {
            filter.$or = [
                { title: { $regex: new RegExp(query, 'i') } },
            ];
        }

        const options = {
            limit: limit ? parseInt(limit, 10) : 5,
            page: page !== undefined ? parseInt(page, 10) : 1,
            sort: { price: sort === "asc" ? 1 : -1 },
            lean: true
        };

        const products = await productModel.paginate(filter, options);

        const queryParamsForPagination = {
            limit: options.limit,
            page: options.page,
            sort,
            category,
            availability,
            query
        };

        // Elimina las propiedades con valores `undefined`
        Object.keys(queryParamsForPagination).forEach(
            key => queryParamsForPagination[key] === undefined && delete queryParamsForPagination[key]
        );

        const baseLink = '/products';
        const prevLink = products.hasPrevPage
            ? `${baseLink}?${new URLSearchParams({ ...queryParamsForPagination, page: options.page - 1 }).toString()}`
            : null;

        const nextLink = products.hasNextPage
            ? `${baseLink}?${new URLSearchParams({ ...queryParamsForPagination, page: options.page + 1 }).toString()}`
            : null;

        return {
            status: "success",
            msg: {
                ...products,
                prevLink,
                nextLink
            }
        };
    };
    // Obtener un producto por ID
    getProductByID = async (pid) => {
        try {
            const product = await productModel.findOne({ _id: pid });
            return {
                status: "Success",
                msg: product,
            };
        } catch (error) {
            console.error('Error al intentar obtener un producto por ID:', error.message);
            return {
                status: "Error",
                msg: error.message,
            };
        }
    }

    // Crear un nuevo producto
    createProduct = async (title, description, price, code, stock, category, thumbnail) => {
        try {
            const newProduct = await productModel.create({
                title,
                description,
                price,
                code,
                stock,
                category,
                thumbnail,
            });



            return {
                status: "Success",
                msg: newProduct,
            };
        } catch (error) {
            console.error('Error al intentar crear un producto:', error.message);
            return {
                status: "Error",
                msg: error.message,
            };
        }
    }

    // Eliminar un producto por ID
    deleteProductByID = async (id) => {
        try {
            await productModel.findByIdAndDelete(id);
            return {
                status: "Success",
                msg: `Producto con ID ${id} eliminado correctamente.`,
            };
        } catch (error) {
            console.error('Error al intentar eliminar un producto por ID:', error.message);
            return {
                status: "Error",
                msg: error.message,
            };
        }
    }

    // Actualizar un producto por ID
    upgradeProduct = async ({ id, ...productData }) => {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, productData, { new: true });
            return {
                status: "Success",
                msg: updatedProduct,
            };
        } catch (error) {
            console.error('Error al intentar actualizar un producto por ID:', error.message);
            return {
                status: "Error",
                msg: error.message,
            };
        }
    }
}

export default ProductManager;

