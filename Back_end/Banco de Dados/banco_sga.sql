--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
-- Dumped by pg_dump version 15.12

-- Started on 2025-02-21 17:10:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16399)
-- Name: sga; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA sga;


ALTER SCHEMA sga OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 244 (class 1259 OID 16503)
-- Name: categoria_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.categoria_produto (
    id_categoria_produto integer NOT NULL
);


ALTER TABLE sga.categoria_produto OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16450)
-- Name: centro_estoque; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.centro_estoque (
    id_centro_estoque integer NOT NULL,
    descricao_centro_estoque text NOT NULL,
    localizacao_centro_estoque text NOT NULL,
    padrao_centro_estoque boolean NOT NULL
);


ALTER TABLE sga.centro_estoque OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16449)
-- Name: centro_estqoue_id_centro_estqoue_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.centro_estqoue_id_centro_estqoue_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.centro_estqoue_id_centro_estqoue_seq OWNER TO postgres;

--
-- TOC entry 3769 (class 0 OID 0)
-- Dependencies: 229
-- Name: centro_estqoue_id_centro_estqoue_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.centro_estqoue_id_centro_estqoue_seq OWNED BY sga.centro_estoque.id_centro_estoque;


--
-- TOC entry 241 (class 1259 OID 16490)
-- Name: centro_possue_movimentacao; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.centro_possue_movimentacao (
    id_centro_movimentacao integer NOT NULL,
    id_movimentacao_estoque integer NOT NULL,
    id_centro_estqoue integer NOT NULL
);


ALTER TABLE sga.centro_possue_movimentacao OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16489)
-- Name: centro_possue_movimentacao_id_centro_movimentacao_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.centro_possue_movimentacao_id_centro_movimentacao_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.centro_possue_movimentacao_id_centro_movimentacao_seq OWNER TO postgres;

--
-- TOC entry 3770 (class 0 OID 0)
-- Dependencies: 240
-- Name: centro_possue_movimentacao_id_centro_movimentacao_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.centro_possue_movimentacao_id_centro_movimentacao_seq OWNED BY sga.centro_possue_movimentacao.id_centro_movimentacao;


--
-- TOC entry 264 (class 1259 OID 16572)
-- Name: centroestoque_possue_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.centroestoque_possue_produto (
    id_centro_produto integer NOT NULL,
    id_produto integer NOT NULL,
    id_centro_estqoue integer NOT NULL
);


ALTER TABLE sga.centroestoque_possue_produto OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 16571)
-- Name: centroestoque_possue_produto_id_centro_produto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.centroestoque_possue_produto_id_centro_produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.centroestoque_possue_produto_id_centro_produto_seq OWNER TO postgres;

--
-- TOC entry 3771 (class 0 OID 0)
-- Dependencies: 263
-- Name: centroestoque_possue_produto_id_centro_produto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.centroestoque_possue_produto_id_centro_produto_seq OWNED BY sga.centroestoque_possue_produto.id_centro_produto;


--
-- TOC entry 268 (class 1259 OID 16586)
-- Name: certificado_digital; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.certificado_digital (
    id_certificado_digital integer NOT NULL,
    numero_certificado character varying(22) NOT NULL
);


ALTER TABLE sga.certificado_digital OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 16585)
-- Name: certificado_digital_id_certificado_digital_seq_1; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.certificado_digital_id_certificado_digital_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.certificado_digital_id_certificado_digital_seq_1 OWNER TO postgres;

--
-- TOC entry 3772 (class 0 OID 0)
-- Dependencies: 267
-- Name: certificado_digital_id_certificado_digital_seq_1; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.certificado_digital_id_certificado_digital_seq_1 OWNED BY sga.certificado_digital.id_certificado_digital;


--
-- TOC entry 235 (class 1259 OID 16469)
-- Name: conferencia_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.conferencia_produto (
    id_conferencia_produto integer NOT NULL,
    id_movimentacao_estoque integer NOT NULL,
    data_criacao timestamp without time zone NOT NULL
);


ALTER TABLE sga.conferencia_produto OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16468)
-- Name: conferencia_produto_id_conferencia_produto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.conferencia_produto_id_conferencia_produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.conferencia_produto_id_conferencia_produto_seq OWNER TO postgres;

--
-- TOC entry 3773 (class 0 OID 0)
-- Dependencies: 234
-- Name: conferencia_produto_id_conferencia_produto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.conferencia_produto_id_conferencia_produto_seq OWNED BY sga.conferencia_produto.id_conferencia_produto;


--
-- TOC entry 222 (class 1259 OID 16422)
-- Name: contato; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.contato (
    id_contato integer NOT NULL
);


ALTER TABLE sga.contato OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16415)
-- Name: contato_cliente; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.contato_cliente (
    id_contato_cliente integer NOT NULL
);


ALTER TABLE sga.contato_cliente OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16414)
-- Name: contato_cliente_id_contato_cliente_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.contato_cliente_id_contato_cliente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.contato_cliente_id_contato_cliente_seq OWNER TO postgres;

--
-- TOC entry 3774 (class 0 OID 0)
-- Dependencies: 219
-- Name: contato_cliente_id_contato_cliente_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.contato_cliente_id_contato_cliente_seq OWNED BY sga.contato_cliente.id_contato_cliente;


--
-- TOC entry 218 (class 1259 OID 16408)
-- Name: contato_fornecedor; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.contato_fornecedor (
    id_contato_fornecedor integer NOT NULL
);


ALTER TABLE sga.contato_fornecedor OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16407)
-- Name: contato_fornecedor_id_contato_fornecedor_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.contato_fornecedor_id_contato_fornecedor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.contato_fornecedor_id_contato_fornecedor_seq OWNER TO postgres;

--
-- TOC entry 3775 (class 0 OID 0)
-- Dependencies: 217
-- Name: contato_fornecedor_id_contato_fornecedor_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.contato_fornecedor_id_contato_fornecedor_seq OWNED BY sga.contato_fornecedor.id_contato_fornecedor;


--
-- TOC entry 221 (class 1259 OID 16421)
-- Name: contato_id_contato_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.contato_id_contato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.contato_id_contato_seq OWNER TO postgres;

--
-- TOC entry 3776 (class 0 OID 0)
-- Dependencies: 221
-- Name: contato_id_contato_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.contato_id_contato_seq OWNED BY sga.contato.id_contato;


--
-- TOC entry 224 (class 1259 OID 16429)
-- Name: contato_podeser_contato_cliente; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.contato_podeser_contato_cliente (
    id_contato_contatocliente integer NOT NULL,
    id_contato_fornecedor integer NOT NULL,
    id_contato_cliente integer NOT NULL,
    id_contato integer NOT NULL
);


ALTER TABLE sga.contato_podeser_contato_cliente OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16428)
-- Name: contato_podeser_contato_cliente_id_contato_contatocliente_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.contato_podeser_contato_cliente_id_contato_contatocliente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.contato_podeser_contato_cliente_id_contato_contatocliente_seq OWNER TO postgres;

--
-- TOC entry 3777 (class 0 OID 0)
-- Dependencies: 223
-- Name: contato_podeser_contato_cliente_id_contato_contatocliente_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.contato_podeser_contato_cliente_id_contato_contatocliente_seq OWNED BY sga.contato_podeser_contato_cliente.id_contato_contatocliente;


--
-- TOC entry 266 (class 1259 OID 16579)
-- Name: dados_contador; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.dados_contador (
    id_dados_contador integer NOT NULL,
    nome character varying(100),
    cpf character varying(14),
    crc character varying(15),
    cnpj character varying(14),
    cep character varying(8),
    endereco character varying(100),
    numero character varying(5),
    bairro character varying(30),
    municipio character varying(30),
    uf character varying(2) NOT NULL,
    fone character varying(11),
    email character varying(100)
);


ALTER TABLE sga.dados_contador OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 16578)
-- Name: dados_contador_dados_contador_seq_1; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.dados_contador_dados_contador_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.dados_contador_dados_contador_seq_1 OWNER TO postgres;

--
-- TOC entry 3778 (class 0 OID 0)
-- Dependencies: 265
-- Name: dados_contador_dados_contador_seq_1; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.dados_contador_dados_contador_seq_1 OWNED BY sga.dados_contador.id_dados_contador;


--
-- TOC entry 269 (class 1259 OID 16592)
-- Name: empresa; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.empresa (
    id_empresa integer NOT NULL,
    id_dados_contador integer NOT NULL,
    id_certificado_digital integer NOT NULL,
    nome_fantasia character varying(100),
    razao_social character varying(100) NOT NULL,
    endereco character varying(100),
    bairro character varying(30),
    municipio character varying(30),
    uf character varying(2) NOT NULL,
    status character varying(7) NOT NULL,
    cep character varying(8),
    numero character varying(5),
    complemento character varying(30),
    fone character varying(11),
    celular character varying(11),
    cnpj character varying(18) NOT NULL,
    inscricao_estadual character varying(14),
    inscricao_municipal character varying(11),
    email character varying(100),
    site character varying(100)
);


ALTER TABLE sga.empresa OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 16600)
-- Name: empresa_possue_centroestoque; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.empresa_possue_centroestoque (
    id_empresa_centroestoque integer NOT NULL,
    id_centro_estqoue integer NOT NULL,
    id_empresa integer NOT NULL
);


ALTER TABLE sga.empresa_possue_centroestoque OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 16599)
-- Name: empresa_possue_centroestoque_id_empresa_centroestoque_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.empresa_possue_centroestoque_id_empresa_centroestoque_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.empresa_possue_centroestoque_id_empresa_centroestoque_seq OWNER TO postgres;

--
-- TOC entry 3779 (class 0 OID 0)
-- Dependencies: 270
-- Name: empresa_possue_centroestoque_id_empresa_centroestoque_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.empresa_possue_centroestoque_id_empresa_centroestoque_seq OWNED BY sga.empresa_possue_centroestoque.id_empresa_centroestoque;


--
-- TOC entry 294 (class 1259 OID 16686)
-- Name: faz_usuario_transacao; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.faz_usuario_transacao (
    id_usuario_transacao integer NOT NULL,
    id_transacao integer NOT NULL,
    id_usuario_sql integer NOT NULL
);


ALTER TABLE sga.faz_usuario_transacao OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 16685)
-- Name: faz_usuario_transacao_id_usuario_transacao_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.faz_usuario_transacao_id_usuario_transacao_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.faz_usuario_transacao_id_usuario_transacao_seq OWNER TO postgres;

--
-- TOC entry 3780 (class 0 OID 0)
-- Dependencies: 293
-- Name: faz_usuario_transacao_id_usuario_transacao_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.faz_usuario_transacao_id_usuario_transacao_seq OWNED BY sga.faz_usuario_transacao.id_usuario_transacao;


