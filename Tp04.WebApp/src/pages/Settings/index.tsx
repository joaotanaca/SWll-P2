import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiSettings } from "react-icons/fi";

import Input from "../../components/Input";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";

import * as SC from "./styles";
import { BiBook, BiUser } from "react-icons/bi";

import { useHistory } from "react-router";
import { routesMap } from "../../config/routes-map";
import { useLocation } from "react-router-dom";
import { IProduct } from "../Home";
import instance from "../../services/api";

const Settings: React.FC = () => {
    const [bookName, setBookName] = useState("");
    const [bookPassword, setBookPassword] = useState(0);
    const [bookStatus, setBookStatus] = useState(true);
    const [bookId, setBookId] = useState<number | null>(null);
    const history = useHistory();
    const location = useLocation();
    const queryParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            history.push(routesMap.Login.path);
        } else {
            instance
                .get<IProduct[]>(`/sessions/check`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .catch((err) => history.push(routesMap.Login.path));
        }

        const bookIdParam = queryParams.get("userId");

        if (bookIdParam) {
            setBookId(Number(bookIdParam));

            instance
                .get<IProduct>(`/produtos/${bookIdParam}`)
                .then(({ data }) => {
                    setBookName(data.nome);
                    setBookPassword(data.preco);
                    setBookStatus(data.status);

                    alert("Boa, segue aí");
                });
        }
    }, [history, queryParams]);

    const handleSaveSettings = useCallback(async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const options = { headers };

        const book: IProduct = {
            id: bookId,
            nome: bookName,
            preco: bookPassword,
            status: bookStatus,
        };

        if (bookId) {
            await instance.put(`/produtos`, book, options);
        } else {
            await instance.post(`/produtos`, book, options);
        }

        history.push(routesMap.Home.path);
    }, [bookId, bookName, bookPassword, bookStatus, history]);

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
                        placeholder="Preço"
                        onChange={(event) =>
                            setBookPassword(Number(event.target.value))
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
