import multiparty from 'multiparty';
import {v2 as cloudinary} from 'cloudinary'
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";
import {mongooseConnect} from "@/lib/dbConnection";


// const cloudName = process.env.CLOUDINARY_CLOUDNAME;
cloudinary.config({
    secure: true
});
export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
    console.log('API Upload');
    const form = new multiparty.Form();

    const {fields, files} = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({fields, files});
        })
    })

    const links = [];
    for (const file of files.file) {
        // const ext = file.originalFilename.split('.').pop();
        // const newFilename = Date.now() + '.' + ext;

        const options = {
            resource_type: 'image',
            type: 'upload',
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };

        await cloudinary.uploader.upload(file.path, options)
            .then((result) => {
                links.push(result.secure_url);
                // console.log("success", JSON.stringify(result, null,  2));
            })
            .catch((error) => {
                console.log("error", JSON.stringify(error, null, 2));
            })

    }
    res.json(links)
}

export const config = {
    api: {bodyParser: false}
}