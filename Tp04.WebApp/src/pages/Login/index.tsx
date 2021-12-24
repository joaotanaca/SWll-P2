import React, { useCallback, useEffect, useState } from "react";

import Input from "../../components/Input";
import Button from "../../components/Button";

import * as SC from "./styles";
import { BiBook, BiUser } from "react-icons/bi";

import { useHistory } from "react-router";
import { routesMap } from "../../config/routes-map";
import IBook from "../../IBook";
import instance from "../../services/api";

const Login: React.FC = () => {
    const [bookName, setBookName] = useState("");
    const [bookPassword, setBookPassword] = useState("");
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            history.push(routesMap.Login.path);
        } else {
            instance
                .get<IBook[]>(`/sessions/check`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => history.push(routesMap.Home.path));
        }
    }, [history]);

    const handleSaveSettings = useCallback(async () => {
        const book = {
            nome: bookName,
            senha: bookPassword,
        };

        try {
            const {
                data: { token },
            } = await instance.post<{ token: string }>(`/sessions`, book);

            localStorage.setItem("token", token);

            history.push(routesMap.Home.path);
        } catch (error) {
            console.log(error);
        }
    }, [bookName, bookPassword, history]);

    return (
        <SC.Container>
            <h1>Login</h1>

            <SC.Content>
                <SC.SettingsGroup>
                    <Input
                        value={bookName}
                        icon={BiBook}
                        placeholder="Nome"
                        onChange={(event) => setBookName(event.target.value)}
                    />

                    <Input
                        value={bookPassword}
                        icon={BiUser}
                        placeholder="Senha"
                        onChange={(event) =>
                            setBookPassword(event.target.value)
                        }
                    />
                </SC.SettingsGroup>

                <SC.Footer>
                    <Button onClick={handleSaveSettings}>Logar</Button>
                </SC.Footer>
            </SC.Content>
        </SC.Container>
    );
};

export default Login;
