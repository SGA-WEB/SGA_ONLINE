
CREATE SEQUENCE sga.modulo_id_modulo_seq;

CREATE TABLE sga.modulo (
                id_modulo INTEGER NOT NULL DEFAULT nextval('sga.modulo_id_modulo_seq'),
                CONSTRAINT id_modulo PRIMARY KEY (id_modulo)
);


ALTER SEQUENCE sga.modulo_id_modulo_seq OWNED BY sga.modulo.id_modulo;

CREATE SEQUENCE sga.contato_fornecedor_id_contato_fornecedor_seq;

CREATE TABLE sga.contato_fornecedor (
                id_contato_fornecedor INTEGER NOT NULL DEFAULT nextval('sga.contato_fornecedor_id_contato_fornecedor_seq'),
                CONSTRAINT id_contato_fornecedor PRIMARY KEY (id_contato_fornecedor)
);


ALTER SEQUENCE sga.contato_fornecedor_id_contato_fornecedor_seq OWNED BY sga.contato_fornecedor.id_contato_fornecedor;

CREATE SEQUENCE sga.contato_cliente_id_contato_cliente_seq;

CREATE TABLE sga.contato_cliente (
                id_contato_cliente INTEGER NOT NULL DEFAULT nextval('sga.contato_cliente_id_contato_cliente_seq'),
                CONSTRAINT id_contato_cliente PRIMARY KEY (id_contato_cliente)
);


ALTER SEQUENCE sga.contato_cliente_id_contato_cliente_seq OWNED BY sga.contato_cliente.id_contato_cliente;

CREATE SEQUENCE sga.contato_id_contato_seq;

CREATE TABLE sga.contato (
                id_contato INTEGER NOT NULL DEFAULT nextval('sga.contato_id_contato_seq'),
                CONSTRAINT id_contato PRIMARY KEY (id_contato)
);


ALTER SEQUENCE sga.contato_id_contato_seq OWNED BY sga.contato.id_contato;

CREATE SEQUENCE sga.contato_podeser_contato_cliente_id_contato_contatocliente_seq;

CREATE TABLE sga.contato_podeser_contato_cliente (
                id_contato_contatocliente INTEGER NOT NULL DEFAULT nextval('sga.contato_podeser_contato_cliente_id_contato_contatocliente_seq'),
                id_contato_fornecedor INTEGER NOT NULL,
                id_contato_cliente INTEGER NOT NULL,
                id_contato INTEGER NOT NULL,
                CONSTRAINT id_contato_contatocliente PRIMARY KEY (id_contato_contatocliente)
);


ALTER SEQUENCE sga.contato_podeser_contato_cliente_id_contato_contatocliente_seq OWNED BY sga.contato_podeser_contato_cliente.id_contato_contatocliente;

CREATE SEQUENCE sga.nota_fiscal_xml_id_nota_fiscal_xml_seq;

CREATE TABLE sga.nota_fiscal_xml (
                id_nota_fiscal_xml INTEGER NOT NULL DEFAULT nextval('sga.nota_fiscal_xml_id_nota_fiscal_xml_seq'),
                CONSTRAINT id_nota_fiscal_xml PRIMARY KEY (id_nota_fiscal_xml)
);


ALTER SEQUENCE sga.nota_fiscal_xml_id_nota_fiscal_xml_seq OWNED BY sga.nota_fiscal_xml.id_nota_fiscal_xml;

CREATE SEQUENCE sga.notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq;

CREATE TABLE sga.notafiscal_possue_fornecedor (
                id_notafsical_fornecedor INTEGER NOT NULL DEFAULT nextval('sga.notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq'),
                id_nota_fiscal_xml INTEGER NOT NULL,
                id_contato_fornecedor INTEGER NOT NULL,
                CONSTRAINT id_notafsical_fornecedor PRIMARY KEY (id_notafsical_fornecedor)
);


ALTER SEQUENCE sga.notafiscal_possue_fornecedor_id_notafsical_fornecedor_seq OWNED BY sga.notafiscal_possue_fornecedor.id_notafsical_fornecedor;

CREATE SEQUENCE sga.centro_estqoue_id_centro_estqoue_seq;

CREATE TABLE sga.centro_estqoue (
                id_centro_estqoue INTEGER NOT NULL DEFAULT nextval('sga.centro_estqoue_id_centro_estqoue_seq'),
                CONSTRAINT id_centro_estqoue PRIMARY KEY (id_centro_estqoue)
);


