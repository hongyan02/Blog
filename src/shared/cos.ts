import COS from "cos-nodejs-sdk-v5";

const cos = new COS({
    SecretId: process.env.COS_SECRET_ID!,
    SecretKey: process.env.COS_SECRET_KEY!,
});

const Bucket = "agcl-1325877396"; // 你的桶名
const Region = "ap-guangzhou"; // 你的地域

export interface CosFile {
    Key: string;
    LastModified: string;
    ETag: string;
    Size: string;
    StorageClass: string;
}

export async function getCosFiles(prefix: string) {
    return new Promise<CosFile[]>((resolve, reject) => {
        cos.getBucket(
            {
                Bucket,
                Region,
                Prefix: prefix, // 可选，指定目录前缀
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    // 过滤掉“目录占位符”，只保留文件
                    const files = (data.Contents || []).filter((item) => item.Size !== "0");
                    resolve(files);
                }
            }
        );
    });
}
