import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const extension = ["jpg", "png", "jpeg", "gif"];


export async function handleUploadFile(req, res) {

    try {

        if (!req.file.mimetype.startsWith("image/") && !extension.includes(req.file.mimetype)) {

            throw new Error("invalid extension type!");
        }

        const data = {
            url: req.file.path,
            type: req.file.mimetype,
            name: req.file.filename
        }

        console.log(data);


        await prisma.fileUrl.create({ data: data });
        res.send("file saved successfully!");
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.log("error removing file :", err);
                }
            })
        }

        console.log(error.message);
    }

}

export async function fetchImages(req, res) {
    const files = await prisma.fileUrl.findMany();
    res.json({ files: files });

}


export async function renderImage(req, res) {

    try {

        const id = req.params.id;
        const file = await prisma.fileUrl.findUnique({
            where: {
                id: id
            }
        });
        if (!file) {
            res.status(404).json({ error: "file not found" });
            return;
        }

        const buffer = fs.readFileSync(file.url);
        res.set("Content-Type" , file.type );
        res.send(buffer);

    } catch (error) {
         console.log(error);
    }


}

