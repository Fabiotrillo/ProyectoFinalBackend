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
  
    async getProductByID(productId) {
      try {
        const result = await this.dao.getProductByID(productId);
        return result
      } catch (error) {
        throw new Error(`Error: ${error.message}`);
      }
    }
  
    async createProduct(productData) {
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
  
    async deleteProduct(productId) {
      try {
        const result = await this.dao.deleteProduct(productId);
        return result;
      } catch (error) {
        throw new Error(`Error en lectura de archivos: ${error.message}`);
      }
    }
  }
  
  export default ProductRepository;