ALTER SEQUENCE sga.centro_estqoue_id_centro_estqoue_seq OWNED BY sga.centro_estqoue.id_centro_estqoue;

CREATE TABLE sga.tipo_movimentacao_estqoue (
                id_tipo_movimentacao_estqoue INTEGER NOT NULL,
                CONSTRAINT id_tipo_movimentacao_estqoue PRIMARY KEY (id_tipo_movimentacao_estqoue)
);


CREATE SEQUENCE sga.movimentacao_estoque_id_movimentacao_estoque_seq;

CREATE TABLE sga.movimentacao_estoque (
                id_movimentacao_estoque INTEGER NOT NULL DEFAULT nextval('sga.movimentacao_estoque_id_movimentacao_estoque_seq'),
                CONSTRAINT id_movimentacao_estoque PRIMARY KEY (id_movimentacao_estoque)
);


ALTER SEQUENCE sga.movimentacao_estoque_id_movimentacao_estoque_seq OWNED BY sga.movimentacao_estoque.id_movimentacao_estoque;

CREATE SEQUENCE sga.conferencia_produto_id_conferencia_produto_seq;

CREATE TABLE sga.conferencia_produto (
                id_conferencia_produto INTEGER NOT NULL DEFAULT nextval('sga.conferencia_produto_id_conferencia_produto_seq'),
                id_movimentacao_estoque INTEGER NOT NULL,
                data_criacao TIMESTAMP NOT NULL,
                CONSTRAINT id_conferencia_produto PRIMARY KEY (id_conferencia_produto)
);


ALTER SEQUENCE sga.conferencia_produto_id_conferencia_produto_seq OWNED BY sga.conferencia_produto.id_conferencia_produto;

CREATE SEQUENCE sga.movimentacao_possue_contato_id_movimentacao_contato_seq;

CREATE TABLE sga.movimentacao_possue_contato (
                id_movimentacao_contato INTEGER NOT NULL DEFAULT nextval('sga.movimentacao_possue_contato_id_movimentacao_contato_seq'),
                id_contato INTEGER NOT NULL,
                id_movimentacao_estoque INTEGER NOT NULL,
                CONSTRAINT id_movimentacao_contato PRIMARY KEY (id_movimentacao_contato)
);


ALTER SEQUENCE sga.movimentacao_possue_contato_id_movimentacao_contato_seq OWNED BY sga.movimentacao_possue_contato.id_movimentacao_contato;

CREATE SEQUENCE sga.movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq;

CREATE TABLE sga.movimentacao_possue_tipomovimentacao (
                id_tipo_movimentacao INTEGER NOT NULL DEFAULT nextval('sga.movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq'),
                id_tipo_movimentacao_estqoue INTEGER NOT NULL,
                id_movimentacao_estoque INTEGER NOT NULL,
                CONSTRAINT id_tipo_movimentacao PRIMARY KEY (id_tipo_movimentacao)
);


ALTER SEQUENCE sga.movimentacao_possue_tipomovimentacao_id_tipo_movimentacao_seq OWNED BY sga.movimentacao_possue_tipomovimentacao.id_tipo_movimentacao;

CREATE SEQUENCE sga.centro_possue_movimentacao_id_centro_movimentacao_seq;

CREATE TABLE sga.centro_possue_movimentacao (
                id_centro_movimentacao INTEGER NOT NULL DEFAULT nextval('sga.centro_possue_movimentacao_id_centro_movimentacao_seq'),
                id_movimentacao_estoque INTEGER NOT NULL,
                id_centro_estqoue INTEGER NOT NULL,
                CONSTRAINT id_centro_movimentacao PRIMARY KEY (id_centro_movimentacao)
);


ALTER SEQUENCE sga.centro_possue_movimentacao_id_centro_movimentacao_seq OWNED BY sga.centro_possue_movimentacao.id_centro_movimentacao;

CREATE SEQUENCE sga.tributacao_produto_id_tributacao_produto_seq;

CREATE TABLE sga.tributacao_produto (
                id_tributacao_produto INTEGER NOT NULL DEFAULT nextval('sga.tributacao_produto_id_tributacao_produto_seq'),
                CONSTRAINT id_tributacao_produto PRIMARY KEY (id_tributacao_produto)
);


ALTER SEQUENCE sga.tributacao_produto_id_tributacao_produto_seq OWNED BY sga.tributacao_produto.id_tributacao_produto;

CREATE TABLE sga.categoria_produto (
                id_categoria_produto INTEGER NOT NULL,
                CONSTRAINT id_categoria_produto PRIMARY KEY (id_categoria_produto)
);


