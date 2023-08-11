import {mongooseConnect} from "@/lib/dbConnection";
import {Order} from '@/models/Order'

export default async function(req, res){
    await mongooseConnect();
    res.json(await Order.find().sort({createdAt:-1}));
}