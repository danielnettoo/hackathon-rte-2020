import React from "react";

import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import axios from "axios";

import "./styles.css";

function Form() {
  return (
    <div id="page-form" className="container">
      <PageHeader
        title="Preencha o cadastro abaixo" /* description="Faça parte você também" */
      />

      <main>
        <fieldset>
          <legend>Dados do novo usuário</legend>

          <Input name="name" label="Nome Completo" />
          <Input name="internalid" label="Número de matrícula" />
          <Input name="avatar" label="Foto" />
          <Input name="bday" label="Data de nascimento" />
          <Input name="contact" label="Telefone" />
          <Input name="email" label="E-mail" />
        </fieldset>

        <footer>
          <button type="button">Salvar cadastro</button>
        </footer>
      </main>
    </div>
  );
}

export default Form;