CREATE SEQUENCE sga.subgrupo_produto_id_subgrupo_produto_seq;

CREATE TABLE sga.subgrupo_produto (
                id_subgrupo_produto INTEGER NOT NULL DEFAULT nextval('sga.subgrupo_produto_id_subgrupo_produto_seq'),
                CONSTRAINT id_subgrupo_produto PRIMARY KEY (id_subgrupo_produto)
);


ALTER SEQUENCE sga.subgrupo_produto_id_subgrupo_produto_seq OWNED BY sga.subgrupo_produto.id_subgrupo_produto;

CREATE SEQUENCE sga.grupo_produto_id_grupo_produto_seq;

CREATE TABLE sga.grupo_produto (
                id_grupo_produto INTEGER NOT NULL DEFAULT nextval('sga.grupo_produto_id_grupo_produto_seq'),
                CONSTRAINT id_grupo_produto PRIMARY KEY (id_grupo_produto)
);


ALTER SEQUENCE sga.grupo_produto_id_grupo_produto_seq OWNED BY sga.grupo_produto.id_grupo_produto;

CREATE SEQUENCE sga.produto_id_produto_seq;

CREATE TABLE sga.produto (
                id_produto INTEGER NOT NULL DEFAULT nextval('sga.produto_id_produto_seq'),
                CONSTRAINT id_produto PRIMARY KEY (id_produto)
);


ALTER SEQUENCE sga.produto_id_produto_seq OWNED BY sga.produto.id_produto;

CREATE SEQUENCE sga.produto_possue_grupo_id_produto_grupo_seq;

CREATE TABLE sga.produto_possue_grupo (
                id_produto_grupo INTEGER NOT NULL DEFAULT nextval('sga.produto_possue_grupo_id_produto_grupo_seq'),
                id_categoria_produto INTEGER NOT NULL,
                id_subgrupo_produto INTEGER NOT NULL,
                id_grupo_produto INTEGER NOT NULL,
                id_produto INTEGER NOT NULL,
                CONSTRAINT id_produto_grupo PRIMARY KEY (id_produto_grupo)
);


ALTER SEQUENCE sga.produto_possue_grupo_id_produto_grupo_seq OWNED BY sga.produto_possue_grupo.id_produto_grupo;

CREATE SEQUENCE sga.produto_possue_fornecedor_id_produto_fornecedor_seq;

CREATE TABLE sga.produto_possue_fornecedor (
                id_produto_fornecedor INTEGER NOT NULL DEFAULT nextval('sga.produto_possue_fornecedor_id_produto_fornecedor_seq'),
                id_contato_fornecedor INTEGER NOT NULL,
                id_produto INTEGER NOT NULL,
                CONSTRAINT id_produto_fornecedor PRIMARY KEY (id_produto_fornecedor)
);


ALTER SEQUENCE sga.produto_possue_fornecedor_id_produto_fornecedor_seq OWNED BY sga.produto_possue_fornecedor.id_produto_fornecedor;

CREATE SEQUENCE sga.produto_possue_tributacao_id_produto_tributacao_seq;

CREATE TABLE sga.produto_possue_tributacao (
                id_produto_tributacao INTEGER NOT NULL DEFAULT nextval('sga.produto_possue_tributacao_id_produto_tributacao_seq'),
                id_tributacao_produto INTEGER NOT NULL,
                id_produto INTEGER NOT NULL,
                CONSTRAINT id_produto_tributacao PRIMARY KEY (id_produto_tributacao)
);


ALTER SEQUENCE sga.produto_possue_tributacao_id_produto_tributacao_seq OWNED BY sga.produto_possue_tributacao.id_produto_tributacao;

CREATE SEQUENCE sga.movimentacao_possue_produto_id_movimentacao_produto_seq;

CREATE TABLE sga.movimentacao_possue_produto (
                id_movimentacao_produto INTEGER NOT NULL DEFAULT nextval('sga.movimentacao_possue_produto_id_movimentacao_produto_seq'),
                id_movimentacao_estoque INTEGER NOT NULL,
                id_produto INTEGER NOT NULL,
                CONSTRAINT id_movimentacao_produto PRIMARY KEY (id_movimentacao_produto)
);


ALTER SEQUENCE sga.movimentacao_possue_produto_id_movimentacao_produto_seq OWNED BY sga.movimentacao_possue_produto.id_movimentacao_produto;

CREATE SEQUENCE sga.notafiscal_possue_produto_id_nota_produto_seq;

