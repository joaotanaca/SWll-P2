import React, { useCallback, useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";

import Input from "../../components/Input";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";

import * as SC from "./styles";
import { BiBook, BiUser } from "react-icons/bi";
import IBook from "../CheckOwner/interfaces/IBook";
import { useHistory } from "react-router";
import { routesMap } from "../../config/routes-map";
import { useLocation } from "react-router-dom";
import instance from "../../../../Tp04.WebApp/src/services/api";

const Settings: React.FC = () => {
    const [bookName, setBookName] = useState("");
    const [bookPassword, setBookPassword] = useState("");
    const [bookStatus, setBookStatus] = useState(true);
    const [bookId, setBookId] = useState<number | null>(null);
    const history = useHistory();
    const queryParams = new URLSearchParams(useLocation().search);

    useEffect(() => {
        const bookIdParam = queryParams.get("userId");

        if (bookIdParam) {
            setBookId(Number(bookIdParam));

            instance.get<IBook>(`/usuarios/${bookIdParam}`).then(({ data }) => {
                setBookName(data.nome);
                setBookPassword(data.senha);
                setBookStatus(data.status);
            });
        }
    }, []);

    const handleSaveSettings = useCallback(async () => {
        const book: IBook = {
            id: bookId,
            nome: bookName,
            senha: bookPassword,
            status: bookStatus,
        };

        if (bookId) {
            await instance.put(`/usuarios`, book);
        } else {
            await instance.post(`/usuarios`, book);
        }

        history.push(routesMap.Home.path);
    }, [bookName, bookPassword]);

    return (
        <SC.Container>
            <NavBar />

            <SC.Title>
                <FiSettings size={32} />
            </SC.Title>

            <SC.Content>
                <SC.SettingsGroup>
                    <strong className="header">Preenche aí</strong>

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
                    <Button onClick={handleSaveSettings}>Salvar</Button>
                </SC.Footer>
            </SC.Content>
        </SC.Container>
    );
};

export default Settings;
