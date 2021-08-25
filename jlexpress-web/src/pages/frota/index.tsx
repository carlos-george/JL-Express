import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useSnackbar } from 'notistack';
import { FaPlus, FaTrash, FaBan, FaTimes } from 'react-icons/fa';
import { parseCookies } from "nookies";

import classes from './styles.module.scss';
import { api } from '../../services/api';
import { useMenu } from "../../context/MenuContext";
import { useRef } from "react";

type FormField = {
    _id?: string,
    placa: string,
    marca: string,
    modelo: string,
    ano: string,
    renavam: string,
    cor: string,
    imagem: string
}

type ImageLayout = {
    fileName: string;
    file: string;
    filePath: string;
}

type FrotaProps = {
    isAuthenticated: boolean;
}

type CheckStyle = {
    top: number,
    left: number,
}

export default function Frota({ isAuthenticated }: FrotaProps) {

    const { enqueueSnackbar } = useSnackbar();

    const initialValues = {
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        renavam: '',
        cor: '',
        imagem: ''
    }

    const { setLoginPage, setIsShowMenuApp } = useMenu();

    const currentDate = format(new Date(), 'dd/MM/y', {
        locale: ptBR
    });

    const [layouts, setLayouts] = useState<ImageLayout[]>([]);
    const [values, setValues] = useState<FormField>(initialValues);
    const [veiculos, setVeiculos] = useState<FormField[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedLayout, setSelectedLayout] = useState<string>('');
    const [selectedLayoutUrl, setSelectedLayoutUrl] = useState<string>('');
    const [listChecks, setListChecks] = useState<CheckStyle[]>([])

    const layoutRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setLoginPage(isAuthenticated);
        setIsShowMenuApp(isAuthenticated);
    }, []);

    useEffect(() => {
        atualizarListaVeiculos();
        api.get('/api/layouts').then(response => {

            const { listImages } = response.data;
            setLayouts(listImages);
        });

    }, []);

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    function handleSubmiteForm(event: FormEvent) {
        event.preventDefault();

        setIsLoading(true);

        api.post('/api/veiculos', values).then(response => {
            enqueueSnackbar('Veículo cadastrado com sucesso.', {
                variant: 'success'
            });
            setIsLoading(false);
            atualizarListaVeiculos();
            clearForm();
        }).catch(err => {
            if (err.response) {
                console.log('Error: ', err.response);
                setIsLoading(false);
            }
            else if (err.request) {
                console.log('Error: ', err.request);
                enqueueSnackbar('Verifique sua conexão com a internet.', {
                    variant: 'error'
                });
                setIsLoading(false);
            }
        });
    }

    function clearForm() {
        setValues(initialValues);
        setSelectedLayout(''),
            setSelectedLayoutUrl('');
    }

    function handleEdit(veiculo: FormField) {

        setValues(veiculo);
        setImagem(veiculo.imagem);
    }

    function handleEditVeiculo() {
        setIsLoading(true);

        console.log('Values: ', values);

        api.put(`/api/veiculos/${values._id}`, values).then(response => {
            enqueueSnackbar('Veículo editado com sucesso.', {
                variant: 'success'
            });
            setIsLoading(false);
            atualizarListaVeiculos();
            clearForm();
        }).catch(err => {
            if (err.response) {
                console.log('Error: ', err.response);
                setIsLoading(false);
            }
            else if (err.request) {
                console.log('Error: ', err.request);
                enqueueSnackbar('Verifique sua conexão com a internet.', {
                    variant: 'error'
                });
                setIsLoading(false);
            }
        });
    }

    function atualizarListaVeiculos() {

        api.get('/api/veiculos').then(response => {
            const { veiculos } = response.data;
            setVeiculos(veiculos);
        });
    }

    function handleDeleteVeiculo() {
        setIsLoading(true);
        api.delete(`/api/veiculos/${values._id}`).then(response => {
            enqueueSnackbar('Veículo excluído com sucesso.', {
                variant: 'success'
            });
            setIsLoading(false);
            atualizarListaVeiculos();
            clearForm();
        }).catch(err => {
            if (err.response) {
                console.log('Error: ', err.response);
                setIsLoading(false);
            }
            else if (err.request) {
                console.log('Error: ', err.request);
                enqueueSnackbar('Verifique sua conexão com a internet.', {
                    variant: 'error'
                });
                setIsLoading(false);
            }
        });
    }

    function handleSelectLayout(event: ChangeEvent<HTMLSelectElement>) {

        setImagem(event.target.value);
    }

    function setImagem(value: string) {

        setSelectedLayout(value);
        setValues(prevState => ({ ...prevState, imagem: value }));

        const imageLayout = layouts.find(image => image.file === value);

        setSelectedLayoutUrl(imageLayout?.filePath ? imageLayout?.filePath : '');
    }

    function handleMouseClick(x: number, y: number) {

        const newCheck: CheckStyle = {
            top: y - 10,
            left: x - 10,
        };

        setListChecks(prevState => [newCheck, ...prevState]);
    }

    return (
        <div className={classes.container} >
            <div className={classes.addVeiculo}>
                <div className={classes.header}>
                    <h1>Cadastro de Veículo</h1>
                    <span>{currentDate}</span>
                </div>
                <form onSubmit={handleSubmiteForm}>
                    <div className={classes.formGroup}>
                        <div className={classes.inputGroup}>
                            <input
                                name="placa"
                                required
                                type="text"
                                value={values.placa}
                                placeholder="Placa"
                                autoComplete="off"
                                onChange={event => { handleOnChange(event) }}
                            />
                        </div>
                        <div className={classes.inputGroup}>
                            <input
                                name="modelo"
                                required
                                type="text"
                                value={values.modelo}
                                placeholder="Modelo"
                                autoComplete="off"
                                onChange={event => { handleOnChange(event) }}
                            />
                        </div>
                    </div>
                    <div className={classes.formGroup}>
                        <div className={classes.inputGroup}>
                            <input
                                name="marca"
                                required
                                type="text"
                                value={values.marca}
                                placeholder="Marca"
                                autoComplete="off"
                                onChange={event => { handleOnChange(event) }}
                            />
                        </div>
                    </div>
                    <div className={classes.formGroup}>
                        <div className={classes.inputGroup}>
                            <input
                                name="ano"
                                required
                                type="text"
                                value={values.ano}
                                placeholder="Ano"
                                autoComplete="off"
                                onChange={event => { handleOnChange(event) }}
                            />
                        </div>
                        <div className={classes.inputGroup}>
                            <input
                                name="renavam"
                                required
                                type="text"
                                value={values.renavam}
                                placeholder="Renavam"
                                autoComplete="off"
                                onChange={event => { handleOnChange(event) }}
                            />
                        </div>
                    </div>
                    <div className={classes.formGroup}>
                        <div className={classes.inputGroup}>
                            <input
                                name="cor"
                                required
                                type="text"
                                value={values.cor}
                                placeholder="Cor"
                                autoComplete="off"
                                onChange={event => { handleOnChange(event) }}
                            />
                        </div>
                    </div>
                    <div className={classes.formGroup}>
                        <div className={classes.inputGroup}>
                            <select name="layout" value={selectedLayout} onChange={(event) => { handleSelectLayout(event) }}>
                                <option value="">Selecione um layout</option>
                                {layouts.map((image, index) => (
                                    <option key={`${image.file}${index}`} value={image.file}>{image.fileName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {selectedLayoutUrl &&
                        <div className={classes.formGroup}>
                            <img ref={layoutRef} src={selectedLayoutUrl} alt="Veiculo Layout Checklist" onClick={event => { handleMouseClick(event.pageX, event.pageY) }} />
                            {/* {listChecks.map((check, index) => (
                            <FaTimes size={18} style={{
                                color: 'red',
                                position: 'absolute',
                                zIndex: 1000,
                                top: check.top,
                                left: check.left,
                            }} />
                        ))} */}
                        </div>
                    }
                    {isLoading
                        ? (<h3>Processando...</h3>)
                        :
                        values._id
                            ? (
                                <div className={classes.formVeiculoEdit}>
                                    <button
                                        type="button"
                                        className={classes.buttonEdit}
                                        onClick={handleEditVeiculo}
                                    >
                                        <FaPlus size={13} />
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className={classes.buttonDelete}
                                        onClick={handleDeleteVeiculo}
                                    >
                                        <FaTrash size={13} />
                                        Deletar
                                    </button>
                                    <button
                                        type="button"
                                        className={classes.buttonCancelar}
                                        onClick={clearForm}
                                    >
                                        <FaBan size={13} />
                                        Cancelar
                                    </button>
                                </div>
                            )
                            : (
                                <button type="submit">
                                    <FaPlus size={13} />
                                    Salvar
                                </button>
                            )
                    }
                </form>
            </div>
            <div className={classes.listVeiculos}>
                <h1>Lista de Veículos</h1>
                <div className={classes.cardsVeiculos}>
                    {veiculos.map(veiculo => (
                        <div key={veiculo._id} className={classes.card} onClick={() => { handleEdit(veiculo) }}>
                            <div className={classes.cardGroup}>
                                <label>Placa: <span>{veiculo.placa}</span></label>
                                <label>Modelo: <span>{veiculo.modelo}</span></label>
                                <label>Ano: <span>{veiculo.ano}</span></label>
                            </div>
                            <div className={classes.cardGroup}>
                                <label>Renavam: <span>{veiculo.renavam}</span></label>
                                <label>Marca: <span>{veiculo.marca}</span></label>
                                <label>Cor: <span>{veiculo.cor}</span></label>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const { ['nextauth.token']: token } = parseCookies(ctx)

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    return {
        props: {
            isAuthenticated: !!token,
        }
    }
}