CREATE TABLE sga.notafiscal_possue_produto (
                id_nota_produto INTEGER NOT NULL DEFAULT nextval('sga.notafiscal_possue_produto_id_nota_produto_seq'),
                id_produto INTEGER NOT NULL,
                id_nota_fiscal_xml INTEGER NOT NULL,
                CONSTRAINT id_nota_produto PRIMARY KEY (id_nota_produto)
);


ALTER SEQUENCE sga.notafiscal_possue_produto_id_nota_produto_seq OWNED BY sga.notafiscal_possue_produto.id_nota_produto;

CREATE SEQUENCE sga.localizacao_possue_produto_id_localizacaoproduto_seq;

CREATE TABLE sga.localizacao_possue_produto (
                id_localizacaoproduto INTEGER NOT NULL DEFAULT nextval('sga.localizacao_possue_produto_id_localizacaoproduto_seq'),
                id_produto INTEGER NOT NULL,
                CONSTRAINT id_localizacao_produto PRIMARY KEY (id_localizacaoproduto)
);


ALTER SEQUENCE sga.localizacao_possue_produto_id_localizacaoproduto_seq OWNED BY sga.localizacao_possue_produto.id_localizacaoproduto;

CREATE SEQUENCE sga.centroestoque_possue_produto_id_centro_produto_seq;

CREATE TABLE sga.centroestoque_possue_produto (
                id_centro_produto INTEGER NOT NULL DEFAULT nextval('sga.centroestoque_possue_produto_id_centro_produto_seq'),
                id_produto INTEGER NOT NULL,
                id_centro_estqoue INTEGER NOT NULL,
                CONSTRAINT id_centro_produto PRIMARY KEY (id_centro_produto)
);


ALTER SEQUENCE sga.centroestoque_possue_produto_id_centro_produto_seq OWNED BY sga.centroestoque_possue_produto.id_centro_produto;

CREATE SEQUENCE sga.dados_contador_dados_contador_seq_1;

CREATE TABLE sga.dados_contador (
                id_dados_contador INTEGER NOT NULL DEFAULT nextval('sga.dados_contador_dados_contador_seq_1'),
                nome VARCHAR(100),
                cpf VARCHAR(14),
                CRC VARCHAR(15),
                CNPJ VARCHAR(14),
                CEP VARCHAR(8),
                endereco VARCHAR(100),
                numero VARCHAR(5),
                bairro VARCHAR(30),
                municipio VARCHAR(30),
                UF VARCHAR(2) NOT NULL,
                fone VARCHAR(11),
                email VARCHAR(100),
                CONSTRAINT id_dados_contador PRIMARY KEY (id_dados_contador)
);


ALTER SEQUENCE sga.dados_contador_dados_contador_seq_1 OWNED BY sga.dados_contador.id_dados_contador;

CREATE SEQUENCE sga.certificado_digital_id_certificado_digital_seq_1;

CREATE TABLE sga.certificado_digital (
                id_certificado_digital INTEGER NOT NULL DEFAULT nextval('sga.certificado_digital_id_certificado_digital_seq_1'),
                numero_certificado VARCHAR(22) NOT NULL,
                CONSTRAINT id_certificado_digital PRIMARY KEY (id_certificado_digital)
);


ALTER SEQUENCE sga.certificado_digital_id_certificado_digital_seq_1 OWNED BY sga.certificado_digital.id_certificado_digital;

CREATE TABLE sga.empresa (
                id_empresa INTEGER NOT NULL,
                id_dados_contador INTEGER NOT NULL,
                id_certificado_digital INTEGER NOT NULL,
                nome_fantasia VARCHAR(100),
                razao_social VARCHAR(100) NOT NULL,
                endereco VARCHAR(100),
                bairro VARCHAR(30),
                municipio VARCHAR(30),
                UF VARCHAR(2) NOT NULL,
                status VARCHAR(7) NOT NULL,
                CEP VARCHAR(8),
                numero VARCHAR(5),
                complemento VARCHAR(30),
                fone VARCHAR(11),
                celular VARCHAR(11),
                CNPJ VARCHAR(18) NOT NULL,
                inscricao_estadual VARCHAR(14),
                inscricao_municipal VARCHAR(11),
                email VARCHAR(100),
                site VARCHAR(100),
                CONSTRAINT id_empresa PRIMARY KEY (id_empresa)
);


CREATE SEQUENCE sga.empresa_possue_centroestoque_id_empresa_centroestoque_seq;

