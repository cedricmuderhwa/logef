import { Button, Divider, Textarea } from "@mantine/core";
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

const createExecutionSchema = yup.object().shape({
  date: yup.date().required("champ obligatoire"),
  observation: yup.string().required("champ obligatoire"),
});

function FormExecution({ data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  LoadServices();

  const form = useForm({
    validate: yupResolver(createExecutionSchema),
    initialValues: {
      date: new Date(),
      observation: "",
    },
  });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const myDate = new Date(values.date);
    myDate.setDate(myDate.getDate() + parseInt(1));

    const res = await dispatch(
      updateFraud({
        _id: data?._id,
        dataToSubmit: {
          execution: { ...values, date: myDate, isComplete: true },
          action: "execution",
          status: "execution",
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
          <DatePicker
            variant="filled"
            size="sm"
            label="Exécution de la décision de la CNLFM "
            className="textinput"
            description="Date d'execution : "
            style={{ width: "100%" }}
            {...form.getInputProps("date")}
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

export default FormExecution;
