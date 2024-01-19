import { sequelize } from "../config/db"
import { productModel, imageModel, ratingModel, sessionModel, categoryModel, userModel, wishListModel } from "../models/modelsRelations"
import { Request, Response } from 'express'
import { isAdedToWishlist } from '../utils/wishlistUtils'

import { Op } from 'sequelize';
import { CustomRequest } from '../middlewares/sessionMiddleware'

export const getTrendyProducts = async function (req: Request, res: Response): Promise<any> {
  try {
    let productsWithIsAdded = []
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 20
    const trendyProducts = await productModel.findAll({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "price",
        "discount"
        , [sequelize.literal('(SELECT AVG(rating) FROM ratings WHERE ratings.productID = products.productID)'), 'avgRating'],

      ],
      include: [
        {
          model: imageModel,
          attributes: ['imgPath'],
          where: sequelize.literal('position = 1'),
          required: false
        },
        {
          model: ratingModel,
          attributes: [
            [sequelize.literal('(SELECT count(rating) FROM ratings WHERE ratings.productID = products.productID)'), 'ratingsCount'],
          ]
        }
      ],
      having: sequelize.literal('avgRating >= 4.5'),
      order: [[sequelize.literal('avgRating'), 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,

    })
    const count = trendyProducts.length


    productsWithIsAdded = await getProductsAndIsAdded(req, trendyProducts)

    return res.status(200).json({ "count": count, "products": productsWithIsAdded })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get products', details: err.message })
  }
}

async function isAuthorized(req: Request): Promise<boolean | number> {
  const { headers: headersData } = req
  if (!headersData.authorization) {
    return false
  }
  else {
    const foundSession = await sessionModel.findOne({ where: { sessionID: headersData.authorization } })
    const foundUser = await userModel.findOne({ where: { userID: foundSession.userID } })
    return foundUser.userID
  }
}

async function getProductsAndIsAdded(req: Request, products: any[]): Promise<any[]> {
  const userID = await isAuthorized(req)
  if (!userID) {
    return products.map((product, index) => ({
      ...product.toJSON(),
      isAddedToWishList: 0,
    }))
    
  }

  const isAddedPromises = products.map(product => isAdedToWishlist(userID, product.productID))
  const isAddedResults = await Promise.all(isAddedPromises);

  return products.map((product, index) => ({
    ...product.toJSON(),
    isAddedToWishList: isAddedResults[index],
  }))
}


export const handPicked = async (req: Request, res: Response): Promise<any> => {
  try {
    let productsWithIsAdded = []
    const categoryName = req.query.category as string | undefined;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 9;
    const category = await categoryModel.findOne({
      attributes: ['categoryID'],
      where: {
        name: categoryName
      }
    })
    if (category) {
      const handPickedProducts = await productModel.findAll({
        attributes: [
          "productID",
          "title",
          "subTitle",
          "price",
          "discount",
          [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
          [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
          [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response
        ],
        include: [
          {
            model: ratingModel,
            attributes: [],
            as: "ratings",
            where: { rating: { [Op.gt]: 4.5 } },
            required: false
          }
          , {
            model: categoryModel,
            attributes: [],
            where: {
              categoryID: category.categoryID,

            }
          },
          {
            model: imageModel,
            attributes: [],
            where: sequelize.literal('position = 1'),
            required: false
          }
        ],
        where: {
          price: { [Op.lt]: 100 },
        },
        group: ['productID'],
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [[sequelize.literal('avgRating'), 'DESC']],
        subQuery: false
      })
      for (const product of handPickedProducts) {
        let ratingCount = await ratingModel.count({
          where: {
            productID: product.productID,
          },
        });
      }
      const count = handPickedProducts.length;

      productsWithIsAdded = await getProductsAndIsAdded(req, handPickedProducts)
      return res.status(200).json(
        {
          "totalCount": count,
          "products": productsWithIsAdded,
        });
    } else {
      return res.status(404).json('No Products Found');
    }
  } catch (error) {
    res.status(500).json('Internal Server Error');
  }
};



export const getSpecificProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productid = req.params.productID as string | undefined;

    if (!productid) {
      res.status(400).json({ error: 'productid are required' });
      return;
    }

    const Product = await productModel.findOne({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "description",
        "price",
        "discount",
      ],

      include: [
        {
          model: imageModel,
          attributes: ['imageID', 'imgPath', 'position'],
          required: false
        },
        {
          model: ratingModel,
          attributes: [], as: "ratings",
          required: false
        }
      ],
      where: {
        productID: productid
      },
      group: ['productID', 'imageID'],
      subQuery: false

    });
    return res.status(200).json({ Product });


  } catch (error) {

    return res.status(500).json('Internal Server Error');

  }

}



export const rateProduct = async (req: CustomRequest, res: Response): Promise<any> => {
  try {

    const rate = req.body.rating;
    const productID = req.params.productID;
    const userID = req.user.userID;

    // Validate input
    if (!userID || !rate || !productID) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const existRate = await ratingModel.findOne({
      where: {
        userID: userID,
        productID: productID,
      },
    });


    if (!existRate) {
      const newRating = await ratingModel.create({
        userID: userID,
        rating: rate,
        productID: productID,
      });


      return res.status(200).json(
        "Rated Successfully",
      );
    }
    else {
      return res.status(400).json('Already Rated');
    }

  } catch (error) {

    return res.status(500).json('Internal Server Error');
  }
}


export const getRateAndReview = async (req: Request, res: Response): Promise<any> => {

  try {
    const productID = req.params.productID;

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 9;

    const count = await ratingModel.count({
      where: {
        productID: productID,
      },
    });

    const reviews = await ratingModel.findAll({
      attributes: ['rating'],
      where: {
        productID: productID,
      },
      include: [{
        model: userModel,
        attributes: ['firstName', 'lastName'],

      }
      ]
      ,
      order: [["rating", "DESC"]],
    });

   return res.status(200).json(
      { "totalCount":count, 
        "reviews":reviews }
    );

  } catch (error) {
    console.error(error);
    return  res.status(500).json( 'Internal Server Error' );
  }
}


