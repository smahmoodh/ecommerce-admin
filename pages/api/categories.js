import {Category} from "@/models/Category";
import {mongooseConnect} from "@/lib/dbConnection";
// import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const {method} = req;
    await mongooseConnect();
    // await isAdminRequest(req, res);


    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Category.findOne({_id: req.query.id}));
        } else {
            res.json(await Category.find().populate('parent'));
        }
    }

    if (method === 'POST') {
        const {name, parentCategory, properties} = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            properties
        })
        res.json(categoryDoc)
    }

    if (method === 'PUT') {
        const {_id, name, parentCategory, properties} = req.body;
        await Category.updateOne(
            {_id},
            {
                name,
                parent: parentCategory || undefined,
                properties
            },
        )
        res.json(true)
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        if ({_id}) {
            await Category.deleteOne({_id});
            res.json(true);
        }
    }
}