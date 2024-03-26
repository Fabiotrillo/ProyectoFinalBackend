class ProductRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    async getProducts() {
      try {
        const result = await this.dao.getProducts();
        const products = result;
        return products 
      } catch (error) {
        console.log(error);
      }
    }
  
    async getProductByID(pid) {
      try {
        const result = await this.dao.getProductByID(pid);
        return result
      } catch (error) {
        throw new Error(`Error: ${error.message}`);
      }
    }
  
    async createProduct (productData) {
      try {
        const result = await this.dao.createProduct(productData);
        return result;
      } catch (error) {
        throw new Error(`Error en lectura de archivos: ${error.message}`);
      }
    }
  
    async updateProduct(productId, updatedProductData) {
      try {
        const result = await this.dao.updateProduct(productId, updatedProductData);
        return result;
      } catch (error) {
        throw new Error(`Error: ${error.message}`);
      }
    }
  
    async deleteProductByID(productId) {
      try {
        const result = await this.dao.deleteProductByID(productId);
        return result;
      } catch (error) {
        throw new Error(`Error en lectura de archivos: ${error.message}`);
      }
    }
  }
  
  export default ProductRepository;