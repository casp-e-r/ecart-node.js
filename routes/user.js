const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const userHelper=require('../helpers/user-helper')


const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', async function(req, res, next) {
  let user=req.session.user //session checking  it will check in user-header
  let cartCount=null
  if(req.session.user){
    cartCount=await userHelper.getCartCount(user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{products,user,cartCount});
  })
  
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  res.render('user/login',{"loginErr":req.session.loginErr})
  req.session.loginErr=false
  }
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{

  userHelper.doSignup(req.body).then((response)=>{
    
    //req.session.loggedIn=true
    //req.session.user=response
    console.log(response)
    res.redirect('/login')
  })
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.userloginErr="Invalid username or password"
      res.redirect('/login')

    }
    })
  })

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products=await userHelper.getCartProducts(req.session.user._id)
  let total=await userHelper.getTotalAmount(req.session.user._id)
  console.log(products);
  console.log(total);
  
  if(total==undefined)
  res.render('user/emptycart',{user:req.session.user._id})
  else 
  res.render('user/cart',{products,total,user:req.session.user._id})
  
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    
    
    res.json({stauts:true})
  })
})
router.post('/change-product-quantity',(req,res,next)=>{
  console.log(req.body)
  userHelper.changeProductQuantity(req.body).then(async(response)=>{
    response.total=await userHelper.getTotalAmount(req.body.user)
    res.json(response)
    
    
    
    
  })
})

router.get('/place-order',verifyLogin,async(req,res,next)=>{
  let total=await userHelper.getTotalAmount(req.session.user._id)
  /* console.log("totallllll is:",total) */
  res.render('user/place-order',{total,user:req.session.user})
})

router.post('/place-order',verifyLogin,async(req,res)=>{
  
  let products=await userHelper.getCartProductList(req.session.user._id)
  let totalAmount=await userHelper.getTotalAmount(req.session.user._id)
  userHelper.placeOrder(req.body,products,totalAmount).then((response)=>{
    res.json({status:true})

  })
  
})
router.get('/order-success',(req,res)=>{
  res.render('user/order-success',{user:req.session.user._id})
})
router.get('/orders',async(req,res)=>{
  let orders=await userHelper.getUserOrders(req.session.user._id)
  res.render('user/orders',{user:req.session.user,orders})
})
router.get('/view-order-products/:id',async(req,res)=>{
  console.log(req.params.id);
  let products=await userHelper.getOrderProducts(req.params.id)
  
  res.render('user/view-order-products',{user:req.session.user,products})
})


module.exports = router;
