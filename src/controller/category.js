const Category = require('../models/category');
const slugify = require('slugify');

function createCategories(categories, parentId = null){

  const categoryList =[];
  let category;
  if(parentId == null){
    category = categories.filter(cat.parentId == undefined);
  }else{
    category = categories.filter(cat => cat.parentId == parentId);
  }
    
for(let cate of category){
  categoryList.push({
    _id:cate._id,
    name: cate.name,
    slug : cate.slug,
    children: createCategories(categories, cate._id)
    
  });
}

}

exports.addCategory = (req, res) => {

  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name)
  };

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);

  cat.save()
    .then(() => {
      res.status(200).json({ message: "Category saved successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to save category" });
    });
};

    exports.getCategories = (req, res) => {
  Category.find({})
    .then((categories) => {

      const categoryList = createCategories(categories);

      res.status(200).json({ categoryList });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

