let express=require('express');
let path=require('path');
let mongo=require('mongodb').MongoClient;
let app=express();
let parser=require('body-parser');
let url='mongodb://localhost:27017/';
console.log(__dirname);
var PORT=3002;
var user=null;


app.get('/',function(req,res)
	{
      res.sendFile(path.join(__dirname,'public/html/index.html'));
	});
app.get('/admin.html',function(req,res)
  {
      res.sendFile(path.join(__dirname,'public/html/admin.html'));
  });
app.post('/admin.html',function(req,res)
  {
      res.sendFile(path.join(__dirname,'public/html/admin.html'));
  });

app.get('/index.html',function(req,res)
  {
      res.sendFile(path.join(__dirname,'public/html/index.html'));
  });
app.post('/index.html',function(req,res)
  {
      res.sendFile(path.join(__dirname,'public/html/index.html'));
  });


app.get('/userLogin.html',function(req,res)
  {
      res.sendFile(path.join(__dirname,'public/html/userLogin.html'));
  });
app.post('/userLogin.html',function(req,res)
  {
      res.sendFile(path.join(__dirname,'public/html/userLogin.html'));
  });

app.get('/user.html',function(req,res)
  {
      res.sendFile(path.join(__dirname,'public/html/user.html'));
  });
app.post('/',function(req,res)
  {
      res.sendFile(path.join(__dirname,'public/html/index.html'));
  });
app.post('/adminLogin',parser.json(),async function (req,res)
{ 
    
    var a=await find(req);
    res.json({k:a});
  });


app.post('/addUser',parser.json(),async function (req,res)
{ 
  var updated=null;
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
var t=await client.db(req.body.db).collection('data').findOne({id:parseInt(req.body.id)});
console.log(t);
console.log(req.body.id);
console.log(req.body.password);
console.log(req.body.name);
if(t==null)
{
var updated=await client.db(req.body.db).collection('data').insertOne({id:parseInt(req.body.id),password:req.body.password,name:req.body.name});
}
console.log(updated);   
res.json({k:updated});
});



app.post('/addStudent',parser.json(),async function (req,res)
{ 
  var updated=null;
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
var t=await client.db(req.body.db).collection('data').findOne({id:parseInt(req.body.id)});
console.log(t);
if(t==null)
{
var updated=await client.db(req.body.db).collection('data').insertOne({id:parseInt(req.body.id),name:req.body.name});
}
console.log(updated);   
res.json({k:updated});
});


app.post('/addBook',parser.json(),async function (req,res)
{ 
  var updated=null;
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
console.log(req.body.q);
var t=await client.db(req.body.db).collection('data').findOne({bookName:req.body.bookName,authorName:req.body.authorName,quantity:parseInt(req.body.quantity)});
console.log(t);
if(t==null)
{
var updated=await client.db(req.body.db).collection('data').insertOne({bookName:req.body.bookName,authorName:req.body.authorName,quantity:parseInt(req.body.quantity)});
console.log(updated);   
res.json({k:updated,l:'books added'});
}
else
{
var t=await client.db(req.body.db).collection('data').findOneAndUpdate({bookName:req.body.bookName,authorName:req.body.authorName},{$set:{quantity:t.quantity+parseInt(req.body.quantity)}},{returnOriginal:false});
res.json({k:updated,l:'Quantity of books Updated'});
}
});


app.post('/deleteUser',parser.json(),async function (req,res)
{ 
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
console.log(req.body.id);
console.log(req.body.name);
var t=await client.db(req.body.db).collection('data').deleteOne({id:parseInt(req.body.id),name:req.body.name});
console.log(t);   
res.json({k:t.result.n});
});

app.post('/deleteStudent',parser.json(),async function (req,res)
{ 
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
console.log(req.body.id);
console.log(req.body.name);
var t=await client.db(req.body.db).collection('data').deleteOne({id:parseInt(req.body.id),name:req.body.name});
console.log(t);   
res.json({k:t.result.n});
});

