const router = require("express").Router();
const Products = require("../models/products");
const SubCategories = require("../models/subcategory");
const products = require("../config/products.json");

router.get("/products", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || "";
		let sort = req.query.sort || "rating";
		let sc = req.query.sc || "All";

  const subcategories = await Subcategories.find().populate("category").exec()
  let scOptions = await Subcategories.find({},{name:1,_id:0})

		sc === "All"
			? (sc = [...scOptions])
			: (sc = req.query.sc.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const products = await Products.find({ name: { $regex: search, $options: "i" } })
			.where("sc")
			.in([...sc])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Products.countDocuments({
			sc: { $in: [...sc] },
			name: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			genres: scOptions,
			products,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

// const insertMovies = async () => {
//     try {
//         const docs = await Products.insertMany(products);
//         return Promise.resolve(docs);
//     } catch (err) {
//         return Promise.reject(err)
//     }
// };

// insertMovies()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err))

module.exports = router;
