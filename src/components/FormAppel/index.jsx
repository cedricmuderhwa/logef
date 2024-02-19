import { Button, Divider, Select, Textarea } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { DatePicker } from "@mantine/dates";
import { BsCheck2, BsXLg } from "react-icons/bs";
import { LoadServices } from "../../hooks/fetchService";
import { updateFraud } from "../../redux/slices/fraud_cases";

const createAppelSchema = yup.object().shape({
  observation: yup.string().min(2).max(120).optional("champ obligatoire"),
  target: yup.string().min(2).max(120).required("champ obligatoire"),
  date: yup.date().required("champ obligatoire"),
});

function FormAppel({ data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  LoadServices();

  const form = useForm({
    validate: yupResolver(createAppelSchema),
    initialValues: {
      observation: "",
      target: "",
      date: new Date(),
    },
  });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const res = await dispatch(
      updateFraud({
        _id: data?._id,
        dataToSubmit: {
          appel: {
            ...values,
            level: values.target === "Cour de cassation" ? 2 : 1,
            isComplete: true,
          },
          action: "appel",
          status: "appel",
        },
      })
    );

    if (res.payload) {
      handleClose();
      return showNotification({
        color: "green",
        title: "Reussite",
        message: "Enregistrement reussi",
        icon: <BsCheck2 size={24} />,
      });
    }
    setloading(false);

    return showNotification({
      color: "red",
      title: "Erreur",
      message: "Echec de l'operation!!",
      icon: <BsXLg size={26} />,
    });
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <DatePicker
            variant="filled"
            size="sm"
            label="Fixation du dossier "
            className="textinput"
            description="Date de fixation : "
            style={{ width: "100%" }}
            {...form.getInputProps("date")}
          />
        </div>

        <div className="dates">
          <Select
            data={[
              "Tribunal de Grandes Instances",
              "Tribunal du Commerce",
              "Cour d'appel",
              "Cour de cassation",
            ]}
            variant="filled"
            size="sm"
            className="textinput"
            description="Niveau d'appel :"
            style={{ width: "100%" }}
            {...form.getInputProps("target")}
          />
        </div>

        <div className="dates" style={{ marginBottom: 14 }}>
          <Textarea
            {...form.getInputProps("observation")}
            label="Observation: "
            style={{ width: "100%" }}
            variant="filled"
            size="sm"
            className="textinput"
            description="Parlez brievement de la raison de cette orientation."
            placeholder="Parlez brievement..."
            autosize
            minRows={2}
            maxRows={5}
          />
        </div>

        <Divider />

        <div
          style={{
            float: "right",
            display: "inline-flex",
            alignItems: "center",
            marginTop: 14,
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

export default FormAppel;
