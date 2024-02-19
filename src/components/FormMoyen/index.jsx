import { Button, Divider, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { BsCheck2, BsXLg } from "react-icons/bs";
import { findSelected } from "../../redux/slices/current";
import { updateFraud } from "../../redux/slices/fraud_cases";

const createMoyenSchema = yup.object().shape({
  category: yup.string().required("champ obligatoire"),
  marque: yup.string().required("champ obligatoire"),
  model: yup.string().required("champ obligatoire"),
  couleur: yup.string().required("champ obligatoire"),
  chassis: yup.string().min(2).max(120).optional(),
  plaque: yup.string().min(2).max(120).optional(),
});

function FormMoyen({ data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const form = useForm({
    validate: yupResolver(createMoyenSchema),
    initialValues: {
      category: "",
      marque: "",
      model: "",
      couleur: "",
      chassis: "",
      plaque: "",
    },
  });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const res = await dispatch(
      updateFraud({
        _id: data?._id,
        dataToSubmit: { ...values, action: "add-materials" },
      })
    );

    if (res.payload) {
      handleClose();
      await dispatch(findSelected(data?._id));
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
            label="Moyen utilisé pour frauder :"
            className="textinput"
            description="Category (exemple: Avion) : "
            style={{ width: "49%" }}
            {...form.getInputProps("category")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Marque : "
            style={{ width: "49%" }}
            {...form.getInputProps("marque")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Modèle du véhicule : "
            style={{ width: "49%" }}
            {...form.getInputProps("model")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Couleur : "
            style={{ width: "49%" }}
            {...form.getInputProps("couleur")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Chassis : "
            style={{ width: "49%" }}
            {...form.getInputProps("chassis")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Plaque : "
            style={{ width: "49%" }}
            {...form.getInputProps("plaque")}
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

export default FormMoyen;
