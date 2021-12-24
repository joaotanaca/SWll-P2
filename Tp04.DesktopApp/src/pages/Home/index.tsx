import React, { useCallback, useEffect, useMemo, useState } from "react";

import * as SC from "./styles";
import IBook from "../CheckOwner/interfaces/IBook";

import axios from "axios";
import { BiEdit, BiX } from "react-icons/bi";
import { Link, useHistory } from "react-router-dom";
import { routesMap } from "../../config/routes-map";
import Button from "../../components/Button";
import salutation from "../../utils/salutation";
import instance from "../../../../Tp04.WebApp/src/services/api";

const Home: React.FC = () => {
    const [books, setBooks] = useState<IBook[]>([]);
    const history = useHistory();

    const loadBooks = useCallback(async () => {
        try {
            const { data } = await instance.get<IBook[]>(`/usuarios`, {});
            setBooks(data);
        } catch (err) {
            console.log(err);
        }
    }, []);

    const handleDelete = useCallback((bookId: number) => {
        if (confirm(`Deseja deletar o livro ${bookId}`)) {
            instance
                .delete<IBook[]>(`/usuarios/${bookId}`, {})
                .then(() => loadBooks())
                .catch((err) => console.log(err));
        }
    }, []);

    const handleEdit = useCallback((bookId: number) => {
        history.push(`${routesMap.Settings.path}?userId=${bookId}`);
    }, []);

    useEffect(() => {
        loadBooks();
    }, []);

    const renderBooks = useMemo(
        () =>
            books.map((book) => (
                <tr key={Number(book.id)}>
                    <td>{book.nome}</td>
                    <td>{book.senha}</td>

                    <td className="icon">
                        <Button>
                            <BiEdit
                                color="#FBBC05"
                                size={24}
                                onClick={() => handleEdit(Number(book.id))}
                            />
                        </Button>
                    </td>
                    <td className="icon">
                        <Button>
                            <BiX
                                color="#e85b51"
                                size={24}
                                onClick={() => handleDelete(Number(book.id))}
                            />
                        </Button>
                    </td>
                </tr>
            )),
        [books],
    );

    return (
        <SC.Container>
            <div className="header">
                <SC.Title>{salutation}</SC.Title>
                <Link className="button" to={routesMap.Settings.path}>
                    Adicionar usuário
                </Link>
            </div>

            <SC.MainContent>
                {books.length ? (
                    <SC.BookList>
                        <thead>
                            <tr>
                                <th>Login</th>
                                <th>Senha</th>

                                <td className="icon">Apagar</td>
                                <td className="icon">Editar</td>
                            </tr>
                        </thead>
                        <tbody>{renderBooks}</tbody>
                    </SC.BookList>
                ) : (
                    <strong>Sem usuários disponiveis!</strong>
                )}
            </SC.MainContent>
        </SC.Container>
    );
};

export default Home;