--
-- TOC entry 248 (class 1259 OID 16516)
-- Name: grupo_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.grupo_produto (
    id_grupo_produto integer NOT NULL
);


ALTER TABLE sga.grupo_produto OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16515)
-- Name: grupo_produto_id_grupo_produto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.grupo_produto_id_grupo_produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.grupo_produto_id_grupo_produto_seq OWNER TO postgres;

--
-- TOC entry 3781 (class 0 OID 0)
-- Dependencies: 247
-- Name: grupo_produto_id_grupo_produto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.grupo_produto_id_grupo_produto_seq OWNED BY sga.grupo_produto.id_grupo_produto;


--
-- TOC entry 262 (class 1259 OID 16565)
-- Name: localizacao_possue_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.localizacao_possue_produto (
    id_localizacaoproduto integer NOT NULL,
    id_produto integer NOT NULL
);


ALTER TABLE sga.localizacao_possue_produto OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 16564)
-- Name: localizacao_possue_produto_id_localizacaoproduto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.localizacao_possue_produto_id_localizacaoproduto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.localizacao_possue_produto_id_localizacaoproduto_seq OWNER TO postgres;

--
-- TOC entry 3782 (class 0 OID 0)
-- Dependencies: 261
-- Name: localizacao_possue_produto_id_localizacaoproduto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.localizacao_possue_produto_id_localizacaoproduto_seq OWNED BY sga.localizacao_possue_produto.id_localizacaoproduto;


--
-- TOC entry 216 (class 1259 OID 16401)
-- Name: modulo; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.modulo (
    id_modulo integer NOT NULL
);


ALTER TABLE sga.modulo OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16400)
-- Name: modulo_id_modulo_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.modulo_id_modulo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.modulo_id_modulo_seq OWNER TO postgres;

--
-- TOC entry 3783 (class 0 OID 0)
-- Dependencies: 215
-- Name: modulo_id_modulo_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.modulo_id_modulo_seq OWNED BY sga.modulo.id_modulo;


--
-- TOC entry 275 (class 1259 OID 16614)
-- Name: modulo_possue_tela; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.modulo_possue_tela (
    id_modulo_tela integer NOT NULL,
    id_modulo integer NOT NULL,
    id_tela integer NOT NULL
);


ALTER TABLE sga.modulo_possue_tela OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 16613)
-- Name: modulo_possue_tela_id_modulo_tela_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.modulo_possue_tela_id_modulo_tela_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.modulo_possue_tela_id_modulo_tela_seq OWNER TO postgres;

--
-- TOC entry 3784 (class 0 OID 0)
-- Dependencies: 274
-- Name: modulo_possue_tela_id_modulo_tela_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.modulo_possue_tela_id_modulo_tela_seq OWNED BY sga.modulo_possue_tela.id_modulo_tela;


--
-- TOC entry 233 (class 1259 OID 16462)
-- Name: movimentacao_estoque; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.movimentacao_estoque (
    id_movimentacao_estoque integer NOT NULL
);


ALTER TABLE sga.movimentacao_estoque OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16461)
-- Name: movimentacao_estoque_id_movimentacao_estoque_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.movimentacao_estoque_id_movimentacao_estoque_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.movimentacao_estoque_id_movimentacao_estoque_seq OWNER TO postgres;

--
-- TOC entry 3785 (class 0 OID 0)
-- Dependencies: 232
-- Name: movimentacao_estoque_id_movimentacao_estoque_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.movimentacao_estoque_id_movimentacao_estoque_seq OWNED BY sga.movimentacao_estoque.id_movimentacao_estoque;


--
-- TOC entry 237 (class 1259 OID 16476)
-- Name: movimentacao_possue_contato; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.movimentacao_possue_contato (
    id_movimentacao_contato integer NOT NULL,
    id_contato integer NOT NULL,
    id_movimentacao_estoque integer NOT NULL
);


ALTER TABLE sga.movimentacao_possue_contato OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16475)
-- Name: movimentacao_possue_contato_id_movimentacao_contato_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.movimentacao_possue_contato_id_movimentacao_contato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.movimentacao_possue_contato_id_movimentacao_contato_seq OWNER TO postgres;

--
-- TOC entry 3786 (class 0 OID 0)
-- Dependencies: 236
-- Name: movimentacao_possue_contato_id_movimentacao_contato_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.movimentacao_possue_contato_id_movimentacao_contato_seq OWNED BY sga.movimentacao_possue_contato.id_movimentacao_contato;


--
-- TOC entry 258 (class 1259 OID 16551)
-- Name: movimentacao_possue_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.movimentacao_possue_produto (
    id_movimentacao_produto integer NOT NULL,
    id_movimentacao_estoque integer NOT NULL,
    id_produto integer NOT NULL
);


ALTER TABLE sga.movimentacao_possue_produto OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 16550)
-- Name: movimentacao_possue_produto_id_movimentacao_produto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.movimentacao_possue_produto_id_movimentacao_produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.movimentacao_possue_produto_id_movimentacao_produto_seq OWNER TO postgres;

--
-- TOC entry 3787 (class 0 OID 0)
-- Dependencies: 257
-- Name: movimentacao_possue_produto_id_movimentacao_produto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.movimentacao_possue_produto_id_movimentacao_produto_seq OWNED BY sga.movimentacao_possue_produto.id_movimentacao_produto;


--
-- TOC entry 239 (class 1259 OID 16483)
-- Name: movimentacao_possue_tipomovimentacao; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.movimentacao_possue_tipomovimentacao (
    id_tipo_movimentacao integer NOT NULL,
    id_tipo_movimentacao_estqoue integer NOT NULL,
    id_movimentacao_estoque integer NOT NULL
);


ALTER TABLE sga.movimentacao_possue_tipomovimentacao OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16482)
-- Name: movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq OWNER TO postgres;

--
-- TOC entry 3788 (class 0 OID 0)
-- Dependencies: 238
-- Name: movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq OWNED BY sga.movimentacao_possue_tipomovimentacao.id_tipo_movimentacao;


--
-- TOC entry 226 (class 1259 OID 16436)
-- Name: nota_fiscal_xml; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.nota_fiscal_xml (
    id_nota_fiscal_xml integer NOT NULL
);


ALTER TABLE sga.nota_fiscal_xml OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16435)
-- Name: nota_fiscal_xml_id_nota_fiscal_xml_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.nota_fiscal_xml_id_nota_fiscal_xml_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.nota_fiscal_xml_id_nota_fiscal_xml_seq OWNER TO postgres;

--
-- TOC entry 3789 (class 0 OID 0)
-- Dependencies: 225
-- Name: nota_fiscal_xml_id_nota_fiscal_xml_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.nota_fiscal_xml_id_nota_fiscal_xml_seq OWNED BY sga.nota_fiscal_xml.id_nota_fiscal_xml;


--
-- TOC entry 228 (class 1259 OID 16443)
-- Name: notafiscal_possue_fornecedor; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.notafiscal_possue_fornecedor (
    id_notafsical_fornecedor integer NOT NULL,
    id_nota_fiscal_xml integer NOT NULL,
    id_contato_fornecedor integer NOT NULL
);


ALTER TABLE sga.notafiscal_possue_fornecedor OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16442)
-- Name: notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq OWNER TO postgres;

--
-- TOC entry 3790 (class 0 OID 0)
-- Dependencies: 227
-- Name: notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq OWNED BY sga.notafiscal_possue_fornecedor.id_notafsical_fornecedor;


--
-- TOC entry 260 (class 1259 OID 16558)
-- Name: notafiscal_possue_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.notafiscal_possue_produto (
    id_nota_produto integer NOT NULL,
    id_produto integer NOT NULL,
    id_nota_fiscal_xml integer NOT NULL
);


ALTER TABLE sga.notafiscal_possue_produto OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 16557)
-- Name: notafiscal_possue_produto_id_nota_produto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.notafiscal_possue_produto_id_nota_produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.notafiscal_possue_produto_id_nota_produto_seq OWNER TO postgres;

--
-- TOC entry 3791 (class 0 OID 0)
-- Dependencies: 259
-- Name: notafiscal_possue_produto_id_nota_produto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.notafiscal_possue_produto_id_nota_produto_seq OWNED BY sga.notafiscal_possue_produto.id_nota_produto;


--
-- TOC entry 277 (class 1259 OID 16621)
-- Name: perfil; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.perfil (
    id_perfil integer NOT NULL
);


ALTER TABLE sga.perfil OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 16620)
-- Name: perfil_id_perfil_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.perfil_id_perfil_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.perfil_id_perfil_seq OWNER TO postgres;

--
-- TOC entry 3792 (class 0 OID 0)
-- Dependencies: 276
-- Name: perfil_id_perfil_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.perfil_id_perfil_seq OWNED BY sga.perfil.id_perfil;


--
-- TOC entry 279 (class 1259 OID 16628)
-- Name: perfil_possue_modulo; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.perfil_possue_modulo (
    id_perfil_modulo integer NOT NULL,
    id_modulo integer NOT NULL,
    id_perfil integer NOT NULL
);


ALTER TABLE sga.perfil_possue_modulo OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 16627)
-- Name: perfil_possue_modulo_id_perfil_modulo_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.perfil_possue_modulo_id_perfil_modulo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.perfil_possue_modulo_id_perfil_modulo_seq OWNER TO postgres;

--
-- TOC entry 3793 (class 0 OID 0)
-- Dependencies: 278
-- Name: perfil_possue_modulo_id_perfil_modulo_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.perfil_possue_modulo_id_perfil_modulo_seq OWNED BY sga.perfil_possue_modulo.id_perfil_modulo;


--
-- TOC entry 281 (class 1259 OID 16635)
-- Name: perfil_possue_tela; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.perfil_possue_tela (
    id_perfil_tela integer NOT NULL,
    id_tela integer NOT NULL,
    id_perfil integer NOT NULL
);


ALTER TABLE sga.perfil_possue_tela OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 16634)
-- Name: perfil_possue_tela_id_perfil_tela_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.perfil_possue_tela_id_perfil_tela_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.perfil_possue_tela_id_perfil_tela_seq OWNER TO postgres;

--
-- TOC entry 3794 (class 0 OID 0)
-- Dependencies: 280
-- Name: perfil_possue_tela_id_perfil_tela_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.perfil_possue_tela_id_perfil_tela_seq OWNED BY sga.perfil_possue_tela.id_perfil_tela;


--
-- TOC entry 250 (class 1259 OID 16523)
-- Name: produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.produto (
    id_produto integer NOT NULL
);


ALTER TABLE sga.produto OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16522)
-- Name: produto_id_produto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.produto_id_produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.produto_id_produto_seq OWNER TO postgres;