app.post('/deleteBook',parser.json(),async function (req,res)
{ 
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
console.log(req.body.bookName);
console.log(req.body.authorName);
var t=await client.db(req.body.db).collection('data').deleteOne({bookName:req.body.bookName,authorName:req.body.authorName});
console.log(t);   
res.json({k:t.result.n});
});


async function  find(req)
{
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
var t=await client.db(req.body.db).collection('data').findOne({id:parseInt(req.body.id),password:req.body.password});
console.log(t);
user=t;
return t;
}

app.post('/changePassword',parser.json(),async function(req,res){
  const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
console.log(req.body.db);
var t=await client.db(req.body.db).collection('data').findOneAndUpdate({password:req.body.o},{$set:{password:req.body.n}},{returnOriginal:false});
console.log(t.value);
res.json({k:t.value});
  });

app.post('/data',parser.json(),function(req,res){
  console.log('hi');
  console.log(user);
  res.json({k:user});
});    


app.post('/issueBook',parser.json(),async function (req,res)
{ 
 
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
console.log(req.body.bookName);
console.log(req.body.authorName);
console.log(req.body.id);
var t=await client.db('student').collection('data').findOne({id:parseInt(req.body.id)});  
if(t==null)
{
  console.log('student not found');
  res.json({k:null,l:'student not found'});
}
else
{
 var s=await client.db('book').collection('data').findOne({bookName:req.body.bookName,authorName:req.body.authorName});
 if(s==null)
 {
   console.log('book not found');
   res.json({k:null,l:'book not found'});
 }  
 else
 {
  if(s.quantity>0)
  {
    var r=await client.db('issue').collection('data').findOne({id:parseInt(req.body.id),bookName:req.body.bookName,authorName:req.body.authorName});
    if(r==null)
    {
      console.log('new Entry');
       var updated=await client.db('issue').collection('data').insertOne({id:parseInt(req.body.id),bookName:req.body.bookName,authorName:req.body.authorName,quantity:1});
    
       var n=await client.db('book').collection('data').findOneAndUpdate({bookName:s.bookName,authorName:s.authorName},{$set:{quantity:s.quantity-1}},{returnOriginal:false});
      res.json({k:updated,l:'Issued with new Entry'});
    }
     else
    {
       console.log('old');
        if(r.quantity==3)
       {
          console.log('maximum limit reached');
          res.json({k:null,l:'maximum no of books issued for Student'});
       }
      else
       {
          var nq=r.quantity+1;
          var m=await client.db('issue').collection('data').findOneAndUpdate({password:req.body.o},{$set:{quantity:nq}},{returnOriginal:false});
          var n=await client.db('book').collection('data').findOneAndUpdate({bookName:s.bookName,authorName:s.authorName},{$set:{quantity:s.quantity-1}},{returnOriginal:false});
          res.json({k:m,l:'Issued with old Entry'});
        }
    }
  }
  else
  {
    console.log('Book quantity is not Available')
    res.json({k:null,l:'Book quantity is not Available'});
  }
 }
}
});

app.post('/returnBook',parser.json(),async function(req,res){
const client = new mongo(url,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
console.log(req.body.bookName);
console.log(req.body.authorName);
console.log(req.body.id);
var t=await client.db('issue').collection('data').findOne({id:parseInt(req.body.id),bookName:req.body.bookName,authorName:req.body.authorName});  
if(t==null)
{
  console.log('No Such Book Issued');
  res.json({k:null,l:'No such Book Issued'});
}
else
{
 var s=await client.db('book').collection('data').findOne({bookName:req.body.bookName,authorName:req.body.authorName}); 
  var m=await client.db('book').collection('data').findOneAndUpdate({bookName:req.body.bookName,authorName:req.body.authorName},{$set:{quantity:s.quantity+t.quantity}},{returnOriginal:false});
  var n=await client.db('issue').collection('data').deleteOne({id:parseInt(req.body.id),bookName:req.body.bookName,authorName:req.body.authorName});
  console.log('Book Returned');
  res.json({k:m,l:'Book Returened'});
}
});    



app.listen(PORT, function(err){ 
    if (err) console.log("Error in server setup") 
    console.log("Server listening on Port", PORT); 
});