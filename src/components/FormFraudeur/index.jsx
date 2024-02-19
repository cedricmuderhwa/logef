import { Button, Checkbox, Divider, Select, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { BsCheck2, BsXLg } from "react-icons/bs";
import { createFraudeur } from "../../redux/slices/fraudeurs";

const createFraudeurSchema = yup.object().shape({
  isNegociant: yup.boolean().optional(),
  nationalite: yup.string().required("champ obligatoire"),
  gender: yup.string().required("champ obligatoire"),
  prenom: yup.string().required("champ obligatoire"),
  postnom: yup.string().required("champ obligatoire"),
  nom: yup.string().required("champ obligatoire"),
});

function FormFraudeur({ status, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const form = useForm({
    validate: yupResolver(createFraudeurSchema),
    initialValues: {
      isNegociant: false,
      nationalite: "",
      gender: "",
      prenom: "",
      postnom: "",
      nom: "",
    },
  });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const res = await dispatch(
      createFraudeur({
        dataToSubmit: {
          ...values,
          isNegociant: (status = "negociant" ? true : false),
        },
      })
    );

    if (res.payload) {
      handleClose();
      return showNotification({
        color: "green",
        title: "Réussite",
        message: "Enregistrement réussi!",
        icon: <BsCheck2 size={24} />,
      });
    }
    setloading(false);

    return showNotification({
      color: "red",
      title: "Erreur",
      message: "Echec de l'enregistrement!!",
      icon: <BsXLg size={26} />,
    });
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            label="Identité du presumé fraudeur :"
            className="textinput"
            description="Nom : "
            style={{ width: "49%" }}
            {...form.getInputProps("nom")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Postnom : "
            style={{ width: "49%" }}
            {...form.getInputProps("postnom")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Prénom : "
            style={{ width: "49%" }}
            {...form.getInputProps("prenom")}
          />
          <Select
            data={[
              { label: "Homme", value: "male" },
              { label: "Femme", value: "female" },
              { label: "Mineur", value: "minor" },
            ]}
            variant="filled"
            size="sm"
            className="textinput"
            description="Genre : "
            style={{ width: "49%" }}
            {...form.getInputProps("gender")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Nationalité : "
            style={{ width: "100%" }}
            {...form.getInputProps("nationalite")}
          />
        </div>

        <div className="dates">
          <Checkbox
            label="Le fraudeur est négociant"
            {...form.getInputProps("isNegociant", { checkbox: true })}
          />
        </div>

        <Divider style={{ marginTop: 14 }} />

        <div
          style={{
            float: "right",
            display: "inline-flex",
            alignItems: "center",
            marginTop: 28,
          }}
        >
          <Button
            compact
            loading={loading}
            leftIcon={<FaRegSave size={18} />}
            type="submit"
            color="blue"
            size="sm"
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormFraudeur;
