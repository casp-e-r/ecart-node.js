var express = require('express');
const { render } =require('../app');
var productHelpers = require('../helpers/product-helpers');
var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products});
  })
  
});
router.get('/add-product',(req,res)=>{
  res.render('admin/add-product',{admin:true})

})
router.post('/add-product',(req,res)=>{
  

  productHelpers.addProduct(req.body,(id)=>{

    let image=req.files.image
    console.log(id)
    image.mv('./public/product-images/'+id+'.jpg',(err,data)=>{
      if(!err)
        res.render("admin/add-product")
      else
        console.log(err)
      
    })
    
  })
})
router.get('/delete-product/:id',(req,res)=>{
    let prodId=req.params.id
    productHelpers.deleteProduct(prodId).then((response)=>{
      res.redirect('/admin/')
    })
})
router.get('/edit-product/:id',async(req,res)=>{

  let proId=req.params.id
  let product=await productHelpers.getProductDetails(proId)
  console.log(product)
  res.render('admin/edit-product',{product,admin:true})
  
})

router.post('/edit-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.updateProduct(proId,req.body).then(()=>{
    res.redirect('/admin')
  })
})


module.exports = router;

