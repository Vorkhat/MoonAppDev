interface Photo {
    file_id: string;
    file_unique_id: string;
    file_size: number;
    width: number;
    height: number;
}


interface UserPhoto {
    ok: boolean;
    result: {
        total_count: number;
        photos: Photo[][];
    };
}

interface PhotoPath {
    ok: boolean,
    result: {
        file_id: string,
        file_unique_id: string,
        file_size: number,
        file_path: string,
    };
}