--
-- TOC entry 3795 (class 0 OID 0)
-- Dependencies: 249
-- Name: produto_id_produto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.produto_id_produto_seq OWNED BY sga.produto.id_produto;


--
-- TOC entry 254 (class 1259 OID 16537)
-- Name: produto_possue_fornecedor; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.produto_possue_fornecedor (
    id_produto_fornecedor integer NOT NULL,
    id_contato_fornecedor integer NOT NULL,
    id_produto integer NOT NULL
);


ALTER TABLE sga.produto_possue_fornecedor OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16536)
-- Name: produto_possue_fornecedor_id_produto_fornecedor_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.produto_possue_fornecedor_id_produto_fornecedor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.produto_possue_fornecedor_id_produto_fornecedor_seq OWNER TO postgres;

--
-- TOC entry 3796 (class 0 OID 0)
-- Dependencies: 253
-- Name: produto_possue_fornecedor_id_produto_fornecedor_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.produto_possue_fornecedor_id_produto_fornecedor_seq OWNED BY sga.produto_possue_fornecedor.id_produto_fornecedor;


--
-- TOC entry 252 (class 1259 OID 16530)
-- Name: produto_possue_grupo; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.produto_possue_grupo (
    id_produto_grupo integer NOT NULL,
    id_categoria_produto integer NOT NULL,
    id_subgrupo_produto integer NOT NULL,
    id_grupo_produto integer NOT NULL,
    id_produto integer NOT NULL
);


ALTER TABLE sga.produto_possue_grupo OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16529)
-- Name: produto_possue_grupo_id_produto_grupo_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.produto_possue_grupo_id_produto_grupo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.produto_possue_grupo_id_produto_grupo_seq OWNER TO postgres;

--
-- TOC entry 3797 (class 0 OID 0)
-- Dependencies: 251
-- Name: produto_possue_grupo_id_produto_grupo_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.produto_possue_grupo_id_produto_grupo_seq OWNED BY sga.produto_possue_grupo.id_produto_grupo;


--
-- TOC entry 256 (class 1259 OID 16544)
-- Name: produto_possue_tributacao; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.produto_possue_tributacao (
    id_produto_tributacao integer NOT NULL,
    id_tributacao_produto integer NOT NULL,
    id_produto integer NOT NULL
);


ALTER TABLE sga.produto_possue_tributacao OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16543)
-- Name: produto_possue_tributacao_id_produto_tributacao_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.produto_possue_tributacao_id_produto_tributacao_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.produto_possue_tributacao_id_produto_tributacao_seq OWNER TO postgres;

--
-- TOC entry 3798 (class 0 OID 0)
-- Dependencies: 255
-- Name: produto_possue_tributacao_id_produto_tributacao_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.produto_possue_tributacao_id_produto_tributacao_seq OWNED BY sga.produto_possue_tributacao.id_produto_tributacao;


--
-- TOC entry 246 (class 1259 OID 16509)
-- Name: subgrupo_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.subgrupo_produto (
    id_subgrupo_produto integer NOT NULL
);


ALTER TABLE sga.subgrupo_produto OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16508)
-- Name: subgrupo_produto_id_subgrupo_produto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.subgrupo_produto_id_subgrupo_produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.subgrupo_produto_id_subgrupo_produto_seq OWNER TO postgres;

--
-- TOC entry 3799 (class 0 OID 0)
-- Dependencies: 245
-- Name: subgrupo_produto_id_subgrupo_produto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.subgrupo_produto_id_subgrupo_produto_seq OWNED BY sga.subgrupo_produto.id_subgrupo_produto;


--
-- TOC entry 273 (class 1259 OID 16607)
-- Name: tela; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.tela (
    id_tela integer NOT NULL
);


ALTER TABLE sga.tela OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 16606)
-- Name: tela_id_tela_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.tela_id_tela_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.tela_id_tela_seq OWNER TO postgres;

--
-- TOC entry 3800 (class 0 OID 0)
-- Dependencies: 272
-- Name: tela_id_tela_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.tela_id_tela_seq OWNED BY sga.tela.id_tela;


--
-- TOC entry 231 (class 1259 OID 16456)
-- Name: tipo_movimentacao_estqoue; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.tipo_movimentacao_estqoue (
    id_tipo_movimentacao_estqoue integer NOT NULL
);


ALTER TABLE sga.tipo_movimentacao_estqoue OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 16671)
-- Name: transacao_sql; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.transacao_sql (
    id_transacao integer NOT NULL,
    comando character varying NOT NULL,
    tabela_afetada character varying(100) NOT NULL,
    data_execucao timestamp without time zone NOT NULL,
    resultado_execucao character varying(20) NOT NULL,
    ip_origem character varying(45) NOT NULL,
    id_sessao character varying(50) NOT NULL
);


ALTER TABLE sga.transacao_sql OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16497)
-- Name: tributacao_produto; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.tributacao_produto (
    id_tributacao_produto integer NOT NULL
);


ALTER TABLE sga.tributacao_produto OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16496)
-- Name: tributacao_produto_id_tributacao_produto_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.tributacao_produto_id_tributacao_produto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.tributacao_produto_id_tributacao_produto_seq OWNER TO postgres;

--
-- TOC entry 3801 (class 0 OID 0)
-- Dependencies: 242
-- Name: tributacao_produto_id_tributacao_produto_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.tributacao_produto_id_tributacao_produto_seq OWNED BY sga.tributacao_produto.id_tributacao_produto;


--
-- TOC entry 283 (class 1259 OID 16642)
-- Name: usuario; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.usuario (
    id_usuario integer NOT NULL,
    nome character varying(50) NOT NULL,
    senha character varying(8) NOT NULL,
    email character varying NOT NULL,
    celular character varying,
    data_criacao timestamp without time zone NOT NULL,
    grupo character varying(50)
);


ALTER TABLE sga.usuario OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 16651)
-- Name: usuario_conferencia; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.usuario_conferencia (
    id_usuario_conferencia integer NOT NULL,
    id_conferencia_produto integer NOT NULL,
    id_usuario integer NOT NULL
);


ALTER TABLE sga.usuario_conferencia OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 16650)
-- Name: usuario_conferencia_id_usuario_conferencia_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.usuario_conferencia_id_usuario_conferencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.usuario_conferencia_id_usuario_conferencia_seq OWNER TO postgres;

--
-- TOC entry 3802 (class 0 OID 0)
-- Dependencies: 284
-- Name: usuario_conferencia_id_usuario_conferencia_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.usuario_conferencia_id_usuario_conferencia_seq OWNED BY sga.usuario_conferencia.id_usuario_conferencia;


--
-- TOC entry 282 (class 1259 OID 16641)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 3803 (class 0 OID 0)
-- Dependencies: 282
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.usuario_id_usuario_seq OWNED BY sga.usuario.id_usuario;


--
-- TOC entry 289 (class 1259 OID 16665)
-- Name: usuario_possue_empresa; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.usuario_possue_empresa (
    id_usuario_empresa integer NOT NULL,
    id_empresa integer NOT NULL,
    id_usuario integer NOT NULL
);


ALTER TABLE sga.usuario_possue_empresa OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 16664)
-- Name: usuario_possue_empresa_id_usuario_empresa_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.usuario_possue_empresa_id_usuario_empresa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.usuario_possue_empresa_id_usuario_empresa_seq OWNER TO postgres;

--
-- TOC entry 3804 (class 0 OID 0)
-- Dependencies: 288
-- Name: usuario_possue_empresa_id_usuario_empresa_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.usuario_possue_empresa_id_usuario_empresa_seq OWNED BY sga.usuario_possue_empresa.id_usuario_empresa;


--
-- TOC entry 287 (class 1259 OID 16658)
-- Name: usuario_possue_perfil; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.usuario_possue_perfil (
    id_usuario_perfil integer NOT NULL,
    id_perfil integer NOT NULL,
    id_usuario integer NOT NULL
);


ALTER TABLE sga.usuario_possue_perfil OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 16657)
-- Name: usuario_possue_perfil_id_usuario_perfil_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.usuario_possue_perfil_id_usuario_perfil_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.usuario_possue_perfil_id_usuario_perfil_seq OWNER TO postgres;

--
-- TOC entry 3805 (class 0 OID 0)
-- Dependencies: 286
-- Name: usuario_possue_perfil_id_usuario_perfil_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.usuario_possue_perfil_id_usuario_perfil_seq OWNED BY sga.usuario_possue_perfil.id_usuario_perfil;


--
-- TOC entry 292 (class 1259 OID 16679)
-- Name: usuario_sql; Type: TABLE; Schema: sga; Owner: postgres
--

CREATE TABLE sga.usuario_sql (
    id_usuario_sql integer NOT NULL,
    nome character varying(50) NOT NULL,
    senha character varying(8) NOT NULL
);


ALTER TABLE sga.usuario_sql OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 16678)
-- Name: usuario_sql_id_usuario_sql_seq; Type: SEQUENCE; Schema: sga; Owner: postgres
--

CREATE SEQUENCE sga.usuario_sql_id_usuario_sql_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sga.usuario_sql_id_usuario_sql_seq OWNER TO postgres;

--
-- TOC entry 3806 (class 0 OID 0)
-- Dependencies: 291
-- Name: usuario_sql_id_usuario_sql_seq; Type: SEQUENCE OWNED BY; Schema: sga; Owner: postgres
--

ALTER SEQUENCE sga.usuario_sql_id_usuario_sql_seq OWNED BY sga.usuario_sql.id_usuario_sql;


--
-- TOC entry 3382 (class 2604 OID 16453)
-- Name: centro_estoque id_centro_estoque; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centro_estoque ALTER COLUMN id_centro_estoque SET DEFAULT nextval('sga.centro_estqoue_id_centro_estqoue_seq'::regclass);


--
-- TOC entry 3387 (class 2604 OID 16493)
-- Name: centro_possue_movimentacao id_centro_movimentacao; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centro_possue_movimentacao ALTER COLUMN id_centro_movimentacao SET DEFAULT nextval('sga.centro_possue_movimentacao_id_centro_movimentacao_seq'::regclass);


--
-- TOC entry 3398 (class 2604 OID 16575)
-- Name: centroestoque_possue_produto id_centro_produto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centroestoque_possue_produto ALTER COLUMN id_centro_produto SET DEFAULT nextval('sga.centroestoque_possue_produto_id_centro_produto_seq'::regclass);


--
-- TOC entry 3400 (class 2604 OID 16589)
-- Name: certificado_digital id_certificado_digital; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.certificado_digital ALTER COLUMN id_certificado_digital SET DEFAULT nextval('sga.certificado_digital_id_certificado_digital_seq_1'::regclass);