CREATE TABLE sga.empresa_possue_centroestoque (
                id_empresa_centroestoque INTEGER NOT NULL DEFAULT nextval('sga.empresa_possue_centroestoque_id_empresa_centroestoque_seq'),
                id_centro_estqoue INTEGER NOT NULL,
                id_empresa INTEGER NOT NULL,
                CONSTRAINT id_empresa_centroestqoue PRIMARY KEY (id_empresa_centroestoque)
);


ALTER SEQUENCE sga.empresa_possue_centroestoque_id_empresa_centroestoque_seq OWNED BY sga.empresa_possue_centroestoque.id_empresa_centroestoque;

CREATE SEQUENCE sga.tela_id_tela_seq;

CREATE TABLE sga.tela (
                id_tela INTEGER NOT NULL DEFAULT nextval('sga.tela_id_tela_seq'),
                CONSTRAINT id_tela PRIMARY KEY (id_tela)
);


ALTER SEQUENCE sga.tela_id_tela_seq OWNED BY sga.tela.id_tela;

CREATE SEQUENCE sga.modulo_possue_tela_id_modulo_tela_seq;

CREATE TABLE sga.modulo_possue_tela (
                id_modulo_tela INTEGER NOT NULL DEFAULT nextval('sga.modulo_possue_tela_id_modulo_tela_seq'),
                id_modulo INTEGER NOT NULL,
                id_tela INTEGER NOT NULL,
                CONSTRAINT id_modulo_tela PRIMARY KEY (id_modulo_tela)
);


ALTER SEQUENCE sga.modulo_possue_tela_id_modulo_tela_seq OWNED BY sga.modulo_possue_tela.id_modulo_tela;

CREATE SEQUENCE sga.perfil_id_perfil_seq;

CREATE TABLE sga.perfil (
                id_perfil INTEGER NOT NULL DEFAULT nextval('sga.perfil_id_perfil_seq'),
                CONSTRAINT id_perfil PRIMARY KEY (id_perfil)
);


ALTER SEQUENCE sga.perfil_id_perfil_seq OWNED BY sga.perfil.id_perfil;

CREATE SEQUENCE sga.perfil_possue_modulo_id_perfil_modulo_seq;

CREATE TABLE sga.perfil_possue_modulo (
                id_perfil_modulo INTEGER NOT NULL DEFAULT nextval('sga.perfil_possue_modulo_id_perfil_modulo_seq'),
                id_modulo INTEGER NOT NULL,
                id_perfil INTEGER NOT NULL,
                CONSTRAINT id_perfil_modulo PRIMARY KEY (id_perfil_modulo)
);


ALTER SEQUENCE sga.perfil_possue_modulo_id_perfil_modulo_seq OWNED BY sga.perfil_possue_modulo.id_perfil_modulo;

CREATE SEQUENCE sga.perfil_possue_tela_id_perfil_tela_seq;

CREATE TABLE sga.perfil_possue_tela (
                id_perfil_tela INTEGER NOT NULL DEFAULT nextval('sga.perfil_possue_tela_id_perfil_tela_seq'),
                id_tela INTEGER NOT NULL,
                id_perfil INTEGER NOT NULL,
                CONSTRAINT id_perfil_tela PRIMARY KEY (id_perfil_tela)
);


ALTER SEQUENCE sga.perfil_possue_tela_id_perfil_tela_seq OWNED BY sga.perfil_possue_tela.id_perfil_tela;

CREATE SEQUENCE sga.usuario_id_usuario_seq;

CREATE TABLE sga.usuario (
                id_usuario INTEGER NOT NULL DEFAULT nextval('sga.usuario_id_usuario_seq'),
                nome VARCHAR(50) NOT NULL,
                senha VARCHAR(8) NOT NULL,
                email VARCHAR NOT NULL,
                celular VARCHAR,
                data_criacao TIMESTAMP NOT NULL,
                grupo VARCHAR(50),
                CONSTRAINT id_usuario PRIMARY KEY (id_usuario)
);


ALTER SEQUENCE sga.usuario_id_usuario_seq OWNED BY sga.usuario.id_usuario;

CREATE SEQUENCE sga.usuario_conferencia_id_usuario_conferencia_seq;

CREATE TABLE sga.usuario_conferencia (
                id_usuario_conferencia INTEGER NOT NULL DEFAULT nextval('sga.usuario_conferencia_id_usuario_conferencia_seq'),
                id_conferencia_produto INTEGER NOT NULL,
                id_usuario INTEGER NOT NULL,
                CONSTRAINT usuario_possue_conferencia PRIMARY KEY (id_usuario_conferencia)
);


