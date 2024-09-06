import '@/envConfig.ts';

export async function getUserPhoto(userId: number) {

    let data: Response = await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}&limit=1`);
    let response: UserPhoto = await data.json();

    if (response.ok && response.result.total_count > 0) {
        return response.result.photos[0][0].file_id;
    }

    throw new Error(data.statusText);
}


export async function getPhotoId(userId: number) {
    let data: Response = await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${await getUserPhoto(userId)}`);
    let response: PhotoPath = await data.json();

    if (!data.ok) throw new Error(data.statusText);

    return {
        filePath: response.result.file_path,
        key: response.result.file_unique_id,
    };
}

export async function getUserAvatar(userId: number) {
    const { filePath, key } = await getPhotoId(userId);

    return {
        url: `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`,
        key,
    };
}