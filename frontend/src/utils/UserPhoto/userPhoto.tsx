

export async function getUserPhoto(userId: number) {

    let data: Response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}?limit=1`)
    let response: UserPhoto = await data.json()

    if (response.ok && response.result.total_count > 0) {
        return response.result.photos[0][0].file_id
    } else return "undefined"
}


export async function getPhotoId(userId: number): Promise<string> {
    let data: Response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${await getUserPhoto(userId)}`)
    let response: PhotoPath = await data.json()

    if (response.ok) {
        return response.result.file_path
    } else return "undefined"
}

export async function getAvatarUrl(userId: number): Promise<string> {
    let data: Response = await fetch(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${await getPhotoId(userId)}`);
    return data.url;
}