--
-- TOC entry 3384 (class 2604 OID 16472)
-- Name: conferencia_produto id_conferencia_produto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.conferencia_produto ALTER COLUMN id_conferencia_produto SET DEFAULT nextval('sga.conferencia_produto_id_conferencia_produto_seq'::regclass);


--
-- TOC entry 3378 (class 2604 OID 16425)
-- Name: contato id_contato; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato ALTER COLUMN id_contato SET DEFAULT nextval('sga.contato_id_contato_seq'::regclass);


--
-- TOC entry 3377 (class 2604 OID 16418)
-- Name: contato_cliente id_contato_cliente; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_cliente ALTER COLUMN id_contato_cliente SET DEFAULT nextval('sga.contato_cliente_id_contato_cliente_seq'::regclass);


--
-- TOC entry 3376 (class 2604 OID 16411)
-- Name: contato_fornecedor id_contato_fornecedor; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_fornecedor ALTER COLUMN id_contato_fornecedor SET DEFAULT nextval('sga.contato_fornecedor_id_contato_fornecedor_seq'::regclass);


--
-- TOC entry 3379 (class 2604 OID 16432)
-- Name: contato_podeser_contato_cliente id_contato_contatocliente; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_podeser_contato_cliente ALTER COLUMN id_contato_contatocliente SET DEFAULT nextval('sga.contato_podeser_contato_cliente_id_contato_contatocliente_seq'::regclass);


--
-- TOC entry 3399 (class 2604 OID 16582)
-- Name: dados_contador id_dados_contador; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.dados_contador ALTER COLUMN id_dados_contador SET DEFAULT nextval('sga.dados_contador_dados_contador_seq_1'::regclass);


--
-- TOC entry 3401 (class 2604 OID 16603)
-- Name: empresa_possue_centroestoque id_empresa_centroestoque; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.empresa_possue_centroestoque ALTER COLUMN id_empresa_centroestoque SET DEFAULT nextval('sga.empresa_possue_centroestoque_id_empresa_centroestoque_seq'::regclass);


--
-- TOC entry 3412 (class 2604 OID 16689)
-- Name: faz_usuario_transacao id_usuario_transacao; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.faz_usuario_transacao ALTER COLUMN id_usuario_transacao SET DEFAULT nextval('sga.faz_usuario_transacao_id_usuario_transacao_seq'::regclass);


--
-- TOC entry 3390 (class 2604 OID 16519)
-- Name: grupo_produto id_grupo_produto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.grupo_produto ALTER COLUMN id_grupo_produto SET DEFAULT nextval('sga.grupo_produto_id_grupo_produto_seq'::regclass);


--
-- TOC entry 3397 (class 2604 OID 16568)
-- Name: localizacao_possue_produto id_localizacaoproduto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.localizacao_possue_produto ALTER COLUMN id_localizacaoproduto SET DEFAULT nextval('sga.localizacao_possue_produto_id_localizacaoproduto_seq'::regclass);


--
-- TOC entry 3375 (class 2604 OID 16404)
-- Name: modulo id_modulo; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.modulo ALTER COLUMN id_modulo SET DEFAULT nextval('sga.modulo_id_modulo_seq'::regclass);


--
-- TOC entry 3403 (class 2604 OID 16617)
-- Name: modulo_possue_tela id_modulo_tela; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.modulo_possue_tela ALTER COLUMN id_modulo_tela SET DEFAULT nextval('sga.modulo_possue_tela_id_modulo_tela_seq'::regclass);


--
-- TOC entry 3383 (class 2604 OID 16465)
-- Name: movimentacao_estoque id_movimentacao_estoque; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_estoque ALTER COLUMN id_movimentacao_estoque SET DEFAULT nextval('sga.movimentacao_estoque_id_movimentacao_estoque_seq'::regclass);


--
-- TOC entry 3385 (class 2604 OID 16479)
-- Name: movimentacao_possue_contato id_movimentacao_contato; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_contato ALTER COLUMN id_movimentacao_contato SET DEFAULT nextval('sga.movimentacao_possue_contato_id_movimentacao_contato_seq'::regclass);


--
-- TOC entry 3395 (class 2604 OID 16554)
-- Name: movimentacao_possue_produto id_movimentacao_produto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_produto ALTER COLUMN id_movimentacao_produto SET DEFAULT nextval('sga.movimentacao_possue_produto_id_movimentacao_produto_seq'::regclass);


--
-- TOC entry 3386 (class 2604 OID 16486)
-- Name: movimentacao_possue_tipomovimentacao id_tipo_movimentacao; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_tipomovimentacao ALTER COLUMN id_tipo_movimentacao SET DEFAULT nextval('sga.movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq'::regclass);


--
-- TOC entry 3380 (class 2604 OID 16439)
-- Name: nota_fiscal_xml id_nota_fiscal_xml; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.nota_fiscal_xml ALTER COLUMN id_nota_fiscal_xml SET DEFAULT nextval('sga.nota_fiscal_xml_id_nota_fiscal_xml_seq'::regclass);


--
-- TOC entry 3381 (class 2604 OID 16446)
-- Name: notafiscal_possue_fornecedor id_notafsical_fornecedor; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.notafiscal_possue_fornecedor ALTER COLUMN id_notafsical_fornecedor SET DEFAULT nextval('sga.notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq'::regclass);


--
-- TOC entry 3396 (class 2604 OID 16561)
-- Name: notafiscal_possue_produto id_nota_produto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.notafiscal_possue_produto ALTER COLUMN id_nota_produto SET DEFAULT nextval('sga.notafiscal_possue_produto_id_nota_produto_seq'::regclass);


--
-- TOC entry 3404 (class 2604 OID 16624)
-- Name: perfil id_perfil; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil ALTER COLUMN id_perfil SET DEFAULT nextval('sga.perfil_id_perfil_seq'::regclass);


--
-- TOC entry 3405 (class 2604 OID 16631)
-- Name: perfil_possue_modulo id_perfil_modulo; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil_possue_modulo ALTER COLUMN id_perfil_modulo SET DEFAULT nextval('sga.perfil_possue_modulo_id_perfil_modulo_seq'::regclass);


--
-- TOC entry 3406 (class 2604 OID 16638)
-- Name: perfil_possue_tela id_perfil_tela; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil_possue_tela ALTER COLUMN id_perfil_tela SET DEFAULT nextval('sga.perfil_possue_tela_id_perfil_tela_seq'::regclass);


--
-- TOC entry 3391 (class 2604 OID 16526)
-- Name: produto id_produto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto ALTER COLUMN id_produto SET DEFAULT nextval('sga.produto_id_produto_seq'::regclass);


--
-- TOC entry 3393 (class 2604 OID 16540)
-- Name: produto_possue_fornecedor id_produto_fornecedor; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_fornecedor ALTER COLUMN id_produto_fornecedor SET DEFAULT nextval('sga.produto_possue_fornecedor_id_produto_fornecedor_seq'::regclass);


--
-- TOC entry 3392 (class 2604 OID 16533)
-- Name: produto_possue_grupo id_produto_grupo; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_grupo ALTER COLUMN id_produto_grupo SET DEFAULT nextval('sga.produto_possue_grupo_id_produto_grupo_seq'::regclass);


--
-- TOC entry 3394 (class 2604 OID 16547)
-- Name: produto_possue_tributacao id_produto_tributacao; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_tributacao ALTER COLUMN id_produto_tributacao SET DEFAULT nextval('sga.produto_possue_tributacao_id_produto_tributacao_seq'::regclass);


--
-- TOC entry 3389 (class 2604 OID 16512)
-- Name: subgrupo_produto id_subgrupo_produto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.subgrupo_produto ALTER COLUMN id_subgrupo_produto SET DEFAULT nextval('sga.subgrupo_produto_id_subgrupo_produto_seq'::regclass);


--
-- TOC entry 3402 (class 2604 OID 16610)
-- Name: tela id_tela; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.tela ALTER COLUMN id_tela SET DEFAULT nextval('sga.tela_id_tela_seq'::regclass);


--
-- TOC entry 3388 (class 2604 OID 16500)
-- Name: tributacao_produto id_tributacao_produto; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.tributacao_produto ALTER COLUMN id_tributacao_produto SET DEFAULT nextval('sga.tributacao_produto_id_tributacao_produto_seq'::regclass);


