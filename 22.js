
    const products = await Products.find({ name: { $regex: search, $options: "i" } })
