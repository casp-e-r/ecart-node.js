var db = require("../config/connection");
var collection=require('../config/collection')
var objectId=require('mongodb').ObjectId
module.exports = {
  addProduct: (product, callback) => {

    console.log(product);

    db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
        console.log(data);
        callback(data.insertedId);
      }).catch((err)=>{
        console.log(err)
      })
  },
  getAllProducts:()=>{
    return new Promise(async(resolve,reject)=>{
      let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
      console.log();
      resolve(products)
    })
  

  },
  deleteProduct:(prodId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
        resolve(response)
        
      })
    })
  },
  getProductDetails:(proId)=>{
    return new Promise(async(resolve,reject)=>{
      await
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
        resolve(product)

      })

    })
  },
  updateProduct:(proId,proDetails)=>{
    return new Promise((resolve,reject,next)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
      {"_id":objectId(proId)},{
      $set:{
        "name":proDetails.name,    
        "category":proDetails.category,
        "price":proDetails.price,
        "description":proDetails.description
       
      }
      }).then((response)=>{
        resolve()
      })
    })

  }
}