--
-- TOC entry 3407 (class 2604 OID 16645)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('sga.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 3408 (class 2604 OID 16654)
-- Name: usuario_conferencia id_usuario_conferencia; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_conferencia ALTER COLUMN id_usuario_conferencia SET DEFAULT nextval('sga.usuario_conferencia_id_usuario_conferencia_seq'::regclass);


--
-- TOC entry 3410 (class 2604 OID 16668)
-- Name: usuario_possue_empresa id_usuario_empresa; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_possue_empresa ALTER COLUMN id_usuario_empresa SET DEFAULT nextval('sga.usuario_possue_empresa_id_usuario_empresa_seq'::regclass);


--
-- TOC entry 3409 (class 2604 OID 16661)
-- Name: usuario_possue_perfil id_usuario_perfil; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_possue_perfil ALTER COLUMN id_usuario_perfil SET DEFAULT nextval('sga.usuario_possue_perfil_id_usuario_perfil_seq'::regclass);


--
-- TOC entry 3411 (class 2604 OID 16682)
-- Name: usuario_sql id_usuario_sql; Type: DEFAULT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_sql ALTER COLUMN id_usuario_sql SET DEFAULT nextval('sga.usuario_sql_id_usuario_sql_seq'::regclass);


--
-- TOC entry 3713 (class 0 OID 16503)
-- Dependencies: 244
-- Data for Name: categoria_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.categoria_produto (id_categoria_produto) FROM stdin;
\.


--
-- TOC entry 3699 (class 0 OID 16450)
-- Dependencies: 230
-- Data for Name: centro_estoque; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.centro_estoque (id_centro_estoque, descricao_centro_estoque, localizacao_centro_estoque, padrao_centro_estoque) FROM stdin;
1	Principal	Corredor 3	t
2	Principal	Corredor 3	t
3	Principal	Corredor 3	t
4	Secundário	Corredor 5	f
5	Secundário	Corredor 1	f
6	Principal	Corredor 2	t
7	Reserva	Corredor 2	f
\.


--
-- TOC entry 3710 (class 0 OID 16490)
-- Dependencies: 241
-- Data for Name: centro_possue_movimentacao; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.centro_possue_movimentacao (id_centro_movimentacao, id_movimentacao_estoque, id_centro_estqoue) FROM stdin;
\.


--
-- TOC entry 3733 (class 0 OID 16572)
-- Dependencies: 264
-- Data for Name: centroestoque_possue_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.centroestoque_possue_produto (id_centro_produto, id_produto, id_centro_estqoue) FROM stdin;
\.


--
-- TOC entry 3737 (class 0 OID 16586)
-- Dependencies: 268
-- Data for Name: certificado_digital; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.certificado_digital (id_certificado_digital, numero_certificado) FROM stdin;
\.


--
-- TOC entry 3704 (class 0 OID 16469)
-- Dependencies: 235
-- Data for Name: conferencia_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.conferencia_produto (id_conferencia_produto, id_movimentacao_estoque, data_criacao) FROM stdin;
\.


--
-- TOC entry 3691 (class 0 OID 16422)
-- Dependencies: 222
-- Data for Name: contato; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.contato (id_contato) FROM stdin;
\.


--
-- TOC entry 3689 (class 0 OID 16415)
-- Dependencies: 220
-- Data for Name: contato_cliente; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.contato_cliente (id_contato_cliente) FROM stdin;
\.


--
-- TOC entry 3687 (class 0 OID 16408)
-- Dependencies: 218
-- Data for Name: contato_fornecedor; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.contato_fornecedor (id_contato_fornecedor) FROM stdin;
\.


--
-- TOC entry 3693 (class 0 OID 16429)
-- Dependencies: 224
-- Data for Name: contato_podeser_contato_cliente; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.contato_podeser_contato_cliente (id_contato_contatocliente, id_contato_fornecedor, id_contato_cliente, id_contato) FROM stdin;
\.


--
-- TOC entry 3735 (class 0 OID 16579)
-- Dependencies: 266
-- Data for Name: dados_contador; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.dados_contador (id_dados_contador, nome, cpf, crc, cnpj, cep, endereco, numero, bairro, municipio, uf, fone, email) FROM stdin;
\.


--
-- TOC entry 3738 (class 0 OID 16592)
-- Dependencies: 269
-- Data for Name: empresa; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.empresa (id_empresa, id_dados_contador, id_certificado_digital, nome_fantasia, razao_social, endereco, bairro, municipio, uf, status, cep, numero, complemento, fone, celular, cnpj, inscricao_estadual, inscricao_municipal, email, site) FROM stdin;
\.


--
-- TOC entry 3740 (class 0 OID 16600)
-- Dependencies: 271
-- Data for Name: empresa_possue_centroestoque; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.empresa_possue_centroestoque (id_empresa_centroestoque, id_centro_estqoue, id_empresa) FROM stdin;
\.


--
-- TOC entry 3763 (class 0 OID 16686)
-- Dependencies: 294
-- Data for Name: faz_usuario_transacao; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.faz_usuario_transacao (id_usuario_transacao, id_transacao, id_usuario_sql) FROM stdin;
\.


--
-- TOC entry 3717 (class 0 OID 16516)
-- Dependencies: 248
-- Data for Name: grupo_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.grupo_produto (id_grupo_produto) FROM stdin;
\.


--
-- TOC entry 3731 (class 0 OID 16565)
-- Dependencies: 262
-- Data for Name: localizacao_possue_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.localizacao_possue_produto (id_localizacaoproduto, id_produto) FROM stdin;
\.


--
-- TOC entry 3685 (class 0 OID 16401)
-- Dependencies: 216
-- Data for Name: modulo; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.modulo (id_modulo) FROM stdin;
\.


--
-- TOC entry 3744 (class 0 OID 16614)
-- Dependencies: 275
-- Data for Name: modulo_possue_tela; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.modulo_possue_tela (id_modulo_tela, id_modulo, id_tela) FROM stdin;
\.


--
-- TOC entry 3702 (class 0 OID 16462)
-- Dependencies: 233
-- Data for Name: movimentacao_estoque; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.movimentacao_estoque (id_movimentacao_estoque) FROM stdin;
\.


--
-- TOC entry 3706 (class 0 OID 16476)
-- Dependencies: 237
-- Data for Name: movimentacao_possue_contato; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.movimentacao_possue_contato (id_movimentacao_contato, id_contato, id_movimentacao_estoque) FROM stdin;
\.


--
-- TOC entry 3727 (class 0 OID 16551)
-- Dependencies: 258
-- Data for Name: movimentacao_possue_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.movimentacao_possue_produto (id_movimentacao_produto, id_movimentacao_estoque, id_produto) FROM stdin;
\.


--
-- TOC entry 3708 (class 0 OID 16483)
-- Dependencies: 239
-- Data for Name: movimentacao_possue_tipomovimentacao; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.movimentacao_possue_tipomovimentacao (id_tipo_movimentacao, id_tipo_movimentacao_estqoue, id_movimentacao_estoque) FROM stdin;
\.


--
-- TOC entry 3695 (class 0 OID 16436)
-- Dependencies: 226
-- Data for Name: nota_fiscal_xml; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.nota_fiscal_xml (id_nota_fiscal_xml) FROM stdin;
\.


--
-- TOC entry 3697 (class 0 OID 16443)
-- Dependencies: 228
-- Data for Name: notafiscal_possue_fornecedor; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.notafiscal_possue_fornecedor (id_notafsical_fornecedor, id_nota_fiscal_xml, id_contato_fornecedor) FROM stdin;
\.


--
-- TOC entry 3729 (class 0 OID 16558)
-- Dependencies: 260
-- Data for Name: notafiscal_possue_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.notafiscal_possue_produto (id_nota_produto, id_produto, id_nota_fiscal_xml) FROM stdin;
\.


--
-- TOC entry 3746 (class 0 OID 16621)
-- Dependencies: 277
-- Data for Name: perfil; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.perfil (id_perfil) FROM stdin;
\.


--
-- TOC entry 3748 (class 0 OID 16628)
-- Dependencies: 279
-- Data for Name: perfil_possue_modulo; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.perfil_possue_modulo (id_perfil_modulo, id_modulo, id_perfil) FROM stdin;
\.


--
-- TOC entry 3750 (class 0 OID 16635)
-- Dependencies: 281
-- Data for Name: perfil_possue_tela; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.perfil_possue_tela (id_perfil_tela, id_tela, id_perfil) FROM stdin;
\.


--
-- TOC entry 3719 (class 0 OID 16523)
-- Dependencies: 250
-- Data for Name: produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.produto (id_produto) FROM stdin;
\.


--
-- TOC entry 3723 (class 0 OID 16537)
-- Dependencies: 254
-- Data for Name: produto_possue_fornecedor; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.produto_possue_fornecedor (id_produto_fornecedor, id_contato_fornecedor, id_produto) FROM stdin;
\.


--
-- TOC entry 3721 (class 0 OID 16530)
-- Dependencies: 252
-- Data for Name: produto_possue_grupo; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.produto_possue_grupo (id_produto_grupo, id_categoria_produto, id_subgrupo_produto, id_grupo_produto, id_produto) FROM stdin;
\.


--
-- TOC entry 3725 (class 0 OID 16544)
-- Dependencies: 256
-- Data for Name: produto_possue_tributacao; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.produto_possue_tributacao (id_produto_tributacao, id_tributacao_produto, id_produto) FROM stdin;
\.


--
-- TOC entry 3715 (class 0 OID 16509)
-- Dependencies: 246
-- Data for Name: subgrupo_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.subgrupo_produto (id_subgrupo_produto) FROM stdin;
\.


--
-- TOC entry 3742 (class 0 OID 16607)
-- Dependencies: 273
-- Data for Name: tela; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.tela (id_tela) FROM stdin;
\.


--
-- TOC entry 3700 (class 0 OID 16456)
-- Dependencies: 231
-- Data for Name: tipo_movimentacao_estqoue; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.tipo_movimentacao_estqoue (id_tipo_movimentacao_estqoue) FROM stdin;
\.


--
-- TOC entry 3759 (class 0 OID 16671)
-- Dependencies: 290
-- Data for Name: transacao_sql; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.transacao_sql (id_transacao, comando, tabela_afetada, data_execucao, resultado_execucao, ip_origem, id_sessao) FROM stdin;
\.


--
-- TOC entry 3712 (class 0 OID 16497)
-- Dependencies: 243
-- Data for Name: tributacao_produto; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.tributacao_produto (id_tributacao_produto) FROM stdin;
\.


--
-- TOC entry 3752 (class 0 OID 16642)
-- Dependencies: 283
-- Data for Name: usuario; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.usuario (id_usuario, nome, senha, email, celular, data_criacao, grupo) FROM stdin;
\.


--
-- TOC entry 3754 (class 0 OID 16651)
-- Dependencies: 285
-- Data for Name: usuario_conferencia; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.usuario_conferencia (id_usuario_conferencia, id_conferencia_produto, id_usuario) FROM stdin;
\.


--
-- TOC entry 3758 (class 0 OID 16665)
-- Dependencies: 289
-- Data for Name: usuario_possue_empresa; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.usuario_possue_empresa (id_usuario_empresa, id_empresa, id_usuario) FROM stdin;
\.


--
-- TOC entry 3756 (class 0 OID 16658)
-- Dependencies: 287
-- Data for Name: usuario_possue_perfil; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.usuario_possue_perfil (id_usuario_perfil, id_perfil, id_usuario) FROM stdin;
\.


--
-- TOC entry 3761 (class 0 OID 16679)
-- Dependencies: 292
-- Data for Name: usuario_sql; Type: TABLE DATA; Schema: sga; Owner: postgres
--

COPY sga.usuario_sql (id_usuario_sql, nome, senha) FROM stdin;
\.


--
-- TOC entry 3807 (class 0 OID 0)
-- Dependencies: 229
-- Name: centro_estqoue_id_centro_estqoue_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.centro_estqoue_id_centro_estqoue_seq', 7, true);


--
-- TOC entry 3808 (class 0 OID 0)
-- Dependencies: 240
-- Name: centro_possue_movimentacao_id_centro_movimentacao_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.centro_possue_movimentacao_id_centro_movimentacao_seq', 1, false);


--
-- TOC entry 3809 (class 0 OID 0)
-- Dependencies: 263
-- Name: centroestoque_possue_produto_id_centro_produto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.centroestoque_possue_produto_id_centro_produto_seq', 1, false);


--
-- TOC entry 3810 (class 0 OID 0)
-- Dependencies: 267
-- Name: certificado_digital_id_certificado_digital_seq_1; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.certificado_digital_id_certificado_digital_seq_1', 1, false);


--
-- TOC entry 3811 (class 0 OID 0)
-- Dependencies: 234
-- Name: conferencia_produto_id_conferencia_produto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.conferencia_produto_id_conferencia_produto_seq', 1, false);


--
-- TOC entry 3812 (class 0 OID 0)
-- Dependencies: 219
-- Name: contato_cliente_id_contato_cliente_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.contato_cliente_id_contato_cliente_seq', 1, false);


--
-- TOC entry 3813 (class 0 OID 0)
-- Dependencies: 217
-- Name: contato_fornecedor_id_contato_fornecedor_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.contato_fornecedor_id_contato_fornecedor_seq', 1, false);


--
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 221
-- Name: contato_id_contato_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.contato_id_contato_seq', 1, false);


--
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 223
-- Name: contato_podeser_contato_cliente_id_contato_contatocliente_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.contato_podeser_contato_cliente_id_contato_contatocliente_seq', 1, false);


--
-- TOC entry 3816 (class 0 OID 0)
-- Dependencies: 265
-- Name: dados_contador_dados_contador_seq_1; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.dados_contador_dados_contador_seq_1', 1, false);


--
-- TOC entry 3817 (class 0 OID 0)
-- Dependencies: 270
-- Name: empresa_possue_centroestoque_id_empresa_centroestoque_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.empresa_possue_centroestoque_id_empresa_centroestoque_seq', 1, false);


--
-- TOC entry 3818 (class 0 OID 0)
-- Dependencies: 293
-- Name: faz_usuario_transacao_id_usuario_transacao_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.faz_usuario_transacao_id_usuario_transacao_seq', 1, false);


--
-- TOC entry 3819 (class 0 OID 0)
-- Dependencies: 247
-- Name: grupo_produto_id_grupo_produto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.grupo_produto_id_grupo_produto_seq', 1, false);


--
-- TOC entry 3820 (class 0 OID 0)
-- Dependencies: 261
-- Name: localizacao_possue_produto_id_localizacaoproduto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.localizacao_possue_produto_id_localizacaoproduto_seq', 1, false);


--
-- TOC entry 3821 (class 0 OID 0)
-- Dependencies: 215
-- Name: modulo_id_modulo_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.modulo_id_modulo_seq', 1, false);


--
-- TOC entry 3822 (class 0 OID 0)
-- Dependencies: 274
-- Name: modulo_possue_tela_id_modulo_tela_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.modulo_possue_tela_id_modulo_tela_seq', 1, false);


--
-- TOC entry 3823 (class 0 OID 0)
-- Dependencies: 232
-- Name: movimentacao_estoque_id_movimentacao_estoque_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.movimentacao_estoque_id_movimentacao_estoque_seq', 1, false);


--
-- TOC entry 3824 (class 0 OID 0)
-- Dependencies: 236
-- Name: movimentacao_possue_contato_id_movimentacao_contato_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.movimentacao_possue_contato_id_movimentacao_contato_seq', 1, false);


--
-- TOC entry 3825 (class 0 OID 0)
-- Dependencies: 257
-- Name: movimentacao_possue_produto_id_movimentacao_produto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.movimentacao_possue_produto_id_movimentacao_produto_seq', 1, false);


--
-- TOC entry 3826 (class 0 OID 0)
-- Dependencies: 238
-- Name: movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq', 1, false);


--
-- TOC entry 3827 (class 0 OID 0)
-- Dependencies: 225
-- Name: nota_fiscal_xml_id_nota_fiscal_xml_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.nota_fiscal_xml_id_nota_fiscal_xml_seq', 1, false);


--
-- TOC entry 3828 (class 0 OID 0)
-- Dependencies: 227
-- Name: notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq', 1, false);


--
-- TOC entry 3829 (class 0 OID 0)
-- Dependencies: 259
-- Name: notafiscal_possue_produto_id_nota_produto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.notafiscal_possue_produto_id_nota_produto_seq', 1, false);


--
-- TOC entry 3830 (class 0 OID 0)
-- Dependencies: 276
-- Name: perfil_id_perfil_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.perfil_id_perfil_seq', 1, false);


--
-- TOC entry 3831 (class 0 OID 0)
-- Dependencies: 278
-- Name: perfil_possue_modulo_id_perfil_modulo_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.perfil_possue_modulo_id_perfil_modulo_seq', 1, false);


--
-- TOC entry 3832 (class 0 OID 0)
-- Dependencies: 280
-- Name: perfil_possue_tela_id_perfil_tela_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.perfil_possue_tela_id_perfil_tela_seq', 1, false);


--
-- TOC entry 3833 (class 0 OID 0)
-- Dependencies: 249
-- Name: produto_id_produto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.produto_id_produto_seq', 1, false);


--
-- TOC entry 3834 (class 0 OID 0)
-- Dependencies: 253
-- Name: produto_possue_fornecedor_id_produto_fornecedor_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.produto_possue_fornecedor_id_produto_fornecedor_seq', 1, false);


--
-- TOC entry 3835 (class 0 OID 0)
-- Dependencies: 251
-- Name: produto_possue_grupo_id_produto_grupo_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.produto_possue_grupo_id_produto_grupo_seq', 1, false);


--
-- TOC entry 3836 (class 0 OID 0)
-- Dependencies: 255
-- Name: produto_possue_tributacao_id_produto_tributacao_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.produto_possue_tributacao_id_produto_tributacao_seq', 1, false);


--
-- TOC entry 3837 (class 0 OID 0)
-- Dependencies: 245
-- Name: subgrupo_produto_id_subgrupo_produto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.subgrupo_produto_id_subgrupo_produto_seq', 1, false);


--
-- TOC entry 3838 (class 0 OID 0)
-- Dependencies: 272
-- Name: tela_id_tela_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.tela_id_tela_seq', 1, false);


--
-- TOC entry 3839 (class 0 OID 0)
-- Dependencies: 242
-- Name: tributacao_produto_id_tributacao_produto_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.tributacao_produto_id_tributacao_produto_seq', 1, false);


--
-- TOC entry 3840 (class 0 OID 0)
-- Dependencies: 284
-- Name: usuario_conferencia_id_usuario_conferencia_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.usuario_conferencia_id_usuario_conferencia_seq', 1, false);


--
-- TOC entry 3841 (class 0 OID 0)
-- Dependencies: 282
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.usuario_id_usuario_seq', 1, false);


--
-- TOC entry 3842 (class 0 OID 0)
-- Dependencies: 288
-- Name: usuario_possue_empresa_id_usuario_empresa_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.usuario_possue_empresa_id_usuario_empresa_seq', 1, false);


--
-- TOC entry 3843 (class 0 OID 0)
-- Dependencies: 286
-- Name: usuario_possue_perfil_id_usuario_perfil_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.usuario_possue_perfil_id_usuario_perfil_seq', 1, false);


--
-- TOC entry 3844 (class 0 OID 0)
-- Dependencies: 291
-- Name: usuario_sql_id_usuario_sql_seq; Type: SEQUENCE SET; Schema: sga; Owner: postgres
--

SELECT pg_catalog.setval('sga.usuario_sql_id_usuario_sql_seq', 1, false);


--
-- TOC entry 3496 (class 2606 OID 16691)
-- Name: faz_usuario_transacao id; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.faz_usuario_transacao
    ADD CONSTRAINT id PRIMARY KEY (id_usuario_transacao);


--
-- TOC entry 3444 (class 2606 OID 16507)
-- Name: categoria_produto id_categoria_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.categoria_produto
    ADD CONSTRAINT id_categoria_produto PRIMARY KEY (id_categoria_produto);


--
-- TOC entry 3428 (class 2606 OID 16455)
-- Name: centro_estoque id_centro_estqoue; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centro_estoque
    ADD CONSTRAINT id_centro_estqoue PRIMARY KEY (id_centro_estoque);


--
-- TOC entry 3440 (class 2606 OID 16495)
-- Name: centro_possue_movimentacao id_centro_movimentacao; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centro_possue_movimentacao
    ADD CONSTRAINT id_centro_movimentacao PRIMARY KEY (id_centro_movimentacao);


--
-- TOC entry 3464 (class 2606 OID 16577)
-- Name: centroestoque_possue_produto id_centro_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centroestoque_possue_produto
    ADD CONSTRAINT id_centro_produto PRIMARY KEY (id_centro_produto);


--
-- TOC entry 3468 (class 2606 OID 16591)
-- Name: certificado_digital id_certificado_digital; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.certificado_digital
    ADD CONSTRAINT id_certificado_digital PRIMARY KEY (id_certificado_digital);


--
-- TOC entry 3434 (class 2606 OID 16474)
-- Name: conferencia_produto id_conferencia_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.conferencia_produto
    ADD CONSTRAINT id_conferencia_produto PRIMARY KEY (id_conferencia_produto);


--
-- TOC entry 3420 (class 2606 OID 16427)
-- Name: contato id_contato; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato
    ADD CONSTRAINT id_contato PRIMARY KEY (id_contato);


--
-- TOC entry 3418 (class 2606 OID 16420)
-- Name: contato_cliente id_contato_cliente; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_cliente
    ADD CONSTRAINT id_contato_cliente PRIMARY KEY (id_contato_cliente);


--
-- TOC entry 3422 (class 2606 OID 16434)
-- Name: contato_podeser_contato_cliente id_contato_contatocliente; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_podeser_contato_cliente
    ADD CONSTRAINT id_contato_contatocliente PRIMARY KEY (id_contato_contatocliente);


--
-- TOC entry 3416 (class 2606 OID 16413)
-- Name: contato_fornecedor id_contato_fornecedor; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_fornecedor
    ADD CONSTRAINT id_contato_fornecedor PRIMARY KEY (id_contato_fornecedor);


--
-- TOC entry 3466 (class 2606 OID 16584)
-- Name: dados_contador id_dados_contador; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.dados_contador
    ADD CONSTRAINT id_dados_contador PRIMARY KEY (id_dados_contador);


--
-- TOC entry 3470 (class 2606 OID 16598)
-- Name: empresa id_empresa; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.empresa
    ADD CONSTRAINT id_empresa PRIMARY KEY (id_empresa);


--
-- TOC entry 3472 (class 2606 OID 16605)
-- Name: empresa_possue_centroestoque id_empresa_centroestqoue; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.empresa_possue_centroestoque
    ADD CONSTRAINT id_empresa_centroestqoue PRIMARY KEY (id_empresa_centroestoque);


--
-- TOC entry 3448 (class 2606 OID 16521)
-- Name: grupo_produto id_grupo_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.grupo_produto
    ADD CONSTRAINT id_grupo_produto PRIMARY KEY (id_grupo_produto);


--
-- TOC entry 3462 (class 2606 OID 16570)
-- Name: localizacao_possue_produto id_localizacao_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.localizacao_possue_produto
    ADD CONSTRAINT id_localizacao_produto PRIMARY KEY (id_localizacaoproduto);


--
-- TOC entry 3414 (class 2606 OID 16406)
-- Name: modulo id_modulo; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.modulo
    ADD CONSTRAINT id_modulo PRIMARY KEY (id_modulo);


--
-- TOC entry 3476 (class 2606 OID 16619)
-- Name: modulo_possue_tela id_modulo_tela; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.modulo_possue_tela
    ADD CONSTRAINT id_modulo_tela PRIMARY KEY (id_modulo_tela);


--
-- TOC entry 3436 (class 2606 OID 16481)
-- Name: movimentacao_possue_contato id_movimentacao_contato; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_contato
    ADD CONSTRAINT id_movimentacao_contato PRIMARY KEY (id_movimentacao_contato);


--
-- TOC entry 3432 (class 2606 OID 16467)
-- Name: movimentacao_estoque id_movimentacao_estoque; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_estoque
    ADD CONSTRAINT id_movimentacao_estoque PRIMARY KEY (id_movimentacao_estoque);


--
-- TOC entry 3458 (class 2606 OID 16556)
-- Name: movimentacao_possue_produto id_movimentacao_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_produto
    ADD CONSTRAINT id_movimentacao_produto PRIMARY KEY (id_movimentacao_produto);


--
-- TOC entry 3424 (class 2606 OID 16441)
-- Name: nota_fiscal_xml id_nota_fiscal_xml; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.nota_fiscal_xml
    ADD CONSTRAINT id_nota_fiscal_xml PRIMARY KEY (id_nota_fiscal_xml);


--
-- TOC entry 3460 (class 2606 OID 16563)
-- Name: notafiscal_possue_produto id_nota_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.notafiscal_possue_produto
    ADD CONSTRAINT id_nota_produto PRIMARY KEY (id_nota_produto);


--
-- TOC entry 3426 (class 2606 OID 16448)
-- Name: notafiscal_possue_fornecedor id_notafsical_fornecedor; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.notafiscal_possue_fornecedor
    ADD CONSTRAINT id_notafsical_fornecedor PRIMARY KEY (id_notafsical_fornecedor);


--
-- TOC entry 3478 (class 2606 OID 16626)
-- Name: perfil id_perfil; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil
    ADD CONSTRAINT id_perfil PRIMARY KEY (id_perfil);


--
-- TOC entry 3480 (class 2606 OID 16633)
-- Name: perfil_possue_modulo id_perfil_modulo; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil_possue_modulo
    ADD CONSTRAINT id_perfil_modulo PRIMARY KEY (id_perfil_modulo);


--
-- TOC entry 3482 (class 2606 OID 16640)
-- Name: perfil_possue_tela id_perfil_tela; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil_possue_tela
    ADD CONSTRAINT id_perfil_tela PRIMARY KEY (id_perfil_tela);


--
-- TOC entry 3450 (class 2606 OID 16528)
-- Name: produto id_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto
    ADD CONSTRAINT id_produto PRIMARY KEY (id_produto);


--
-- TOC entry 3454 (class 2606 OID 16542)
-- Name: produto_possue_fornecedor id_produto_fornecedor; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_fornecedor
    ADD CONSTRAINT id_produto_fornecedor PRIMARY KEY (id_produto_fornecedor);


--
-- TOC entry 3452 (class 2606 OID 16535)
-- Name: produto_possue_grupo id_produto_grupo; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_grupo
    ADD CONSTRAINT id_produto_grupo PRIMARY KEY (id_produto_grupo);


--
-- TOC entry 3456 (class 2606 OID 16549)
-- Name: produto_possue_tributacao id_produto_tributacao; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_tributacao
    ADD CONSTRAINT id_produto_tributacao PRIMARY KEY (id_produto_tributacao);


--
-- TOC entry 3446 (class 2606 OID 16514)
-- Name: subgrupo_produto id_subgrupo_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.subgrupo_produto
    ADD CONSTRAINT id_subgrupo_produto PRIMARY KEY (id_subgrupo_produto);


--
-- TOC entry 3474 (class 2606 OID 16612)
-- Name: tela id_tela; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.tela
    ADD CONSTRAINT id_tela PRIMARY KEY (id_tela);


--
-- TOC entry 3438 (class 2606 OID 16488)
-- Name: movimentacao_possue_tipomovimentacao id_tipo_movimentacao; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_tipomovimentacao
    ADD CONSTRAINT id_tipo_movimentacao PRIMARY KEY (id_tipo_movimentacao);


--
-- TOC entry 3430 (class 2606 OID 16460)
-- Name: tipo_movimentacao_estqoue id_tipo_movimentacao_estqoue; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.tipo_movimentacao_estqoue
    ADD CONSTRAINT id_tipo_movimentacao_estqoue PRIMARY KEY (id_tipo_movimentacao_estqoue);


--
-- TOC entry 3492 (class 2606 OID 16677)
-- Name: transacao_sql id_transacao_sql; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.transacao_sql
    ADD CONSTRAINT id_transacao_sql PRIMARY KEY (id_transacao);


--
-- TOC entry 3442 (class 2606 OID 16502)
-- Name: tributacao_produto id_tributacao_produto; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.tributacao_produto
    ADD CONSTRAINT id_tributacao_produto PRIMARY KEY (id_tributacao_produto);


--
-- TOC entry 3484 (class 2606 OID 16649)
-- Name: usuario id_usuario; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario
    ADD CONSTRAINT id_usuario PRIMARY KEY (id_usuario);


--
-- TOC entry 3490 (class 2606 OID 16670)
-- Name: usuario_possue_empresa id_usuario_empresa; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_possue_empresa
    ADD CONSTRAINT id_usuario_empresa PRIMARY KEY (id_usuario_empresa);


--
-- TOC entry 3488 (class 2606 OID 16663)
-- Name: usuario_possue_perfil id_usuario_perfil; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_possue_perfil
    ADD CONSTRAINT id_usuario_perfil PRIMARY KEY (id_usuario_perfil);


--
-- TOC entry 3494 (class 2606 OID 16684)
-- Name: usuario_sql id_usuario_sql; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_sql
    ADD CONSTRAINT id_usuario_sql PRIMARY KEY (id_usuario_sql);


--
-- TOC entry 3486 (class 2606 OID 16656)
-- Name: usuario_conferencia usuario_possue_conferencia; Type: CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_conferencia
    ADD CONSTRAINT usuario_possue_conferencia PRIMARY KEY (id_usuario_conferencia);


--
-- TOC entry 3509 (class 2606 OID 16797)
-- Name: produto_possue_grupo categoria_produto_produto_possue_grupo_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_grupo
    ADD CONSTRAINT categoria_produto_produto_possue_grupo_fk FOREIGN KEY (id_categoria_produto) REFERENCES sga.categoria_produto(id_categoria_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3507 (class 2606 OID 16752)
-- Name: centro_possue_movimentacao centro_estqoue_centro_possue_movimentacao_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centro_possue_movimentacao
    ADD CONSTRAINT centro_estqoue_centro_possue_movimentacao_fk FOREIGN KEY (id_centro_estqoue) REFERENCES sga.centro_estoque(id_centro_estoque) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3522 (class 2606 OID 16747)
-- Name: centroestoque_possue_produto centro_estqoue_centroestoque_possue_produto_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centroestoque_possue_produto
    ADD CONSTRAINT centro_estqoue_centroestoque_possue_produto_fk FOREIGN KEY (id_centro_estqoue) REFERENCES sga.centro_estoque(id_centro_estoque) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3526 (class 2606 OID 16742)
-- Name: empresa_possue_centroestoque centro_estqoue_empresa_possue_centroestoque_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.empresa_possue_centroestoque
    ADD CONSTRAINT centro_estqoue_empresa_possue_centroestoque_fk FOREIGN KEY (id_centro_estqoue) REFERENCES sga.centro_estoque(id_centro_estoque) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3524 (class 2606 OID 16852)
-- Name: empresa certificado_digital_empresa_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.empresa
    ADD CONSTRAINT certificado_digital_empresa_fk FOREIGN KEY (id_certificado_digital) REFERENCES sga.certificado_digital(id_certificado_digital) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3534 (class 2606 OID 16787)
-- Name: usuario_conferencia conferencia_produto_usuario_possue_conferencia_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_conferencia
    ADD CONSTRAINT conferencia_produto_usuario_possue_conferencia_fk FOREIGN KEY (id_conferencia_produto) REFERENCES sga.conferencia_produto(id_conferencia_produto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3497 (class 2606 OID 16717)
-- Name: contato_podeser_contato_cliente contato_cliente_contato_podeser_contato_cliente_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_podeser_contato_cliente
    ADD CONSTRAINT contato_cliente_contato_podeser_contato_cliente_fk FOREIGN KEY (id_contato_cliente) REFERENCES sga.contato_cliente(id_contato_cliente) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3498 (class 2606 OID 16727)
-- Name: contato_podeser_contato_cliente contato_contato_podeser_contato_cliente_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_podeser_contato_cliente
    ADD CONSTRAINT contato_contato_podeser_contato_cliente_fk FOREIGN KEY (id_contato) REFERENCES sga.contato(id_contato) ON UPDATE CASCADE ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3499 (class 2606 OID 16707)
-- Name: contato_podeser_contato_cliente contato_fornecedor_contato_podeser_contato_cliente_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.contato_podeser_contato_cliente
    ADD CONSTRAINT contato_fornecedor_contato_podeser_contato_cliente_fk FOREIGN KEY (id_contato_fornecedor) REFERENCES sga.contato_fornecedor(id_contato_fornecedor) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3500 (class 2606 OID 16712)
-- Name: notafiscal_possue_fornecedor contato_fornecedor_notafiscal_possue_fornecedor_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.notafiscal_possue_fornecedor
    ADD CONSTRAINT contato_fornecedor_notafiscal_possue_fornecedor_fk FOREIGN KEY (id_contato_fornecedor) REFERENCES sga.contato_fornecedor(id_contato_fornecedor) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3513 (class 2606 OID 16702)
-- Name: produto_possue_fornecedor contato_fornecedor_produto_possue_fornecedor_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_fornecedor
    ADD CONSTRAINT contato_fornecedor_produto_possue_fornecedor_fk FOREIGN KEY (id_contato_fornecedor) REFERENCES sga.contato_fornecedor(id_contato_fornecedor) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3503 (class 2606 OID 16722)
-- Name: movimentacao_possue_contato contato_movimentacao_possue_contato_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_contato
    ADD CONSTRAINT contato_movimentacao_possue_contato_fk FOREIGN KEY (id_contato) REFERENCES sga.contato(id_contato) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3525 (class 2606 OID 16847)
-- Name: empresa dados_contador_empresa_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.empresa
    ADD CONSTRAINT dados_contador_empresa_fk FOREIGN KEY (id_dados_contador) REFERENCES sga.dados_contador(id_dados_contador) ON UPDATE CASCADE ON DELETE RESTRICT DEFERRABLE;


--
-- TOC entry 3527 (class 2606 OID 16862)
-- Name: empresa_possue_centroestoque empresa_empresa_possue_centroestoque_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.empresa_possue_centroestoque
    ADD CONSTRAINT empresa_empresa_possue_centroestoque_fk FOREIGN KEY (id_empresa) REFERENCES sga.empresa(id_empresa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3538 (class 2606 OID 16857)
-- Name: usuario_possue_empresa empresa_usuario_possue_empresa_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_possue_empresa
    ADD CONSTRAINT empresa_usuario_possue_empresa_fk FOREIGN KEY (id_empresa) REFERENCES sga.empresa(id_empresa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3510 (class 2606 OID 16807)
-- Name: produto_possue_grupo grupo_produto_produto_possue_grupo_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_grupo
    ADD CONSTRAINT grupo_produto_produto_possue_grupo_fk FOREIGN KEY (id_grupo_produto) REFERENCES sga.grupo_produto(id_grupo_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3528 (class 2606 OID 16697)
-- Name: modulo_possue_tela modulo_modulo_possue_tela_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.modulo_possue_tela
    ADD CONSTRAINT modulo_modulo_possue_tela_fk FOREIGN KEY (id_modulo) REFERENCES sga.modulo(id_modulo) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3530 (class 2606 OID 16692)
-- Name: perfil_possue_modulo modulo_perfil_possue_modulo_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil_possue_modulo
    ADD CONSTRAINT modulo_perfil_possue_modulo_fk FOREIGN KEY (id_modulo) REFERENCES sga.modulo(id_modulo) ON UPDATE CASCADE ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3508 (class 2606 OID 16762)
-- Name: centro_possue_movimentacao movimentacao_estoque_centro_possue_movimentacao_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centro_possue_movimentacao
    ADD CONSTRAINT movimentacao_estoque_centro_possue_movimentacao_fk FOREIGN KEY (id_movimentacao_estoque) REFERENCES sga.movimentacao_estoque(id_movimentacao_estoque) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3502 (class 2606 OID 16782)
-- Name: conferencia_produto movimentacao_estoque_conferencia_produto_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.conferencia_produto
    ADD CONSTRAINT movimentacao_estoque_conferencia_produto_fk FOREIGN KEY (id_movimentacao_estoque) REFERENCES sga.movimentacao_estoque(id_movimentacao_estoque) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3504 (class 2606 OID 16777)
-- Name: movimentacao_possue_contato movimentacao_estoque_movimentacao_possue_contato_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_contato
    ADD CONSTRAINT movimentacao_estoque_movimentacao_possue_contato_fk FOREIGN KEY (id_movimentacao_estoque) REFERENCES sga.movimentacao_estoque(id_movimentacao_estoque) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3517 (class 2606 OID 16767)
-- Name: movimentacao_possue_produto movimentacao_estoque_movimentacao_possue_produto_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_produto
    ADD CONSTRAINT movimentacao_estoque_movimentacao_possue_produto_fk FOREIGN KEY (id_movimentacao_estoque) REFERENCES sga.movimentacao_estoque(id_movimentacao_estoque) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3505 (class 2606 OID 16772)
-- Name: movimentacao_possue_tipomovimentacao movimentacao_estoque_movimentacao_possue_tipomovimentacao_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_tipomovimentacao
    ADD CONSTRAINT movimentacao_estoque_movimentacao_possue_tipomovimentacao_fk FOREIGN KEY (id_movimentacao_estoque) REFERENCES sga.movimentacao_estoque(id_movimentacao_estoque) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3501 (class 2606 OID 16737)
-- Name: notafiscal_possue_fornecedor nota_fiscal_xml_notafiscal_possue_fornecedor_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.notafiscal_possue_fornecedor
    ADD CONSTRAINT nota_fiscal_xml_notafiscal_possue_fornecedor_fk FOREIGN KEY (id_nota_fiscal_xml) REFERENCES sga.nota_fiscal_xml(id_nota_fiscal_xml) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3519 (class 2606 OID 16732)
-- Name: notafiscal_possue_produto nota_fiscal_xml_notafiscal_possue_produto_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.notafiscal_possue_produto
    ADD CONSTRAINT nota_fiscal_xml_notafiscal_possue_produto_fk FOREIGN KEY (id_nota_fiscal_xml) REFERENCES sga.nota_fiscal_xml(id_nota_fiscal_xml) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3531 (class 2606 OID 16887)
-- Name: perfil_possue_modulo perfil_perfil_possue_modulo_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil_possue_modulo
    ADD CONSTRAINT perfil_perfil_possue_modulo_fk FOREIGN KEY (id_perfil) REFERENCES sga.perfil(id_perfil) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3532 (class 2606 OID 16882)
-- Name: perfil_possue_tela perfil_perfil_possue_tela_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil_possue_tela
    ADD CONSTRAINT perfil_perfil_possue_tela_fk FOREIGN KEY (id_perfil) REFERENCES sga.perfil(id_perfil) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3536 (class 2606 OID 16877)
-- Name: usuario_possue_perfil perfil_usuario_possue_perfil_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_possue_perfil
    ADD CONSTRAINT perfil_usuario_possue_perfil_fk FOREIGN KEY (id_perfil) REFERENCES sga.perfil(id_perfil) ON UPDATE CASCADE ON DELETE RESTRICT DEFERRABLE;


--
-- TOC entry 3523 (class 2606 OID 16812)
-- Name: centroestoque_possue_produto produto_centroestoque_possue_produto_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.centroestoque_possue_produto
    ADD CONSTRAINT produto_centroestoque_possue_produto_fk FOREIGN KEY (id_produto) REFERENCES sga.produto(id_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3521 (class 2606 OID 16817)
-- Name: localizacao_possue_produto produto_localizacao_possue_produto_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.localizacao_possue_produto
    ADD CONSTRAINT produto_localizacao_possue_produto_fk FOREIGN KEY (id_produto) REFERENCES sga.produto(id_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3518 (class 2606 OID 16827)
-- Name: movimentacao_possue_produto produto_movimentacao_possue_produto_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_produto
    ADD CONSTRAINT produto_movimentacao_possue_produto_fk FOREIGN KEY (id_produto) REFERENCES sga.produto(id_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3520 (class 2606 OID 16822)
-- Name: notafiscal_possue_produto produto_notafiscal_possue_produto_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.notafiscal_possue_produto
    ADD CONSTRAINT produto_notafiscal_possue_produto_fk FOREIGN KEY (id_produto) REFERENCES sga.produto(id_produto) ON UPDATE CASCADE ON DELETE RESTRICT DEFERRABLE;


--
-- TOC entry 3514 (class 2606 OID 16837)
-- Name: produto_possue_fornecedor produto_produto_possue_fornecedor_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_fornecedor
    ADD CONSTRAINT produto_produto_possue_fornecedor_fk FOREIGN KEY (id_produto) REFERENCES sga.produto(id_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3511 (class 2606 OID 16842)
-- Name: produto_possue_grupo produto_produto_possue_grupo_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_grupo
    ADD CONSTRAINT produto_produto_possue_grupo_fk FOREIGN KEY (id_produto) REFERENCES sga.produto(id_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3515 (class 2606 OID 16832)
-- Name: produto_possue_tributacao produto_produto_possue_tributacao_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_tributacao
    ADD CONSTRAINT produto_produto_possue_tributacao_fk FOREIGN KEY (id_produto) REFERENCES sga.produto(id_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3512 (class 2606 OID 16802)
-- Name: produto_possue_grupo subgrupo_produto_produto_possue_grupo_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_grupo
    ADD CONSTRAINT subgrupo_produto_produto_possue_grupo_fk FOREIGN KEY (id_subgrupo_produto) REFERENCES sga.subgrupo_produto(id_subgrupo_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3529 (class 2606 OID 16872)
-- Name: modulo_possue_tela tela_modulo_possue_tela_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.modulo_possue_tela
    ADD CONSTRAINT tela_modulo_possue_tela_fk FOREIGN KEY (id_tela) REFERENCES sga.tela(id_tela) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3533 (class 2606 OID 16867)
-- Name: perfil_possue_tela tela_perfil_possue_tela_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.perfil_possue_tela
    ADD CONSTRAINT tela_perfil_possue_tela_fk FOREIGN KEY (id_tela) REFERENCES sga.tela(id_tela) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3506 (class 2606 OID 16757)
-- Name: movimentacao_possue_tipomovimentacao tipo_movimentacao_estqoue_movimentacao_possue_tipomovimentac453; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.movimentacao_possue_tipomovimentacao
    ADD CONSTRAINT tipo_movimentacao_estqoue_movimentacao_possue_tipomovimentac453 FOREIGN KEY (id_tipo_movimentacao_estqoue) REFERENCES sga.tipo_movimentacao_estqoue(id_tipo_movimentacao_estqoue) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3540 (class 2606 OID 16907)
-- Name: faz_usuario_transacao transacao_sql_faz_usuario_transacao_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.faz_usuario_transacao
    ADD CONSTRAINT transacao_sql_faz_usuario_transacao_fk FOREIGN KEY (id_transacao) REFERENCES sga.transacao_sql(id_transacao) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3516 (class 2606 OID 16792)
-- Name: produto_possue_tributacao tributacao_produto_produto_possue_tributacao_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.produto_possue_tributacao
    ADD CONSTRAINT tributacao_produto_produto_possue_tributacao_fk FOREIGN KEY (id_tributacao_produto) REFERENCES sga.tributacao_produto(id_tributacao_produto) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3541 (class 2606 OID 16912)
-- Name: faz_usuario_transacao usuario_sql_faz_usuario_transacao_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.faz_usuario_transacao
    ADD CONSTRAINT usuario_sql_faz_usuario_transacao_fk FOREIGN KEY (id_usuario_sql) REFERENCES sga.usuario_sql(id_usuario_sql) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3535 (class 2606 OID 16902)
-- Name: usuario_conferencia usuario_usuario_possue_conferencia_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_conferencia
    ADD CONSTRAINT usuario_usuario_possue_conferencia_fk FOREIGN KEY (id_usuario) REFERENCES sga.usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3539 (class 2606 OID 16892)
-- Name: usuario_possue_empresa usuario_usuario_possue_empresa_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_possue_empresa
    ADD CONSTRAINT usuario_usuario_possue_empresa_fk FOREIGN KEY (id_usuario) REFERENCES sga.usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3537 (class 2606 OID 16897)
-- Name: usuario_possue_perfil usuario_usuario_possue_perfil_fk; Type: FK CONSTRAINT; Schema: sga; Owner: postgres
--

ALTER TABLE ONLY sga.usuario_possue_perfil
    ADD CONSTRAINT usuario_usuario_possue_perfil_fk FOREIGN KEY (id_usuario) REFERENCES sga.usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2025-02-21 17:10:39

--
-- PostgreSQL database dump complete
--