ALTER SEQUENCE sga.usuario_conferencia_id_usuario_conferencia_seq OWNED BY sga.usuario_conferencia.id_usuario_conferencia;

CREATE SEQUENCE sga.usuario_possue_perfil_id_usuario_perfil_seq;

CREATE TABLE sga.usuario_possue_perfil (
                id_usuario_perfil INTEGER NOT NULL DEFAULT nextval('sga.usuario_possue_perfil_id_usuario_perfil_seq'),
                id_perfil INTEGER NOT NULL,
                id_usuario INTEGER NOT NULL,
                CONSTRAINT id_usuario_perfil PRIMARY KEY (id_usuario_perfil)
);


ALTER SEQUENCE sga.usuario_possue_perfil_id_usuario_perfil_seq OWNED BY sga.usuario_possue_perfil.id_usuario_perfil;

CREATE SEQUENCE sga.usuario_possue_empresa_id_usuario_empresa_seq;

CREATE TABLE sga.usuario_possue_empresa (
                id_usuario_empresa INTEGER NOT NULL DEFAULT nextval('sga.usuario_possue_empresa_id_usuario_empresa_seq'),
                id_empresa INTEGER NOT NULL,
                id_usuario INTEGER NOT NULL,
                CONSTRAINT id_usuario_empresa PRIMARY KEY (id_usuario_empresa)
);


ALTER SEQUENCE sga.usuario_possue_empresa_id_usuario_empresa_seq OWNED BY sga.usuario_possue_empresa.id_usuario_empresa;

CREATE TABLE sga.transacao_sql (
                id_transacao INTEGER NOT NULL,
                comando VARCHAR NOT NULL,
                tabela_afetada VARCHAR(100) NOT NULL,
                data_execucao TIMESTAMP NOT NULL,
                resultado_execucao VARCHAR(20) NOT NULL,
                ip_origem VARCHAR(45) NOT NULL,
                id_sessao VARCHAR(50) NOT NULL,
                CONSTRAINT id_transacao_sql PRIMARY KEY (id_transacao)
);


CREATE SEQUENCE sga.usuario_sql_id_usuario_sql_seq;

CREATE TABLE sga.usuario_SQL (
                id_usuario_sql INTEGER NOT NULL DEFAULT nextval('sga.usuario_sql_id_usuario_sql_seq'),
                nome VARCHAR(50) NOT NULL,
                senha VARCHAR(8) NOT NULL,
                CONSTRAINT id_usuario_sql PRIMARY KEY (id_usuario_sql)
);


ALTER SEQUENCE sga.usuario_sql_id_usuario_sql_seq OWNED BY sga.usuario_SQL.id_usuario_sql;

CREATE SEQUENCE sga.faz_usuario_transacao_id_usuario_transacao_seq;

CREATE TABLE sga.faz_usuario_transacao (
                id_usuario_transacao INTEGER NOT NULL DEFAULT nextval('sga.faz_usuario_transacao_id_usuario_transacao_seq'),
                id_transacao INTEGER NOT NULL,
                id_usuario_sql INTEGER NOT NULL,
                CONSTRAINT id PRIMARY KEY (id_usuario_transacao)
);


ALTER SEQUENCE sga.faz_usuario_transacao_id_usuario_transacao_seq OWNED BY sga.faz_usuario_transacao.id_usuario_transacao;

