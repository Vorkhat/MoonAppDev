'use client';

import React, {useEffect, useState} from "react";
import {initInitData} from "@telegram-apps/sdk-react";
import {Image} from "@telegram-apps/telegram-ui";

const UserProfile = () => {

    const [username, setUsername] = useState('');
    const [id, setId] = useState(null);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

    useEffect(() => {

        let data = initInitData();

        if (data) {
            const response = JSON.stringify(data);
            const jsonData = JSON.parse(response);

            const {firstName, lastName, username, id} = jsonData.initData.user;

            setFirstName(firstName);
            setLastName(lastName);
            setUsername(username);
            setId(id);

            const getUserPhoto = async (userId: number) => {
                const data = await fetch(`/api/userPhoto?userId=${userId}`);
                const blob = await data.blob();
                setPhoto(URL.createObjectURL(blob));
            }

            getUserPhoto(id).then()

        } else {
            setFirstName('undefined');
            setLastName('undefined');
            setUsername('undefined');
        }

    }, []);

    return (
        <div>
            <p>First Name: {firstName}</p>
            <p>Last Name: {lastName}</p>
            <p>Username: {username}</p>
            <p>ID: {id}</p>
            {photo ? (
                <Image
                    src={photo}
                    alt="User Photo"
                    width={160}
                    height={160}
                    style={{ objectFit: 'cover' }}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserProfile;