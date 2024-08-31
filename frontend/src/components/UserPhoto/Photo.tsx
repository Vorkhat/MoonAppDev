import {getAvatarUrl} from "@/utils/UserPhoto/userPhoto";

export default async function UserPhoto(userId: number) {
    return await getAvatarUrl(userId)
}