ALTER TABLE sga.perfil_possue_modulo ADD CONSTRAINT modulo_perfil_possue_modulo_fk
FOREIGN KEY (id_modulo)
REFERENCES sga.modulo (id_modulo)
ON DELETE RESTRICT
ON UPDATE CASCADE
DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE sga.modulo_possue_tela ADD CONSTRAINT modulo_modulo_possue_tela_fk
FOREIGN KEY (id_modulo)
REFERENCES sga.modulo (id_modulo)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.produto_possue_fornecedor ADD CONSTRAINT contato_fornecedor_produto_possue_fornecedor_fk
FOREIGN KEY (id_contato_fornecedor)
REFERENCES sga.contato_fornecedor (id_contato_fornecedor)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.contato_podeser_contato_cliente ADD CONSTRAINT contato_fornecedor_contato_podeser_contato_cliente_fk
FOREIGN KEY (id_contato_fornecedor)
REFERENCES sga.contato_fornecedor (id_contato_fornecedor)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.notafiscal_possue_fornecedor ADD CONSTRAINT contato_fornecedor_notafiscal_possue_fornecedor_fk
FOREIGN KEY (id_contato_fornecedor)
REFERENCES sga.contato_fornecedor (id_contato_fornecedor)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.contato_podeser_contato_cliente ADD CONSTRAINT contato_cliente_contato_podeser_contato_cliente_fk
FOREIGN KEY (id_contato_cliente)
REFERENCES sga.contato_cliente (id_contato_cliente)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.movimentacao_possue_contato ADD CONSTRAINT contato_movimentacao_possue_contato_fk
FOREIGN KEY (id_contato)
REFERENCES sga.contato (id_contato)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.contato_podeser_contato_cliente ADD CONSTRAINT contato_contato_podeser_contato_cliente_fk
FOREIGN KEY (id_contato)
REFERENCES sga.contato (id_contato)
ON DELETE RESTRICT
ON UPDATE CASCADE
DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE sga.notafiscal_possue_produto ADD CONSTRAINT nota_fiscal_xml_notafiscal_possue_produto_fk
FOREIGN KEY (id_nota_fiscal_xml)
REFERENCES sga.nota_fiscal_xml (id_nota_fiscal_xml)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.notafiscal_possue_fornecedor ADD CONSTRAINT nota_fiscal_xml_notafiscal_possue_fornecedor_fk
FOREIGN KEY (id_nota_fiscal_xml)
REFERENCES sga.nota_fiscal_xml (id_nota_fiscal_xml)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.empresa_possue_centroestoque ADD CONSTRAINT centro_estqoue_empresa_possue_centroestoque_fk
FOREIGN KEY (id_centro_estqoue)
REFERENCES sga.centro_estqoue (id_centro_estqoue)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.centroestoque_possue_produto ADD CONSTRAINT centro_estqoue_centroestoque_possue_produto_fk
FOREIGN KEY (id_centro_estqoue)
REFERENCES sga.centro_estqoue (id_centro_estqoue)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.centro_possue_movimentacao ADD CONSTRAINT centro_estqoue_centro_possue_movimentacao_fk
FOREIGN KEY (id_centro_estqoue)
REFERENCES sga.centro_estqoue (id_centro_estqoue)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.movimentacao_possue_tipomovimentacao ADD CONSTRAINT tipo_movimentacao_estqoue_movimentacao_possue_tipomovimentac453
FOREIGN KEY (id_tipo_movimentacao_estqoue)
REFERENCES sga.tipo_movimentacao_estqoue (id_tipo_movimentacao_estqoue)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.centro_possue_movimentacao ADD CONSTRAINT movimentacao_estoque_centro_possue_movimentacao_fk
FOREIGN KEY (id_movimentacao_estoque)
REFERENCES sga.movimentacao_estoque (id_movimentacao_estoque)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.movimentacao_possue_produto ADD CONSTRAINT movimentacao_estoque_movimentacao_possue_produto_fk
FOREIGN KEY (id_movimentacao_estoque)
REFERENCES sga.movimentacao_estoque (id_movimentacao_estoque)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.movimentacao_possue_tipomovimentacao ADD CONSTRAINT movimentacao_estoque_movimentacao_possue_tipomovimentacao_fk
FOREIGN KEY (id_movimentacao_estoque)
REFERENCES sga.movimentacao_estoque (id_movimentacao_estoque)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.movimentacao_possue_contato ADD CONSTRAINT movimentacao_estoque_movimentacao_possue_contato_fk
FOREIGN KEY (id_movimentacao_estoque)
REFERENCES sga.movimentacao_estoque (id_movimentacao_estoque)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.conferencia_produto ADD CONSTRAINT movimentacao_estoque_conferencia_produto_fk
FOREIGN KEY (id_movimentacao_estoque)
REFERENCES sga.movimentacao_estoque (id_movimentacao_estoque)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.usuario_conferencia ADD CONSTRAINT conferencia_produto_usuario_possue_conferencia_fk
FOREIGN KEY (id_conferencia_produto)
REFERENCES sga.conferencia_produto (id_conferencia_produto)
ON DELETE CASCADE
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.produto_possue_tributacao ADD CONSTRAINT tributacao_produto_produto_possue_tributacao_fk
FOREIGN KEY (id_tributacao_produto)
REFERENCES sga.tributacao_produto (id_tributacao_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.produto_possue_grupo ADD CONSTRAINT categoria_produto_produto_possue_grupo_fk
FOREIGN KEY (id_categoria_produto)
REFERENCES sga.categoria_produto (id_categoria_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.produto_possue_grupo ADD CONSTRAINT subgrupo_produto_produto_possue_grupo_fk
FOREIGN KEY (id_subgrupo_produto)
REFERENCES sga.subgrupo_produto (id_subgrupo_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.produto_possue_grupo ADD CONSTRAINT grupo_produto_produto_possue_grupo_fk
FOREIGN KEY (id_grupo_produto)
REFERENCES sga.grupo_produto (id_grupo_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.centroestoque_possue_produto ADD CONSTRAINT produto_centroestoque_possue_produto_fk
FOREIGN KEY (id_produto)
REFERENCES sga.produto (id_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.localizacao_possue_produto ADD CONSTRAINT produto_localizacao_possue_produto_fk
FOREIGN KEY (id_produto)
REFERENCES sga.produto (id_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.notafiscal_possue_produto ADD CONSTRAINT produto_notafiscal_possue_produto_fk
FOREIGN KEY (id_produto)
REFERENCES sga.produto (id_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE sga.movimentacao_possue_produto ADD CONSTRAINT produto_movimentacao_possue_produto_fk
FOREIGN KEY (id_produto)
REFERENCES sga.produto (id_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.produto_possue_tributacao ADD CONSTRAINT produto_produto_possue_tributacao_fk
FOREIGN KEY (id_produto)
REFERENCES sga.produto (id_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.produto_possue_fornecedor ADD CONSTRAINT produto_produto_possue_fornecedor_fk
FOREIGN KEY (id_produto)
REFERENCES sga.produto (id_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.produto_possue_grupo ADD CONSTRAINT produto_produto_possue_grupo_fk
FOREIGN KEY (id_produto)
REFERENCES sga.produto (id_produto)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.empresa ADD CONSTRAINT dados_contador_empresa_fk
FOREIGN KEY (id_dados_contador)
REFERENCES sga.dados_contador (id_dados_contador)
ON DELETE RESTRICT
ON UPDATE CASCADE
DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE sga.empresa ADD CONSTRAINT certificado_digital_empresa_fk
FOREIGN KEY (id_certificado_digital)
REFERENCES sga.certificado_digital (id_certificado_digital)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.usuario_possue_empresa ADD CONSTRAINT empresa_usuario_possue_empresa_fk
FOREIGN KEY (id_empresa)
REFERENCES sga.empresa (id_empresa)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.empresa_possue_centroestoque ADD CONSTRAINT empresa_empresa_possue_centroestoque_fk
FOREIGN KEY (id_empresa)
REFERENCES sga.empresa (id_empresa)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.perfil_possue_tela ADD CONSTRAINT tela_perfil_possue_tela_fk
FOREIGN KEY (id_tela)
REFERENCES sga.tela (id_tela)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.modulo_possue_tela ADD CONSTRAINT tela_modulo_possue_tela_fk
FOREIGN KEY (id_tela)
REFERENCES sga.tela (id_tela)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.usuario_possue_perfil ADD CONSTRAINT perfil_usuario_possue_perfil_fk
FOREIGN KEY (id_perfil)
REFERENCES sga.perfil (id_perfil)
ON DELETE RESTRICT
ON UPDATE CASCADE
DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE sga.perfil_possue_tela ADD CONSTRAINT perfil_perfil_possue_tela_fk
FOREIGN KEY (id_perfil)
REFERENCES sga.perfil (id_perfil)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.perfil_possue_modulo ADD CONSTRAINT perfil_perfil_possue_modulo_fk
FOREIGN KEY (id_perfil)
REFERENCES sga.perfil (id_perfil)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.usuario_possue_empresa ADD CONSTRAINT usuario_usuario_possue_empresa_fk
FOREIGN KEY (id_usuario)
REFERENCES sga.usuario (id_usuario)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.usuario_possue_perfil ADD CONSTRAINT usuario_usuario_possue_perfil_fk
FOREIGN KEY (id_usuario)
REFERENCES sga.usuario (id_usuario)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.usuario_conferencia ADD CONSTRAINT usuario_usuario_possue_conferencia_fk
FOREIGN KEY (id_usuario)
REFERENCES sga.usuario (id_usuario)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.faz_usuario_transacao ADD CONSTRAINT transacao_sql_faz_usuario_transacao_fk
FOREIGN KEY (id_transacao)
REFERENCES sga.transacao_sql (id_transacao)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE sga.faz_usuario_transacao ADD CONSTRAINT usuario_sql_faz_usuario_transacao_fk
FOREIGN KEY (id_usuario_sql)
REFERENCES sga.usuario_SQL (id_usuario_sql)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;
