import Image from 'next/image';
import classes from './home.module.scss';
import logo from '../../public/jlexpresslogo.png';
import { useEffect, useRef, useState, FormEvent, ChangeEvent } from 'react';
import { useMenu } from '../context/MenuContext';
import { FaWhatsapp } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import Loader from 'react-loader-spinner';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

type FormGroup = {
  nome: string,
  email: string,
  telefone: string,
  assunto: string,
  mensagem: string,
}

export default function Home() {

  const { enqueueSnackbar } = useSnackbar();

  const initialValues = {
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  }

  const { setActiveMenu } = useMenu();

  const home = useRef<HTMLDivElement>(null);
  const servico = useRef<HTMLDivElement>(null);
  const about = useRef<HTMLDivElement>(null);
  const contato = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState<FormGroup>(initialValues);
  const [isSendingMail, setIsSendingMail] = useState<boolean>(false);
  const [isVerify, setIsVerify] = useState<boolean>(false);

  useEffect(() => {

    window.addEventListener('scroll',
      getHeighElement);

  }, []);

  function getHeighElement() {
    const scrollY = window.scrollY;
    const homeHeight = home.current?.clientHeight;
    const servicoHeight = servico.current?.clientHeight;
    const aboutHeight = about.current?.clientHeight;

    if (homeHeight && scrollY <= homeHeight) {

      setActiveMenu(home.current ? home.current?.id : 'home');
    }

    if (homeHeight && scrollY > homeHeight) {

      setActiveMenu(servico.current ? servico.current?.id : 'servico');
    }
    if ((homeHeight && servicoHeight) && (scrollY > (homeHeight + servicoHeight))) {

      setActiveMenu(about.current ? about.current?.id : 'about');
    }
    if ((homeHeight && servicoHeight && aboutHeight) && (scrollY > (homeHeight + servicoHeight + aboutHeight))) {

      setActiveMenu(contato.current ? contato.current?.id : 'contato');
    }

  }

  function handleOnChange(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {

    setValues({
      ...values,
      [event.target.name]: event.target.name === 'telefone' ? mTel(event.target.value) : event.target.value,
    });

  }

  function mTel(tel: string) {
    const regex = /^([0-9]{2})([0-9]{4,5})([0-9]{4})$/;
    var str = tel.replace(/[^0-9]/g, "").slice(0, 11);

    const result = str.replace(regex, "($1) $2-$3");
    return result;
  }

  function handleSubmiterForm(event: FormEvent) {
    event.preventDefault();

    setIsSendingMail(true);

    const data = {
      ...values,
      nome: values.nome.toUpperCase()
    }

    axios.post('/api/sendMail', data).then(response => {
      const { msg } = response.data;

      enqueueSnackbar(msg, {
        variant: 'success'
      });
      setIsSendingMail(false);
      clearForm();
    }).catch(err => {

      const { status } = err.response;

      if (status === 500) {

        enqueueSnackbar('Erro no envio da solicitação. Tente novamente em alguns minutos.', {
          variant: 'error'
        })
      }
      setIsSendingMail(false);
    });

  }

  function clearForm() {
    setValues(initialValues);
  }

  function handleVerify() {
    setIsVerify(prevState => !prevState);
  }

  return (
    <div onScroll={getHeighElement}>
      <section ref={home} id="home" className={classes.containerLogo}>
        <Image
          width={2024}
          height={840}
          objectFit="cover"
          alt="JL Express"
          src={logo}
        ></Image>
      </section>
      <section ref={servico} id="servico" className={classes.containerServices}>
        <h1>Nossos Serviços</h1>
        <div className={classes.services}>
          <img src="/aero1.svg" alt="JL Express Aero" />
          <img src="/aero2.svg" alt="JL Express Aero" />
          <img src="/truck1.svg" alt="JL Express Aero" />
          <img src="/truck2.svg" alt="JL Express Aero" />
          <img src="/truck3.svg" alt="JL Express Aero" />
          <p>
            AÉREO CONVENCIONAL
          </p>
          <p>
            AÉREO PRÓXIMO VÔO
          </p>
          <p>
            RODOVIÁRIO CONVENCIONAL
          </p>
          <p>
            RODOVIÁRIO EXPRESSO
          </p>
          <p>
            COLETAS E ENTREGAS BRASÍLIA E ENTORNO
          </p>
        </div>
      </section>
      <section ref={about} id="about" className={classes.containerAbout}>
        <div className={classes.containerQuem}>
          <h1>Quem Somos</h1>
          <div className={classes.containerFrase}>
            <p>A JL EXPRESS, atua em todo território nacional, através de uma rede de parceiros preparados para atender coletas e entregas de forma rápida e eficiente, de acordo com a necessidade de cada empresa.</p>
            <p>Com parcerias com todas as companhias aéreas e rodoviárias, garantimos preços competitivos e um acompanhamento diferenciado para todas as cargas.</p>
          </div>
          <h2>SOMOS EMPRESA CERTIFICADA:</h2>
        </div>
        <div className={classes.containerParceiros} >
          <img src="/anvisa.png" alt="ANVISA" />
          <img src="/antt.png" alt="ANTT" />
          <img src="/crf.png" alt="CRF" />
        </div>
        <div className={classes.containerClientes}>
          <h1>Clientes Satisfeitos</h1>
          <div className={classes.containerCliItems}>
            <div className={classes.cliente1}>
              <img src="aspas1.png" alt="Aspas" />
              <p>Equipe atenciosa e bastante responsável. Recomendo!</p>
            </div>
            <div className={classes.cliente2}>
              <p>Empresa séria. Fiquei segura e tranquila com o envio das minhas encomendas pela JLEXPRESS.</p>
              <img src="aspas2.png" alt="Aspas" />
            </div>
          </div>
        </div>
      </section>
      <section ref={contato} id="contato" className={classes.containerContato}>
        <h1>Fale Conosco</h1>
        <div className={classes.contatosTipos}>
          <div className={classes.contatoFone} >
            <h2>Ligue</h2>
            <p>(61) 3574-0047</p>
            <div className={classes.zap}>
              <p>
                (61) 99677-1548
              </p>
              <a className={classes.whatsapp} href="https://api.whatsapp.com/send?phone=556196771548&text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20a%20JL%20EXPRESS." target="_blank">
                <FaWhatsapp size={30} color={'#6b7986'} />
              </a>
            </div>
          </div>
          <div className={classes.contatoEmail}>
            <h2>EMAIL</h2>
            <a href="mailto:contatodf@jlexpress.com.br">contatodf@jlexpress.com.br</a>
          </div>
        </div>
        <div className={classes.containerOrcamento}>
          <h2>Faça um Orçamento!</h2>
          {!isSendingMail &&
            <form onSubmit={handleSubmiterForm}>
              <div className={classes.inputGroup}>
                <input name="nome" required type="text" value={values.nome} placeholder="Nome*" onChange={event => { handleOnChange(event) }} />
              </div>
              <div className={classes.inputGroup}>
                <input required name="email" type="email" value={values.email} placeholder="Email*" onChange={event => { handleOnChange(event) }} />
              </div>
              <div className={classes.inputGroup}>
                <input name="telefone" maxLength={15} type="text" value={values.telefone} placeholder="Telefone" onChange={event => { handleOnChange(event) }} />
              </div>
              <div className={classes.inputGroup}>
                <input name="assunto" type="text" value={values.assunto} placeholder="Assunto" onChange={event => { handleOnChange(event) }} />
              </div>
              <div className={classes.inputGroup}>
                <textarea name="mensagem" rows={5} value={values.mensagem} placeholder="Mensagem" onChange={event => { handleOnChange(event) }} />
              </div>
              <div className={classes.formButton}>
                <ReCAPTCHA
                  hl="pt-BR"
                  size="normal"
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleVerify}
                />
                <button type="submit" disabled={!isVerify}>Solicitar</button>
              </div>
            </form>
          }
          {isSendingMail &&
            <Loader type="ThreeDots" color="#6b7986" height={80} width={80} />
          }
        </div>
      </section>
    </div>
  )
}
