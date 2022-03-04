import React from 'react'
import {Paper} from "@mui/material";
import client, {apiCredentials} from "../../apis/MTProtoAPI";
import {Api} from "telegram";


export const LoginPage: React.FC = () => {

    const login = async () => {
        await client.connect()
        const result = await client.invoke(
            new Api.auth.ExportLoginToken({
                ...apiCredentials,
                exceptIds: []
            })
        )
    }

    login()
    return (

        <>
            <Paper>

            </Paper>
        </>
    )
}
